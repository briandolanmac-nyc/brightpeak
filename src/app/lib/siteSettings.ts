export function getVoltfloUrl(settings?: Record<string, unknown>): string {
  const s = settings || ({} as any);
  return s.voltfloCalculatorUrl || "/contact";
}

export function getContactFormUrl(settings?: Record<string, unknown>): string {
  const s = settings || ({} as any);
  const cf = s.contactForm;
  if (!cf) return "/contact";
  if (typeof cf === "string") return cf || "/contact";
  if (typeof cf === "object" && cf.mode === "remote" && cf.remoteUrl) return cf.remoteUrl;
  if (typeof cf === "object" && cf.localPath) return cf.localPath;
  return "/contact";
}

export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export function externalLinkProps(url: string): { target?: string; rel?: string } {
  if (isExternalUrl(url)) {
    return { target: "_blank", rel: "noopener noreferrer" };
  }
  return {};
}
