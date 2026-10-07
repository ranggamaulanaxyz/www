import { useState } from "react";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setResponse("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/app/assistant/ai", {
      method: "POST",
      body: formData,
    });

    if (!response.body) {
      throw new Error("Response body is empty");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, {
          stream: true,
        });

        setResponse((current) => current + chunk);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Form method="post" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tulis pesan..."
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Kirim"}
        </Button>
      </Form>

      <div className="whitespace-pre-wrap">{response}</div>
    </div>
  );
}
