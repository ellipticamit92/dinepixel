export type DishCategory = "veg" | "nonveg";

export interface Dish {
  id: string;
  name: string;
  type: string;
  cat: DishCategory;
  price: number;
  ingredients: string[];
}

export const SEED_DISHES: Dish[] = [
  { id: "avotoast", name: "Avocado Toast", type: "Brunch", cat: "veg", price: 220, ingredients: ["Sourdough", "Avocado", "Chilli flakes", "Lime"] },
  { id: "margpanini", name: "Margherita Panini", type: "Sandwich", cat: "veg", price: 190, ingredients: ["Mozzarella", "Tomato", "Basil", "Pesto"] },
  { id: "paneerwrap", name: "Paneer Tikka Wrap", type: "Wrap", cat: "veg", price: 210, ingredients: ["Paneer", "Onion", "Mint chutney", "Roomali"] },
  { id: "chai", name: "Masala Chai", type: "Beverage", cat: "veg", price: 90, ingredients: ["Assam tea", "Milk", "Ginger", "Cardamom"] },
  { id: "capp", name: "Cappuccino", type: "Coffee", cat: "veg", price: 150, ingredients: ["Espresso", "Steamed milk", "Foam"] },
  { id: "coldbrew", name: "Cold Brew", type: "Coffee", cat: "veg", price: 170, ingredients: ["Cold brew concentrate", "Ice", "Water"] },
  { id: "muffin", name: "Blueberry Muffin", type: "Bakery", cat: "veg", price: 120, ingredients: ["Flour", "Blueberries", "Butter", "Vanilla"] },
  { id: "banana", name: "Banana Bread", type: "Bakery", cat: "veg", price: 110, ingredients: ["Banana", "Walnut", "Cinnamon"] },
  { id: "salad", name: "Garden Salad", type: "Salad", cat: "veg", price: 180, ingredients: ["Greens", "Cucumber", "Cherry tomato", "Vinaigrette"] },
  { id: "vegclub", name: "Veg Club Sandwich", type: "Sandwich", cat: "veg", price: 200, ingredients: ["Grilled veg", "Cheese", "Lettuce", "Mayo"] },
  { id: "chickpanini", name: "Chicken Panini", type: "Sandwich", cat: "nonveg", price: 240, ingredients: ["Grilled chicken", "Cheese", "Peppers", "Aioli"] },
  { id: "benedict", name: "Eggs Benedict", type: "Brunch", cat: "nonveg", price: 260, ingredients: ["Poached eggs", "Ham", "Muffin", "Hollandaise"] },
  { id: "baconroll", name: "Bacon Roll", type: "Brunch", cat: "nonveg", price: 230, ingredients: ["Bacon", "Brioche", "Egg", "Ketchup"] },
  { id: "chicksalad", name: "Grilled Chicken Salad", type: "Salad", cat: "nonveg", price: 270, ingredients: ["Grilled chicken", "Greens", "Parmesan", "Caesar"] },
  { id: "tunamelt", name: "Tuna Melt", type: "Sandwich", cat: "nonveg", price: 250, ingredients: ["Tuna", "Cheddar", "Onion", "Sourdough"] },
];

export const DETECTED_ORDER = [
  "avotoast",
  "chickpanini",
  "capp",
  "benedict",
  "paneerwrap",
  "baconroll",
];

export function priceStr(price: number) {
  return "₹" + price;
}

export function markColor(cat: DishCategory) {
  return cat === "veg" ? "var(--veg)" : "var(--nonveg)";
}

export function ingredientSummary(dish: Dish) {
  return dish.ingredients.length
    ? dish.ingredients.slice(0, 4).join(" · ")
    : dish.type;
}

interface LandingDishPreview {
  slot: string;
  name: string;
  priceStr: string;
  desc: string;
}

interface LandingCategoryData {
  heading: string;
  featured: Omit<LandingDishPreview, "slot">;
  rest: LandingDishPreview[];
}

export const LANDING_DEMO: Record<DishCategory, LandingCategoryData> = {
  veg: {
    heading: "Signature Veg",
    featured: {
      name: "Truffle Margherita",
      priceStr: "₹380",
      desc: "San Marzano base, fresh burrata, wild basil, olive oil.",
    },
    rest: [
      { slot: "lp-v1", name: "Paneer Tikka Burger", priceStr: "₹320", desc: "Char-grilled paneer, mint aioli, slaw." },
      { slot: "lp-v2", name: "Garden Salad Bowl", priceStr: "₹260", desc: "Greens, cherry tomato, vinaigrette." },
    ],
  },
  nonveg: {
    heading: "Signature Non-Veg",
    featured: {
      name: "Burrata & Prosciutto",
      priceStr: "₹520",
      desc: "24-month prosciutto di parma, arugula, burrata.",
    },
    rest: [
      { slot: "lp-n1", name: "Truffle Umami Burger", priceStr: "₹340", desc: "Wagyu patty, truffle aioli, aged gruyère." },
      { slot: "lp-n2", name: "Spicy Crispy Chicken", priceStr: "₹300", desc: "Buttermilk fried chicken, spicy slaw." },
    ],
  },
};
