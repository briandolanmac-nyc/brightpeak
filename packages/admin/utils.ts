import { FIELD_LABEL_OVERRIDES } from "./config";

export function formatLabel(key: string): string {
  if (FIELD_LABEL_OVERRIDES[key]) return FIELD_LABEL_OVERRIDES[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

export function setNestedValue(obj: unknown, path: string, value: unknown): unknown {
  if (!path) return value;
  const keys = path.split(".");
  const result = JSON.parse(JSON.stringify(obj));
  let current: Record<string, unknown> = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const numKey = Number(key);
    if (!isNaN(numKey) && Array.isArray(current)) {
      current = current[numKey] as Record<string, unknown>;
    } else {
      current = current[key] as Record<string, unknown>;
    }
  }

  const lastKey = keys[keys.length - 1];
  const numLastKey = Number(lastKey);
  if (!isNaN(numLastKey) && Array.isArray(current)) {
    (current as unknown[])[numLastKey] = value;
  } else {
    current[lastKey] = value;
  }

  return result;
}

export interface FileData {
  file: string;
  data: Record<string, unknown>;
}
