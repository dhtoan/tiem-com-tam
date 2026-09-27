export interface SeededRandom {
  next: () => number;
  int: (min: number, max: number) => number;
  fork: (subNamespace: string) => SeededRandom;
}

function hashSeed(seed: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

export function createSeededRandom(seed: string): SeededRandom {
  let a = hashSeed(seed) >>> 0;

  // Mulberry32 32-bit generator
  const next = (): number => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const int = (min: number, max: number): number => {
    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }
    const r = next();
    return Math.floor(r * (max - min + 1)) + min;
  };

  const fork = (subNamespace: string): SeededRandom => {
    return createSeededRandom(`${seed}::${subNamespace}`);
  };

  return { next, int, fork };
}
