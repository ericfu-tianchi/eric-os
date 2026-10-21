/**
 * Images and Videos in Tianchintosh HD: interests, not work. Files live in
 * public/media/; every image has a .thumb.webp next to it for Finder.
 * Add an item = add a line here; Finder, Preview and the player pick it up.
 */
export type MediaItem = {
  id: string;
  name: string; // shown in Finder and the title bar, like a file name
  src: string; // full size (image) or mp4 (video)
  thumb?: string; // Finder icon; images default to <src>.thumb.webp
  youtube?: string; // video id: plays in the YouTube player instead of src
  credit?: string; // license / source line for photos that need one
};
export type MediaFolder = { id: string; name: string; kind: "image" | "video"; items: MediaItem[] };

const img = (folder: string, file: string, name: string, credit?: string): MediaItem => ({
  id: `${folder}-${file}`, name, credit,
  src: `/media/images/${folder}/${file}.webp`, thumb: `/media/images/${folder}/${file}.thumb.webp`,
});

export const MEDIA_FOLDERS: MediaFolder[] = [
  { id: "img-playground", name: "Playground", kind: "image", items: [
    img("playground", "super-mario-alphabet", "Super Mario Alphabet"),
    img("playground", "comic", "Comic"),
    img("playground", "poster-design-i", "Poster Design I"),
    img("playground", "poster-design-ii", "Poster Design II"),
    img("playground", "poster-design-iii", "Poster Design III"),
    img("playground", "mr-badass", "Mr. BadAss"),
    img("playground", "some-random-stuff", "Some Random Stuff"),
    img("playground", "high-quality-human-male", "High-Quality Human Male"),
    img("playground", "parrot-bee-owl", "parrot_bee_owl"),
    img("playground", "old-castle", "Old Castle"),
    img("playground", "glass", "Glass"),
    img("playground", "andy-warhol", "Andy Warhol"),
  ] },
  { id: "img-games", name: "Games", kind: "image", items: [
    img("games", "smb-1985-title", "Super Mario Bros. (1985)", "© Nintendo"),
    img("games", "smb-1985-flagpole", "Super Mario Bros. · World 1-1", "© Nintendo"),
    img("games", "zelda-1986", "The Legend of Zelda (1986)", "© Nintendo"),
    img("games", "zelda-classic-logo", "The Legend of Zelda", "© Nintendo"),
    img("games", "skyward-sword-s3", "Skyward Sword", "© Nintendo"),
    img("games", "zelda-botw-9", "Breath of the Wild", "© Nintendo"),
    img("games", "zelda-totk-s1", "Tears of the Kingdom", "© Nintendo"),
    img("games", "witcher3-shot4", "The Witcher 3 · Skellige", "© CD PROJEKT RED"),
    img("games", "witcher3-shot2", "The Witcher 3 · Geralt", "© CD PROJEKT RED"),
    img("games", "mario-odyssey-s2", "Super Mario Odyssey", "© Nintendo"),
    img("games", "mario-wonder-s7", "Super Mario Bros. Wonder", "© Nintendo"),
    img("games", "splatoon3-s3", "Splatoon 3", "© Nintendo"),
  ] },
  { id: "img-basketball", name: "Basketball", kind: "image", items: [
    img("basketball", "kobe-2", "Kobe Bryant", "Photo: Keith Allison, CC BY-SA 2.0"),
    img("basketball", "lebron-6", "LeBron James", "Photo: Erik Drost, CC BY 2.0"),
    img("basketball", "westbrook-4", "Russell Westbrook", "Photo: Keith Allison, CC BY-SA 2.0"),
    img("basketball", "lebron-3", "LeBron James · Paris", "Photo: Nicolas Richoffer, CC BY-SA 4.0"),
  ] },
  { id: "vid-samples", name: "Samples", kind: "video", items: [
    { id: "vid-bbb", name: "Big Buck Bunny (trailer)", credit: "© Blender Foundation, CC BY 3.0", src: "/media/videos/big-buck-bunny.mp4", thumb: "/media/videos/big-buck-bunny.webp" },
  ] },
];

export const mediaFolder = (id?: string) => MEDIA_FOLDERS.find((f) => f.id === id);
export function mediaItem(id?: string): { folder: MediaFolder; item: MediaItem; index: number } | undefined {
  for (const folder of MEDIA_FOLDERS) {
    const index = folder.items.findIndex((i) => i.id === id);
    if (index >= 0) return { folder, item: folder.items[index], index };
  }
}
