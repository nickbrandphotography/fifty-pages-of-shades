// Room mock-ups made by scripts/build-mockups.py (data/mockups.json).
import data from "@/data/mockups.json";

export type Mockup = {
  slug: string; artworkSlug: string; sceneId: string; room: string;
  image: string; width: number; height: number; sizeLabel: string; alt: string;
};

const all = data as Mockup[];
export const mockupsFor = (slug: string) => all.filter((m) => m.artworkSlug === slug);
