export function parseFilter(searchParams: URLSearchParams) {
  const query = searchParams.get("query");
  const from = parseInt(searchParams.get("from") || "0");
  const to = parseInt(searchParams.get("to") || "0");

  return { query, from, to };
}
