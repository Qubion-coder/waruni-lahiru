export const COUPLE = {
  bride: "Waruni",
  groom: "Lahiru",
} as const;

export const PREFIXES = [
  { key: "mr", label: "Mr." },
  { key: "mrs", label: "Mrs." },
  { key: "miss", label: "Miss" },
  { key: "mr-mrs", label: "Mr. & Mrs." },
  { key: "family", label: "Family" },
  { key: "dear", label: "Dear" },
] as const;

export type PrefixKey = (typeof PREFIXES)[number]["key"];

const isPrefixKey = (value: string): value is PrefixKey => PREFIXES.some((p) => p.key === value);

/**
 * "Dear" is a greeting style, not a title: it contributes nothing to the display
 * name so the message greeting ("Dear …") never doubles up.
 */
export function buildDisplayName(prefix: PrefixKey, guestName: string): string {
  const name = guestName.trim().replace(/\s+/g, " ");
  if (!name) return "";

  switch (prefix) {
    case "family":
      return `${name} and Family`;
    case "dear":
      return name;
    default:
      return `${PREFIXES.find((p) => p.key === prefix)!.label} ${name}`;
  }
}

/** Builds `{baseURL}/{guestName}`; the prefix rides along as `?p=` (omitted for "Dear"). */
export function buildInviteLink(baseUrl: string, prefix: PrefixKey, guestName: string): string {
  const name = guestName.trim().replace(/\s+/g, " ");
  const url = new URL(`/${encodeURIComponent(name)}`, baseUrl);
  if (prefix !== "dear") url.searchParams.set("p", prefix);
  return url.toString();
}

export function buildInviteMessage(displayName: string, link: string): string {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${COUPLE.groom} & ${COUPLE.bride}`;
}

/** Reads the guest from `/{guestName}?p=…`, falling back to the older `?prefix=&name=` links. */
export function readGuestFromLocation(location: Location): { guestName: string; displayName: string } | null {
  const params = new URLSearchParams(location.search);

  const legacyName = params.get("name")?.trim();
  if (legacyName) {
    const legacyPrefix = params.get("prefix")?.trim();
    return { guestName: legacyName, displayName: legacyPrefix ? `${legacyPrefix} ${legacyName}` : legacyName };
  }

  const segment = location.pathname.replace(/^\/+|\/+$/g, "");
  if (!segment || segment.includes("/")) return null;

  let guestName: string;
  try {
    guestName = decodeURIComponent(segment).trim();
  } catch {
    return null;
  }
  if (!guestName) return null;

  const p = params.get("p") ?? "dear";
  const prefix: PrefixKey = isPrefixKey(p) ? p : "dear";
  return { guestName, displayName: buildDisplayName(prefix, guestName) };
}
