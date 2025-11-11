export function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_MOCKS === "true";
}

export const mockConfig = {
  enabled: isMockMode(),
  delayMin: 300,
  delayMax: 800,
} as const;
