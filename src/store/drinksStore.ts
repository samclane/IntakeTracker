
import { BehaviorSubject } from "rxjs";
import { Drink } from "../types/Drink";

const storedDrinks = localStorage.getItem("dailyDrinks");
const initialDrinks: Drink[] = storedDrinks
    ? JSON.parse(storedDrinks).map((d: Drink) => ({ ...d, date: new Date(d.date) }))
    : [];

const drinksSubject = new BehaviorSubject<Drink[]>(initialDrinks);

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