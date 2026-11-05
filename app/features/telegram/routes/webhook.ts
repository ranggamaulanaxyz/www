import { getEnv } from "~/utils/env.server";
import type { Route } from "./+types/webhook";
import { Ollama } from "ollama";

const ollama = new Ollama({
  host: "https://ollama.ranggamaulana.xyz",
  headers: {
    "CF-Access-Client-Id": getEnv("CLOUDFLARE_ACCESS_CLIENT_ID"),
    "CF-Access-Client-Secret": getEnv("CLOUDFLARE_ACCESS_CLIENT_SECRET"),
  },
});

async function sendTyping(chatId: number) {
  await fetch(
    `https://api.telegram.org/bot${getEnv("ZET_TELEGRAM_API_TOKEN")}/sendChatAction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        action: "typing",
      }),
    },
  );
}

async function sendMessage(
  chatId: number,
  messageId: number | undefined,
  text: string,
) {
  const response = await fetch(
    `https://api.telegram.org/bot${getEnv("ZET_TELEGRAM_API_TOKEN")}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        ...(messageId && {
          reply_parameters: {
            message_id: messageId,
          },
        }),
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.status}`);
  }

  return response.json();
}

// ============================================
// 1. TOOL IMPLEMENTATIONS
// ============================================

type WeatherUnit = "celsius" | "fahrenheit";

type OpenMeteoGeocodingResult = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
};

type OpenMeteoGeocodingResponse = {
  results?: OpenMeteoGeocodingResult[];
};

type OpenMeteoWeatherResponse = {
  current?: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    is_day: number;
  };
  timezone?: string;
};

const weatherCodeDescriptions: Record<number, string> = {
  0: "Cerah",
  1: "Cerah berawan",
  2: "Berawan sebagian",
  3: "Mendung",
  45: "Berkabut",
  48: "Kabut beku",
  51: "Gerimis ringan",
  53: "Gerimis sedang",
  55: "Gerimis lebat",
  56: "Gerimis beku ringan",
  57: "Gerimis beku lebat",
  61: "Hujan ringan",
  63: "Hujan sedang",
  65: "Hujan lebat",
  66: "Hujan beku ringan",
  67: "Hujan beku lebat",
  71: "Salju ringan",
  73: "Salju sedang",
  75: "Salju lebat",
  77: "Butiran salju",
  80: "Hujan lokal ringan",
  81: "Hujan lokal sedang",
  82: "Hujan lokal lebat",
  85: "Hujan salju ringan",
  86: "Hujan salju lebat",
  95: "Badai petir",
  96: "Badai petir dengan hujan es ringan",
  99: "Badai petir dengan hujan es lebat",
};

async function geocodeLocation(location: string) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", location);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "id");
  url.searchParams.set("format", "json");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Gagal mencari lokasi "${location}" (HTTP ${response.status}).`,
    );
  }

  const data = (await response.json()) as OpenMeteoGeocodingResponse;
  const result = data.results?.[0];

  if (!result) {
    throw new Error(`Lokasi "${location}" tidak ditemukan.`);
  }

  return result;
}

