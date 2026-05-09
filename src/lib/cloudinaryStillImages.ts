/**
 * Optimized stills on Cloudinary (`q_auto` / `f_auto`). Use with `<picture>`:
 * `<source type="image/webp" srcSet={webp} />` + `<img src={jpeg} />` so browsers fetch only one format.
 */
export const CLOUDINARY_IMG = {
  heroAccentDish: {
    webp: "https://res.cloudinary.com/dovyrycsh/image/upload/q_auto/f_auto/v1778284129/el-portero-dish-4_gcvjxv.webp",
    jpeg: "https://res.cloudinary.com/dovyrycsh/image/upload/q_auto/f_auto/v1778284094/el-portero-dish-4_q3i4df.jpg",
  },
  galleryTostada: {
    webp: "https://res.cloudinary.com/dovyrycsh/image/upload/q_auto/f_auto/v1778283958/el-portero-tostada_iww6ju.webp",
    jpeg: "https://res.cloudinary.com/dovyrycsh/image/upload/q_auto/f_auto/v1778283946/el-portero-tostada_pnbr3m.jpg",
  },
  /** Former `public/images/food.png` — gallery row 2 anchor. */
  sevenTonguedDish: {
    webp: "https://res.cloudinary.com/dovyrycsh/image/upload/q_auto/f_auto/v1778283256/seven-tongued-dish_mg46eh.webp",
    jpeg: "https://res.cloudinary.com/dovyrycsh/image/upload/q_auto/f_auto/v1778283271/seven-tongued-dish_fuk8gr.jpg",
  },
  galleryDish1: {
    webp: "https://res.cloudinary.com/dovyrycsh/image/upload/q_auto/f_auto/v1778283663/el-portero-dish-1_u2uuul.webp",
    jpeg: "https://res.cloudinary.com/dovyrycsh/image/upload/q_auto/f_auto/v1778283651/el-portero-dish-1_rho6jo.jpg",
  },
  galleryDish2: {
    webp: "https://res.cloudinary.com/dovyrycsh/image/upload/q_auto/f_auto/v1778283664/el-portero-dish-2_bxj6ob.webp",
    jpeg: "https://res.cloudinary.com/dovyrycsh/image/upload/q_auto/f_auto/v1778283651/el-portero-dish-2_ac6cri.jpg",
  },
  galleryDish3: {
    webp: "https://res.cloudinary.com/dovyrycsh/image/upload/q_auto/f_auto/v1778283664/el-portero-dish-3_ixihvd.webp",
    jpeg: "https://res.cloudinary.com/dovyrycsh/image/upload/q_auto/f_auto/v1778283652/el-portero-dish-3_y1zixv.jpg",
  },
  eventsClip1Poster: {
    webp: "https://res.cloudinary.com/dovyrycsh/image/upload/q_auto/f_auto/v1778284267/poster_hz4mcr.webp",
    jpeg: "https://res.cloudinary.com/dovyrycsh/image/upload/q_auto/f_auto/v1778284357/event-poster_ht7asd.jpg",
  },
  heroClip1Poster: {
    webp: "https://res.cloudinary.com/dovyrycsh/image/upload/q_auto/f_auto/v1778284551/poster_lcyvtk.webp",
    jpeg: "https://res.cloudinary.com/dovyrycsh/image/upload/q_auto/f_auto/v1778284472/home-poster_cpbmlc.jpg",
  },
} as const;

export type CloudinaryStillPair = {
  webp: string;
  jpeg: string;
};
