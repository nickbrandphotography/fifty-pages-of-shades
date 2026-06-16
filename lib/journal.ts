// To add an article: append to the articles[] array. Body blocks: {h2}, {p} (supports [label](/href) links), {quote}.
export type Block =
  | { h2: string }
  | { p: string }      // supports inline [label](href) links
  | { quote: string };

export type Article = {
  slug: string;
  title: string;
  silo: string;
  dek: string;
  date: string;        // ISO
  readingMins: number;
  body: Block[];
  seoTitle: string;
  seoDescription: string;
};

export const articles: Article[] = [
  {
    slug: "what-is-a-bodyscape",
    title: "What Is a Bodyscape? The Art of the Human Form as Landscape",
    silo: "Bodyscape Art",
    dek: "A bodyscape is the human form seen as landscape. Here is what that means, how the work is made, and why it reads as abstract art rather than a nude.",
    date: "2026-05-12",
    readingMins: 4,
    seoTitle: "What Is a Bodyscape? The Human Form as Landscape",
    seoDescription: "A bodyscape is a photograph of the human form abstracted until it reads as landscape. What the genre is, how it is made, and why it is abstract — not nude — art.",
    body: [
      { p: "A bodyscape is a photograph of the human form abstracted until it reads as landscape. Skin becomes terrain, a shoulder becomes a horizon, and the fall of light across the body reads the way light reads across a dune or a coastline. The subject is the human body; the subject matter is form — line, tone, shadow and texture." },
      { h2: "Landscape, not portrait" },
      { p: "Where a portrait asks who the person is, a bodyscape removes that question entirely. Framed close and composed for abstraction, the body loses scale and identity until what remains is pure shape. The viewer reads the image the way they would read a black-and-white landscape: as composition, not as a person." },
      { h2: "Why black and white" },
      { p: "Colour carries information that pulls the eye toward the literal. Stripped of it, the body becomes a neutral landscape and attention settles on what matters — the geometry of a curve, the gradient of light into shadow, the texture of skin reading like sand or stone. Working in black and white is what lets a bodyscape feel timeless rather than of a moment." },
      { h2: "Abstract, not nude" },
      { p: "This distinction matters. A bodyscape is not nude photography, and it is not boudoir or glamour work. The body is the material, not the object of exposure. That is why bodyscapes hang comfortably in living rooms, lobbies and considered interiors, and sit naturally in a serious collection. To understand how the genre differs from related work, see the [Glossary](/resources/glossary/)." },
      { h2: "How they are collected" },
      { p: "Bodyscapes by Nick Brand are produced as strictly limited editions of 15, printed on framed canvas in custom sizes, each numbered and accompanied by a certificate of authenticity. If you are new to the genre, the [Collector Guide](/collectors/collector-guide/) explains editions, provenance and how to buy with confidence — or you can simply [explore the available works](/artworks/)." },
    ],
  },
  {
    slug: "how-much-does-fine-art-photography-cost-australia",
    title: "How Much Does Fine Art Photography Cost in Australia?",
    silo: "Buying & Collecting",
    dek: "What you actually pay for a fine art photograph, what drives the price, and where limited-edition bodyscapes sit.",
    date: "2026-05-19",
    readingMins: 4,
    seoTitle: "How Much Does Fine Art Photography Cost in Australia?",
    seoDescription: "What drives the price of fine art photography in Australia — edition size, print size and framing — and where limited-edition bodyscapes by Nick Brand sit.",
    body: [
      { p: "Fine art photography in Australia spans a wide range, from a few hundred dollars for an open-edition print to tens of thousands for work by established names. For limited-edition work on canvas, the two biggest levers are the size of the piece and how it is framed. Bodyscapes by Nick Brand are priced from $1,700, with the final figure set by the size and frame you choose." },
      { h2: "What drives the price" },
      { p: "Three things matter most. First, the artist and their trajectory — recognition and demand lift prices over time. Second, the edition size — the scarcer the edition, the more each work commands. Third, the physical piece itself — a larger canvas in a premium frame costs more to produce and to own than a smaller, unframed one." },
      { h2: "Why edition size matters" },
      { p: "A photograph released in an edition of 15 is far scarcer than the same image in an edition of 200, and that scarcity is reflected in both price and long-term value. Edition size is stated openly on every Bodyscapes work, so you always know exactly how rare a piece is. The [Collector Guide](/collectors/collector-guide/) explains this in full." },
      { h2: "Size and framing" },
      { p: "Because the work is printed on canvas, almost any size is possible, and price scales with it. Framing is part of the price too: a gallery-wrapped canvas sits at the lower end, while a black, oak or white floating frame adds a finished, ready-to-hang result. On each artwork page you can choose a size and frame and watch the price update live." },
      { h2: "Is it worth it?" },
      { p: "A genuine limited edition is a different proposition to a decorative poster — it is scarce, documented, and made to last. Whether it also holds value over time depends on the artist and the market; our [guide to investment in photographic art](/collectors/investment-in-photographic-art/) covers that honestly. The best reason to buy, though, remains simple: buy a work you want to live with. [Browse the available works](/artworks/) to see current pricing." },
    ],
  },
  {
    slug: "how-to-choose-the-right-size-art-for-any-wall",
    title: "How to Choose the Right Size Art for Any Wall",
    silo: "Fine Art for Interiors",
    dek: "A simple, reliable method for getting the proportion and hanging height right — and why custom sizing makes it easy.",
    date: "2026-05-26",
    readingMins: 3,
    seoTitle: "How to Choose the Right Size Art for Any Wall",
    seoDescription: "A simple rule for choosing art size and hanging height for any wall, plus how custom-sized canvas takes the guesswork out of getting it right.",
    body: [
      { p: "The most common mistake in hanging art is going too small. A piece that looks generous in a gallery can disappear on a large wall at home. A simple rule fixes most situations: a feature artwork should fill roughly two-thirds of the wall or the furniture it sits above." },
      { h2: "The two-thirds rule" },
      { p: "Measure the width of the wall, or of the sofa, bed or console the art will hang over. Aim for a piece (or a grouping) about two-thirds of that width. Over a 2.4-metre sofa, that points to a work around 1.6 metres wide — which is exactly why statement sizes exist." },
      { h2: "Get the height right" },
      { p: "Hang art so its centre sits near eye level, about 145 to 150 cm from the floor. Over furniture, leave roughly 15 to 25 cm between the top of the furniture and the bottom of the frame so the two feel connected rather than floating apart." },
      { h2: "When in doubt, go larger" },
      { p: "One large work almost always reads as more confident and more considered than several small ones scattered across a wall. If you are between two sizes, choose the larger — it is the more common regret to wish a piece were bigger. For big walls, voids and lobbies, see [Large Scale Art](/large-scale-art/)." },
      { h2: "Custom sizing takes out the guesswork" },
      { p: "Because Bodyscapes are printed on canvas, a work can be made to suit your wall exactly rather than forcing your wall to suit a fixed size. Send the dimensions and we will recommend a size and frame. Designers and architects can also [apply for a trade account](/for-designers/) for project pricing and turnkey delivery." },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
