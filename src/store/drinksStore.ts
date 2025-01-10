import { BehaviorSubject } from "rxjs";
import { Drink, FavoriteDrink } from "../types/Drink";

const storedDrinks = localStorage.getItem("dailyDrinks");
const initialDrinks: Drink[] = storedDrinks
    ? JSON.parse(storedDrinks).map((d: Drink) => ({ ...d, date: new Date(d.date) }))
    : [];

const drinksSubject = new BehaviorSubject<Drink[]>(initialDrinks);

const storedFavorites = localStorage.getItem("favoriteDrinks");
const initialFavorites: FavoriteDrink[] = storedFavorites ? JSON.parse(storedFavorites) : [];

const favoriteDrinksSubject = new BehaviorSubject<FavoriteDrink[]>(initialFavorites);

favoriteDrinksSubject.subscribe((favs) => {
  localStorage.setItem("favoriteDrinks", JSON.stringify(favs));
});

// Persist changes to localStorage whenever drinks update
drinksSubject.subscribe((drinks) => {
    localStorage.setItem("dailyDrinks", JSON.stringify(drinks));
});

export const getDrinks$ = () => drinksSubject.asObservable();

export const addDrink = (drink: Drink) => {
    const current = drinksSubject.value;
    drinksSubject.next([...current, drink]);
};

export const deleteDrink = (id: number) => {
    const current = drinksSubject.value;
    drinksSubject.next(current.filter((d) => d.id !== id));
};

export const getFavoriteDrinks$ = () => favoriteDrinksSubject.asObservable();

export const addFavoriteDrink = (fav: FavoriteDrink) => {
  const current = favoriteDrinksSubject.value;
  if (!current.find((f) => f.name === fav.name && f.volume === fav.volume && f.abv === fav.abv)) {
    favoriteDrinksSubject.next([...current, fav]);
  }
};