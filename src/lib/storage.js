const SHOP_KEY = "dukanlink_shop";
const PRODUCTS_KEY = "dukanlink_products";
const CURRENT_SLUG_KEY = "dukanlink_current_slug";

export function saveShop(shop) {
    localStorage.setItem(SHOP_KEY, JSON.stringify(shop));
    localStorage.setItem(CURRENT_SLUG_KEY, shop.slug);
}
export function getShop() {
    const data = localStorage.getItem(SHOP_KEY);
    if (!data)
        return null;
    try {
        return JSON.parse(data);
    }
    catch (e) {
        return null;
    }
}
export function getShopBySlug(slug) {
    const shop = getShop();
    if (shop && shop.slug === slug) {
        return shop;
    }
    return null;
}
export function clearShop() {
    localStorage.removeItem(SHOP_KEY);
    localStorage.removeItem(PRODUCTS_KEY);
    localStorage.removeItem(CURRENT_SLUG_KEY);
}
export function getProducts() {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (!data)
        return [];
    try {
        return JSON.parse(data);
    }
    catch (e) {
        return [];
    }
}
export function addProduct(product) {
    const products = getProducts();
    products.push(product);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}
export function updateProduct(id, updates) {
    const products = getProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1)
        return;
    products[idx] = { ...products[idx], ...updates };
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}
export function deleteProduct(id) {
    const products = getProducts().filter((p) => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}
export function generateSlug(name) {
    const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const suffix = Math.random().toString(36).substring(2, 7);
    return `${base}-${suffix}`;
}
export function isAuthenticated() {
    return !!localStorage.getItem(CURRENT_SLUG_KEY);
}
export function normalizePhone(phone) {
    return phone.replace(/[^\d]/g, "");
}
export function findShopByPhone(phone) {
    const shop = getShop();
    if (!shop)
        return null;
    if (normalizePhone(shop.phone) === normalizePhone(phone))
        return shop;
    return null;
}
export function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
