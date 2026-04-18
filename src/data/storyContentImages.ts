/**
 * Inline photography for `/story` body sections. Replace URLs or add files under
 * `public/images/story/body/` later if you wire a loader — for now these pair with copy.
 */
export type StoryContentImages = {
  origin: string;
  magnus: string;
  tileA: string;
  tileB: string;
  tileC: string;
  coast: string;
};

export const STORY_CONTENT_PLACEHOLDERS: StoryContentImages = {
  origin:
    "https://images.unsplash.com/photo-1577216756735-0561d4fefa6a?auto=format&fit=crop&w=1800&q=80",
  magnus:
    "https://images.unsplash.com/photo-1529908163454-b996bbe22900?auto=format&fit=crop&w=1800&q=80",
  tileA:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
  tileB:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  tileC:
    "https://images.unsplash.com/photo-1498654896293-37aac113e823?auto=format&fit=crop&w=1200&q=80",
  coast:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80",
};
