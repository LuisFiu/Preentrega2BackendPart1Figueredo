import productManager from "./mongo/productManager.js";
import cartManager from "./mongo/cartManager.js";
import sessionsManager from "./mongo/sessionsManager.js";

export const sessionsService = new sessionsManager();
export const productService = new productManager();
export const cartService = new cartManager();
