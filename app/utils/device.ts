export function isMobileUserAgent(userAgent: string = ""): boolean {
  return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
    userAgent,
  );
}
