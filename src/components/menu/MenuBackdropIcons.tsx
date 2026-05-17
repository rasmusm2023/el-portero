/**
 * Ambient menu-route backdrop: SVG Repo food / drink icons from
 * `public/assets/images/menus/`. Black artwork is inverted to soft paper-toned
 * silhouettes at very low opacity so the menu stays legible.
 *
 * Mounted from `app/menus/layout.tsx` behind `relative z-10` page content.
 */

const MENU_BACKDROP_SVGS = [
  "/assets/images/menus/dish-svgrepo-com.svg",
  "/assets/images/menus/plate-meat-svgrepo-com.svg",
  "/assets/images/menus/salad-svgrepo-com.svg",
  "/assets/images/menus/cocktail-straw-svgrepo-com.svg",
  "/assets/images/menus/juice-svgrepo-com.svg",
  "/assets/images/menus/tea-cup-coffee-svgrepo-com.svg",
  "/assets/images/menus/olive-oil-svgrepo-com.svg",
  "/assets/images/menus/ice-cream-svgrepo-com.svg",
] as const;

type BackdropGlyph = {
  src: (typeof MENU_BACKDROP_SVGS)[number];
  /** Outer box: position + dimensions (icons scale with object-contain). */
  boxClass: string;
  rotate: number;
  /** Overall strength — keep in ~0.02–0.06 for “barely there”. */
  opacity: number;
};

const GLYPHS: BackdropGlyph[] = [
  { src: MENU_BACKDROP_SVGS[0], boxClass: "left-[2%] top-[10%] h-28 w-28 sm:h-36 sm:w-36", rotate: -14, opacity: 0.038 },
  { src: MENU_BACKDROP_SVGS[1], boxClass: "right-[4%] top-[8%] h-32 w-32 sm:h-40 sm:w-40", rotate: 10, opacity: 0.032 },
  { src: MENU_BACKDROP_SVGS[2], boxClass: "left-[6%] top-[42%] h-24 w-24 sm:h-32 sm:w-32", rotate: 6, opacity: 0.042 },
  { src: MENU_BACKDROP_SVGS[3], boxClass: "right-[3%] top-[38%] h-28 w-28 sm:h-36 sm:w-36", rotate: -18, opacity: 0.035 },
  { src: MENU_BACKDROP_SVGS[4], boxClass: "left-[8%] bottom-[18%] h-28 w-28 sm:h-36 sm:w-36", rotate: 12, opacity: 0.03 },
  { src: MENU_BACKDROP_SVGS[5], boxClass: "right-[6%] bottom-[22%] h-30 w-30 sm:h-38 sm:w-38", rotate: -8, opacity: 0.036 },
  { src: MENU_BACKDROP_SVGS[6], boxClass: "left-[40%] top-[22%] h-22 w-22 sm:h-28 sm:w-28", rotate: 22, opacity: 0.028 },
  { src: MENU_BACKDROP_SVGS[7], boxClass: "right-[18%] bottom-[12%] h-24 w-24 sm:h-30 sm:w-30", rotate: -6, opacity: 0.034 },
];

/** Turns black SVG fills into paper-coloured art; opacity on the wrapper dials subtlety. */
const glyphImgClass =
  "h-full w-full object-contain object-center [filter:brightness(0)_invert(1)]";

export function MenuBackdropIcons() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {GLYPHS.map(({ src, boxClass, rotate, opacity }, idx) => (
        <div
          key={`${src}-${idx}`}
          className={["absolute origin-center", boxClass].join(" ")}
          style={{
            opacity,
            transform: `rotate(${rotate}deg)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- small local SVGs; skip Image pipeline */}
          <img
            src={src}
            alt=""
            decoding="async"
            fetchPriority="low"
            className={glyphImgClass}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
