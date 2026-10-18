export function getRangeSize(from: number, to: number): number {
  return to - (from - 1);
}

export function parseRange(input: {from?: number, to?: number}) {
  let from = 1;
  let to = 84
  let size = getRangeSize(from, to)
  if (input?.from && input?.from > 0) {
    from = input.from;
  }

  if (input?.to && input?.to >= from) {
    to = input.to;
  }

  if (from > to) {
    to = from + size - 1;
  }

  return {from, to}
}

export function parseMetadata(data: {count: number | null, range: {from: number, to: number}}) {
  const count = data.count || 0

  return {
    count: count,
    from: data.range.from,
    to: Math.min(count, data.range.to),
    size: getRangeSize(data.range.from, data.range.to)
  }
}