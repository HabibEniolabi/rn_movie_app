const hashString = (value: string) => {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash +=
      (hash << 1) +
      (hash << 4) +
      (hash << 7) +
      (hash << 8) +
      (hash << 24);
  }

  return hash >>> 0;
};

const createRandom = (seed: number) => {
  return () => {
    seed += 0x6d2b79f5;

    let t = seed;

    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const getDailyShuffleSlot = (slotsPerDay = 6) => {
  const now = new Date();

  const day = now.toISOString().split("T")[0];
  const hoursPerSlot = 24 / slotsPerDay;
  const currentSlot = Math.floor(now.getHours() / hoursPerSlot);

  return `${day}-slot-${currentSlot}`;
};

export const seededShuffle = <T>(items: T[], seedKey: string) => {
  const shuffledItems = [...items];
  const random = createRandom(hashString(seedKey));

  for (let i = shuffledItems.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));

    [shuffledItems[i], shuffledItems[j]] = [shuffledItems[j], shuffledItems[i]];
  }

  return shuffledItems;
};