export type DishCategory = "veg" | "nonveg";

export type MenuSection = string;

export interface Dish {
  id: string;
  name: string;
  description?: string | null;
  type: string;
  cat: DishCategory;
  price: number;
  ingredients: string[];
  section: MenuSection;
}

export const SEED_DISHES: Dish[] = [
  { id: "avotoast", name: "Avocado Toast", type: "Brunch", cat: "veg", price: 220, ingredients: ["Sourdough", "Avocado", "Chilli flakes", "Lime"], section: "Cafe Bites" },
  { id: "margpanini", name: "Margherita Panini", type: "Sandwich", cat: "veg", price: 190, ingredients: ["Mozzarella", "Tomato", "Basil", "Pesto"], section: "Cafe Bites" },
  { id: "paneerwrap", name: "Paneer Tikka Wrap", type: "Wrap", cat: "veg", price: 210, ingredients: ["Paneer", "Onion", "Mint chutney", "Roomali"], section: "Cafe Bites" },
  { id: "muffin", name: "Blueberry Muffin", type: "Bakery", cat: "veg", price: 120, ingredients: ["Flour", "Blueberries", "Butter", "Vanilla"], section: "Cafe Bites" },
  { id: "banana", name: "Banana Bread", type: "Bakery", cat: "veg", price: 110, ingredients: ["Banana", "Walnut", "Cinnamon"], section: "Cafe Bites" },
  { id: "salad", name: "Garden Salad", type: "Salad", cat: "veg", price: 180, ingredients: ["Greens", "Cucumber", "Cherry tomato", "Vinaigrette"], section: "Cafe Bites" },
  { id: "vegclub", name: "Veg Club Sandwich", type: "Sandwich", cat: "veg", price: 200, ingredients: ["Grilled veg", "Cheese", "Lettuce", "Mayo"], section: "Cafe Bites" },
  { id: "chickpanini", name: "Chicken Panini", type: "Sandwich", cat: "nonveg", price: 240, ingredients: ["Grilled chicken", "Cheese", "Peppers", "Aioli"], section: "Cafe Bites" },
  { id: "benedict", name: "Eggs Benedict", type: "Brunch", cat: "nonveg", price: 260, ingredients: ["Poached eggs", "Ham", "Muffin", "Hollandaise"], section: "Cafe Bites" },
  { id: "baconroll", name: "Bacon Roll", type: "Brunch", cat: "nonveg", price: 230, ingredients: ["Bacon", "Brioche", "Egg", "Ketchup"], section: "Cafe Bites" },
  { id: "chicksalad", name: "Grilled Chicken Salad", type: "Salad", cat: "nonveg", price: 270, ingredients: ["Grilled chicken", "Greens", "Parmesan", "Caesar"], section: "Cafe Bites" },
  { id: "tunamelt", name: "Tuna Melt", type: "Sandwich", cat: "nonveg", price: 250, ingredients: ["Tuna", "Cheddar", "Onion", "Sourdough"], section: "Cafe Bites" },

  { id: "manchurian", name: "Veg Manchurian", type: "Chinese", cat: "veg", price: 220, ingredients: ["Fried veg balls", "Manchurian sauce", "Spring onion"], section: "Chinese" },
  { id: "hakkanoodles", name: "Veg Hakka Noodles", type: "Chinese", cat: "veg", price: 210, ingredients: ["Noodles", "Cabbage", "Carrot", "Soy sauce"], section: "Chinese" },
  { id: "chillichicken", name: "Chilli Chicken", type: "Chinese", cat: "nonveg", price: 260, ingredients: ["Chicken", "Bell pepper", "Soy sauce", "Chilli"], section: "Chinese" },

  { id: "dosa", name: "Masala Dosa", type: "South Indian", cat: "veg", price: 160, ingredients: ["Rice batter", "Potato masala", "Chutney", "Sambar"], section: "South Indian" },
  { id: "idli", name: "Idli Sambar", type: "South Indian", cat: "veg", price: 120, ingredients: ["Steamed idli", "Sambar", "Coconut chutney"], section: "South Indian" },
  { id: "uttapam", name: "Onion Uttapam", type: "South Indian", cat: "veg", price: 150, ingredients: ["Rice batter", "Onion", "Chutney", "Sambar"], section: "South Indian" },

  { id: "vegmomo", name: "Veg Momos", type: "Momos", cat: "veg", price: 150, ingredients: ["Cabbage", "Carrot", "Momo dough", "Chilli chutney"], section: "Momos" },
  { id: "chickenmomo", name: "Chicken Momos", type: "Momos", cat: "nonveg", price: 180, ingredients: ["Minced chicken", "Momo dough", "Chilli chutney"], section: "Momos" },
  { id: "friedmomo", name: "Fried Paneer Momos", type: "Momos", cat: "veg", price: 190, ingredients: ["Paneer", "Momo dough", "Schezwan sauce"], section: "Momos" },

  { id: "vegburger", name: "Classic Veg Burger", type: "Burger", cat: "veg", price: 190, ingredients: ["Veg patty", "Lettuce", "Tomato", "Bun"], section: "Burgers" },
  { id: "chickenburger", name: "Crispy Chicken Burger", type: "Burger", cat: "nonveg", price: 230, ingredients: ["Fried chicken", "Mayo", "Lettuce", "Bun"], section: "Burgers" },
  { id: "cheeseburger", name: "Double Cheese Burger", type: "Burger", cat: "nonveg", price: 250, ingredients: ["Beef patty", "Cheddar", "Pickles", "Bun"], section: "Burgers" },

  { id: "chai", name: "Masala Chai", type: "Tea", cat: "veg", price: 90, ingredients: ["Assam tea", "Milk", "Ginger", "Cardamom"], section: "Drinks" },
  { id: "capp", name: "Cappuccino", type: "Coffee", cat: "veg", price: 150, ingredients: ["Espresso", "Steamed milk", "Foam"], section: "Drinks" },
  { id: "coldbrew", name: "Cold Brew", type: "Coffee", cat: "veg", price: 170, ingredients: ["Cold brew concentrate", "Ice", "Water"], section: "Drinks" },
  { id: "mangojuice", name: "Mango Juice", type: "Juice", cat: "veg", price: 130, ingredients: ["Mango", "Ice", "Sugar"], section: "Drinks" },
  { id: "watermelonjuice", name: "Watermelon Juice", type: "Juice", cat: "veg", price: 120, ingredients: ["Watermelon", "Mint", "Ice"], section: "Drinks" },
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