async function getCurrentWeather(args: {
  location: string;
  unit?: WeatherUnit;
}) {
  const unit = args.unit ?? "celsius";
  const place = await geocodeLocation(args.location);

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(place.latitude));
  url.searchParams.set("longitude", String(place.longitude));
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "is_day",
    ].join(","),
  );
  url.searchParams.set("temperature_unit", unit);
  url.searchParams.set(
    "wind_speed_unit",
    unit === "fahrenheit" ? "mph" : "kmh",
  );
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Gagal mengambil data cuaca (HTTP ${response.status}).`);
  }

  const data = (await response.json()) as OpenMeteoWeatherResponse;
  const current = data.current;

  if (!current) {
    throw new Error("Data cuaca tidak tersedia untuk lokasi tersebut.");
  }

  const weatherUnit = unit === "fahrenheit" ? "°F" : "°C";
  const windUnit = unit === "fahrenheit" ? "mph" : "km/jam";

  return {
    location: [place.name, place.admin1, place.country]
      .filter(Boolean)
      .join(", "),
    temperature: `${current.temperature_2m} ${weatherUnit}`,
    apparentTemperature: `${current.apparent_temperature} ${weatherUnit}`,
    unit,
    condition:
      weatherCodeDescriptions[current.weather_code] ?? "Tidak diketahui",
    humidity: `${current.relative_humidity_2m}%`,
    windSpeed: `${current.wind_speed_10m} ${windUnit}`,
    precipitation: `${current.precipitation} mm`,
    isDay: current.is_day === 1,
    timezone: data.timezone,
    observedAt: current.time,
  };
}

async function getCurrentTime(args: { timezone: string }) {
  return {
    timezone: args.timezone,
    currentTime: new Intl.DateTimeFormat("id-ID", {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: args.timezone,
    }).format(new Date()),
  };
}

// ============================================
// 2. TOOL REGISTRY
// ============================================

const toolRegistry = {
  getCurrentWeather: {
    description: "Mendapatkan informasi cuaca terkini untuk suatu kota.",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "Nama kota, contoh: Jakarta, Batam, Singapura.",
        },
        unit: {
          type: "string",
          enum: ["celsius", "fahrenheit"],
        },
      },
      required: ["location"],
    },
    execute: getCurrentWeather,
  },

  getCurrentTime: {
    description: "Mendapatkan waktu terkini berdasarkan timezone.",
    parameters: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "Timezone, contoh Asia/Jakarta atau Asia/Singapore.",
        },
      },
      required: ["timezone"],
    },
    execute: getCurrentTime,
  },
};

// ============================================
// 3. GENERATE OLLAMA TOOLS
// ============================================

const availableTools = Object.entries(toolRegistry).map(([name, tool]) => ({
  type: "function" as const,
  function: {
    name,
    description: tool.description,
    parameters: tool.parameters,
  },
}));

// ============================================
// 4. TOOL ROUTER
// ============================================

async function executeTool(name: string, args: Record<string, unknown>) {
  const tool = toolRegistry[name as keyof typeof toolRegistry];

  if (!tool) {
    throw new Error(`Tool "${name}" tidak ditemukan.`);
  }

  return await tool.execute(args as never);
}

// ============================================
// 5. AI TOOL EXECUTION LOOP
// ============================================

async function runAssistant(userMessage: string) {
  const messages: Parameters<typeof ollama.chat>[0]["messages"] = [
    {
      role: "system",
      content: `
        Kamu adalah Zet, personal AI assistant.
        Jawab menggunakan bahasa yang digunakan pengguna.
        Gunakan tools jika membutuhkan informasi eksternal.
        Jangan mengarang hasil dari tools.
      `,
    },
    {
      role: "user",
      content: userMessage,
    },
  ];

  const MAX_ITERATIONS = 5;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await ollama.chat({
      model: "zet",
      messages,
      tools: availableTools,
      think: false,
    });

    const assistantMessage = response.message;

    // Simpan respons assistant, termasuk tool_calls.
    messages.push(assistantMessage);

    const toolCalls = assistantMessage.tool_calls ?? [];

    // Tidak ada tool yang dipanggil, berarti jawaban final.
    if (toolCalls.length === 0) {
      return assistantMessage.content;
    }

    // Eksekusi seluruh tool yang diminta AI.
    for (const toolCall of toolCalls) {
      const toolName = toolCall.function.name;
      const toolArgs = toolCall.function.arguments;

      try {
        const result = await executeTool(toolName, toolArgs);

        messages.push({
          role: "tool",
          tool_name: toolName,
          content: JSON.stringify(result),
        });
      } catch (error) {
        messages.push({
          role: "tool",
          tool_name: toolName,
          content: JSON.stringify({
            error:
              error instanceof Error ? error.message : "Unknown tool error",
          }),
        });
      }
    }
  }

  throw new Error("AI mencapai batas maksimal tool execution.");
}

// ============================================
// 6. REACT ROUTER WEBHOOK
// ============================================

export async function loader() {
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const requestData = (await request.json()) as any;

  const chatId = requestData?.message?.chat?.id;
  const messageId = requestData?.message?.message_id;
  const userMessage = requestData?.message?.text;

  if (!chatId || !userMessage) {
    return { success: false };
  }

  try {
    await sendTyping(chatId);

    const answer = await runAssistant(userMessage);

    await sendMessage(chatId, messageId, answer);

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    await sendMessage(chatId, messageId, errorMessage);

    return { success: false };
  }
}
