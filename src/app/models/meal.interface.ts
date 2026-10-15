export interface Meal {
  name: string;
  ingredients: string[];
  timestamp: number | null;
  $key: string;
  $exists: () => boolean;
}
