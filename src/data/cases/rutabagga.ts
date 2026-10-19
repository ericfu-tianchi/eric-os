import type { CaseStudy } from "../cases";

export const rutabagga: CaseStudy = {
  accent: "#764c99",
  sub: "Local. Natural. Sustainable.",
  role: "UI Designer",
  timeline: "March 2022 – April 2022",
  tools: "Adobe Illustrator",
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "Background" },
      { t: "p", text: "This is a logo design I did for a fictional client called Rutabagga that aims to promote vegan food and products." },
      { t: "h", text: "Client Brief" },
      { t: "quote", text: "Rutabagga app aims to help those trying to reduce their environmental footprint by consuming more vegetarian and vegan products." },
      { t: "p", text: "Better heart health, weight loss, and “good karma” are among the numerous benefits of vegan and vegetarian diets." },
      { t: "p", text: "==Our tagline reads: “Local. Natural. Sustainable.”==" },
      { t: "p", text: "We promote seasonal eating — eating sustainably. We teach our users only to eat fruits and vegetables in season for their geographic area: apples in the fall, rutabaga in the winter, radishes in the spring, and peaches in the summer." },
      { t: "h", text: "Design Preview" },
      { t: "img", src: "rutabagga/02.png", caption: "Logomark, logotype, and the primary and secondary palettes", w: 1140 },
    ] },
    { id: "design", label: "Design", white: true, blocks: [
      { t: "h", text: "Typography" },
      { t: "img", src: "rutabagga/03.png", caption: "Gravesend Sans for the logotype, Adobe Garamond Pro for body text", w: 1140 },
      { t: "h", text: "Scalability" },
      { t: "img", src: "rutabagga/04.png", caption: "The logo at 3 in, 1 in and 0.5 in", w: 1140 },
      { t: "h", text: "Logo Variation" },
      { t: "img", src: "rutabagga/05.png", caption: "Stacked and extended, with and without the tagline, and the logomark alone", w: 1140 },
      { t: "h", text: "Color Variation" },
      { t: "img", src: "rutabagga/06.png", caption: "Color, black and stroke versions on white and on black", w: 1140 },
      { t: "h", text: "Free Space" },
      { t: "img", src: "rutabagga/07.png", caption: "Mandatory free space around each lockup", w: 1140 },
      { t: "h", text: "Photograph Inspirations" },
      { t: "img", src: "rutabagga/08.png", caption: "Photography direction: seasonal produce, hands, markets", w: 1140 },
      { t: "h", text: "App Screen Design" },
      { t: "img", src: "rutabagga/09.png", caption: "The identity applied to the Rutabagga app", w: 1280 },
    ] },
  ],
};
