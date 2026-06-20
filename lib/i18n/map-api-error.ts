/** Maps English API error messages to toolApi message keys. */
const API_ERROR_KEY_MAP: Record<string, string> = {
  "Unable to reach the calculation API.": "networkError",
  "Calculation failed.": "calculationFailed",
  "Request body must be valid JSON.": "invalidJson",
  "Tool API not found.": "toolNotFound",
  "Tool not found.": "toolNotFound",
  "Invalid weight or height values.": "invalidWeightOrHeight",
};

export function getApiErrorKey(message: string): string | null {
  return API_ERROR_KEY_MAP[message] ?? null;
}
