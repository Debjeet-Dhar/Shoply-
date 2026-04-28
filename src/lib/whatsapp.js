export function getWhatsAppOrderLink(phone, productName, price, shopName) {
    // Remove any non-numeric characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const message = `Hello ${shopName}! I would like to order:\n\n*${productName}* (${price})\n\nPlease let me know how to proceed with payment and delivery.`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
