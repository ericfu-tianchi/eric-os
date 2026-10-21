/**
 * Images and Videos in Tianchintosh HD: interests, not work. Files live in
 * public/media/; every image has a .thumb.webp next to it for Finder.
 * Add an item = add a line here; Finder, Preview and the player pick it up.
 */
export type MediaItem = {
  id: string;
  name: string; // shown in Finder and the title bar, like a file name
  caption?: string; // one line under the image / video
  src: string; // full size (image) or mp4 (video)
  thumb?: string; // Finder icon; images default to <src>.thumb.webp
  youtube?: string; // video id: plays in the YouTube player instead of src
  credit?: string; // license / source line for photos that need one
};
export type MediaFolder = { id: string; name: string; kind: "image" | "video"; items: MediaItem[] };

const img = (folder: string, file: string, name: string, caption?: string, credit?: string): MediaItem => ({
  id: `${folder}-${file}`, name, caption, credit,
  src: `/media/images/${folder}/${file}.webp`, thumb: `/media/images/${folder}/${file}.thumb.webp`,
});

export const MEDIA_FOLDERS: MediaFolder[] = [
  { id: "img-playground", name: "Playground", kind: "image", items: [
    img("playground", "super-mario-alphabet", "Super Mario Alphabet", "An A–Z of the Mario universe."),
    img("playground", "comic", "Comic", "A hand-drawn comic strip."),
    img("playground", "poster-design-i", "Poster Design I", "UMich Biological Station: Biology of Birds."),
    img("playground", "poster-design-ii", "Poster Design II", "UMich Biological Station: Field Mammalogy."),
    img("playground", "poster-design-iii", "Poster Design III", "UMich Biological Station: Forest Ecosystems."),
    img("playground", "mr-badass", "Mr. BadAss", "A snail with attitude."),
    img("playground", "some-random-stuff", "Some Random Stuff", "Doodles from a notebook."),
    img("playground", "high-quality-human-male", "High-Quality Human Male", "A self-portrait, more or less."),
    img("playground", "parrot-bee-owl", "parrot_bee_owl", "Happy parrot, really busy bee, very sleepy owl."),
    img("playground", "old-castle", "Old Castle", "Event card UI: a night view from Old Castle."),
    img("playground", "glass", "Glass", "Event card UI: St. Vitus Cathedral."),
    img("playground", "andy-warhol", "Andy Warhol", "A museum website concept."),
  ] },
  { id: "img-games", name: "Games", kind: "image", items: [
    img("games", "zelda-botw-9", "Breath of the Wild", "The game that taught me open means open.", "© Nintendo"),
    img("games", "zelda-totk-s1", "Tears of the Kingdom", "Sky islands, and building anything out of anything.", "© Nintendo"),
    img("games", "witcher3-shot4", "The Witcher 3 · Skellige", "Skellige by boat. The best side quests ever written.", "© CD PROJEKT RED"),
    img("games", "witcher3-shot2", "The Witcher 3 · Geralt", "Geralt, before the contract.", "© CD PROJEKT RED"),
    img("games", "mario-odyssey-s2", "Super Mario Odyssey", "Capturing a T-Rex. Still the best surprise in any Mario game.", "© Nintendo"),
    img("games", "mario-wonder-s7", "Super Mario Bros. Wonder", "2D Mario that keeps surprising you.", "© Nintendo"),
    img("games", "splatoon3-s3", "Splatoon 3", "Turf War: ink everything.", "© Nintendo"),
  ] },
  { id: "img-basketball", name: "Basketball", kind: "image", items: [
    img("basketball", "kobe-2", "Kobe Bryant", "Mamba mentality.", "Photo: Keith Allison, CC BY-SA 2.0"),
    img("basketball", "lebron-6", "LeBron James", "Twenty-plus seasons and still flying.", "Photo: Erik Drost, CC BY 2.0"),
    img("basketball", "westbrook-4", "Russell Westbrook", "Pure energy, every night.", "Photo: Keith Allison, CC BY-SA 2.0"),
    img("basketball", "lebron-3", "LeBron James · Paris", undefined, "Photo: Nicolas Richoffer, CC BY-SA 4.0"),
  ] },
  { id: "vid-samples", name: "Samples", kind: "video", items: [
    { id: "vid-bbb", name: "Big Buck Bunny (trailer)", caption: "A placeholder to test the player. © Blender Foundation, CC BY 3.0.", src: "/media/videos/big-buck-bunny.mp4", thumb: "/media/videos/big-buck-bunny.webp" },
  ] },
];

export const mediaFolder = (id?: string) => MEDIA_FOLDERS.find((f) => f.id === id);
export function mediaItem(id?: string): { folder: MediaFolder; item: MediaItem; index: number } | undefined {
  for (const folder of MEDIA_FOLDERS) {
    const index = folder.items.findIndex((i) => i.id === id);
    if (index >= 0) return { folder, item: folder.items[index], index };
  }
}
