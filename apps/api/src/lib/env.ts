export function getEnv(name: string): string | undefined {
  if (typeof process !== "undefined" && process.env && name in process.env) {
    return process.env[name];
  }

  return undefined;
}
