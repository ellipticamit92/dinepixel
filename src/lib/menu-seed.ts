export type DishCategory = "veg" | "nonveg";

export type MenuSection = string;

export interface Dish {
  id: string;
  name: string;
  description?: string | null;
  type: string;
  cat: DishCategory;
  price: number;
  halfPrice?: number | null;
  fullPrice?: number | null;
  smallPrice?: number | null;
  mediumPrice?: number | null;
  largePrice?: number | null;
  imageUrl?: string | null;
  ingredients: string[];
  section: MenuSection;
  available?: boolean;
  featured?: boolean;
}

/** Drinks aren't inherently veg/non-veg, so they show up under both tabs. */
export function isDrink(dish: Dish): boolean {
  return dish.section.trim().toLowerCase() === "drinks";
}

export function matchesTab(dish: Dish, tab: DishCategory): boolean {
  return dish.cat === tab || isDrink(dish);
}

export type PricingMode = "single" | "halfFull" | "sizes";

/**
 * Full is the anchor for half/full pricing (half is optional); for sizes,
 * any subset of small/medium/large can be set. "price" always mirrors the
 * highest tier present so stats/sorting that read it plainly stay correct.
 */
export function pricingModeOf(dish: Dish): PricingMode {
  if (dish.smallPrice != null || dish.mediumPrice != null || dish.largePrice != null) {
    return "sizes";
  }
  if (dish.fullPrice != null) return "halfFull";
  return "single";
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

export function dishPriceLabel(dish: Dish): string {
  const mode = pricingModeOf(dish);

  if (mode === "sizes") {
    const parts: string[] = [];
    if (dish.smallPrice != null) parts.push(`S ${priceStr(dish.smallPrice)}`);
    if (dish.mediumPrice != null) parts.push(`M ${priceStr(dish.mediumPrice)}`);
    if (dish.largePrice != null) parts.push(`L ${priceStr(dish.largePrice)}`);
    return parts.join(" · ");
  }

  if (mode === "halfFull") {
    const parts: string[] = [];
    if (dish.halfPrice != null) parts.push(`Half ${priceStr(dish.halfPrice)}`);
    parts.push(`Full ${priceStr(dish.fullPrice as number)}`);
    return parts.join(" · ");
  }

  return priceStr(dish.price);
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

/** Demo dishes used for the landing page phone preview */
export const DEMO_DISHES: Dish[] = [
  { id: "demo-1", name: "Truffle Margherita", type: "Pizza", cat: "veg", price: 380, ingredients: ["San Marzano", "Burrata", "Wild Basil", "Olive Oil"], section: "Signature", imageUrl: "/singature_dish.jpg" },
  { id: "demo-2", name: "Paneer Tikka Burger", type: "Burger", cat: "veg", price: 320, ingredients: ["Paneer", "Mint Aioli", "Slaw"], section: "Signature", imageUrl: "/pizza.png" },
  { id: "demo-3", name: "Garden Salad Bowl", type: "Salad", cat: "veg", price: 260, ingredients: ["Greens", "Cherry Tomato", "Vinaigrette"], section: "Sides", imageUrl: "/burger.png" },
  { id: "demo-4", name: "Burrata & Prosciutto", type: "Starter", cat: "nonveg", price: 520, ingredients: ["Prosciutto", "Arugula", "Burrata"], section: "Signature", imageUrl: "/singature_dish.jpg" },
  { id: "demo-5", name: "Truffle Umami Burger", type: "Burger", cat: "nonveg", price: 340, ingredients: ["Wagyu Patty", "Truffle Aioli", "Gruyère"], section: "Signature", imageUrl: "/burger.png" },
  { id: "demo-6", name: "Spicy Crispy Chicken", type: "Main", cat: "nonveg", price: 300, ingredients: ["Buttermilk Chicken", "Spicy Slaw"], section: "Mains", imageUrl: "/pizza.png" },
];
