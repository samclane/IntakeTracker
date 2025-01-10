export interface Drink {
  id: number;
  name: string;
  volume: number;
  abv: number;
  date: Date;
};

export interface FavoriteDrink {
  name: string;
  volume: number;
  abv: number;
};
