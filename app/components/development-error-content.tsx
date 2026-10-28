import { BugIcon } from "lucide-react";

/**
 * Helper untuk memformat string stack trace menjadi elemen JSX berwarna
 */
function renderColoredStack(stackStr?: string) {
  if (!stackStr) return null;

  const lines = stackStr.split("\n");

  return lines.map((line, index) => {
    // Baris pertama (Header Error: misal TypeError: pesan error)
    if (index === 0) {
      return (
        <div key={index} className="font-bold text-red-400">
          {line}
        </div>
      );
    }

    // Parsing baris stack "at FunctionName (path/to/file.js:10:15)"
    const stackRegex = /^(\s*at\s+)(?:([^\s(]+)\s+)?(?:\((.*)\)|(.*))$/;
    const match = line.match(stackRegex);

    if (match) {
      const fnName = match[2] || "";
      const pathAndLine = match[3] || match[4] || "";

      // Pisahkan file path dengan nomor baris & kolom
      const pathMatch = pathAndLine.match(/^(.*?)(?::(\d+):(\d+))?$/);
      let pathOnly = pathAndLine;
      let lineCol = "";

      if (pathMatch) {
        pathOnly = pathMatch[1] || "";
        const lineNo = pathMatch[2];
        const colNo = pathMatch[3];
        if (lineNo) {
          lineCol = `:${lineNo}${colNo ? `:${colNo}` : ""}`;
        }
      }

      const isNodeModule =
        pathOnly.includes("node_modules") || pathOnly.startsWith("node:");

      return (
        <div key={index} className="text-gray-400">
          <span className="text-gray-600"> at </span>
          {fnName && (
            <span className="font-semibold text-emerald-400">{fnName} </span>
          )}
          <span className="text-gray-500">{match[3] ? "(" : ""}</span>
          <span className={isNodeModule ? "text-gray-500" : "text-cyan-300"}>
            {pathOnly}
          </span>
          <span className="font-medium text-amber-400">{lineCol}</span>
          <span className="text-gray-500">{match[3] ? ")" : ""}</span>
        </div>
      );
    }

    // Baris teks biasa jika tidak cocok dengan pola stack
    return (
      <div key={index} className="text-gray-300">
        {line}
      </div>
    );
  });
}

export default function DevelopmentErrorContent({ error }: { error: Error }) {
  return (
    <main className="p-4">
      <h1 className="flex items-center gap-2 text-xl font-bold md:text-2xl">
        <BugIcon /> Kesalahan Sistem!
      </h1>
      <table className="mb-2">
        <tbody>
          <tr>
            <th className="text-left">Nama</th>
            <td className="px-2">:</td>
            <td>{error.name}</td>
          </tr>
          <tr>
            <th className="text-left">Deskripsi</th>
            <td className="px-2">:</td>
            <td>{error.message}</td>
          </tr>
        </tbody>
      </table>
      {error.stack && (
        <pre className="overflow-auto rounded bg-gray-900 p-4 text-red-200">
          {renderColoredStack(error.stack)}
        </pre>
      )}
    </main>
  );
}
