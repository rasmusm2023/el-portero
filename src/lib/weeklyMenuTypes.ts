export type WeeklyMenuItem = {
  position: number;
  name: string;
  description: string;
  price: string;
  dietaryTags: string;
};

export type WeeklyMenu = {
  weekStartDate: string; // YYYY-MM-DD
  effectiveWeekStartDate: string; // YYYY-MM-DD (Monday, Europe/Madrid)
  title: string;
  isPublished: boolean;
  updatedAtUtc: string;
  items: WeeklyMenuItem[];
};

export type LoginResponse = {
  username: string;
  token: string;
};

