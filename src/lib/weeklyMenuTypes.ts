export type WeeklyMenuItem = {
  position: number;
  name: string;
  description: string;
  price: string;
  dietaryTags: string;
};

export type WeeklyMenu = {
  weekStartDate: string; // YYYY-MM-DD
  effectiveWeekStartDate: string; // YYYY-MM-DD (Saturday anchor, Europe/Madrid — Mon–Fri lunch block)
  title: string;
  isPublished: boolean;
  updatedAtUtc: string;
  items: WeeklyMenuItem[];
};

export type LoginResponse = {
  username: string;
  token: string;
};

