
/**
 * API Service for interacting with n8n Webhooks
 */

const API_BASE_URL = "https://n8n.vectorcuyo.com/webhook";

// Endpoints
const ENDPOINTS = {
    PRICES: "/precio-dtf",
    UPLOAD_ORDER: "/pedido-dtf-test",
    // These might be needed later, simplified for now based on original JS
    LOGIN: "/auth-login",
    REGISTER: "/auth-register"
};

/**
 * Fetches current pricing configuration from n8n.
 * @returns {Promise<{base: number, p10: number, p30: number}>}
 */
export const fetchPrices = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PRICES}?t=${Date.now()}`);
        if (!response.ok) throw new Error("Failed to fetch prices");

        const data = await response.json();
        // Handle n8n array response structure
        const item = Array.isArray(data) ? data[0] : data;

        return {
            base: parseFloat(item.precio_metro) || 13500,
            p10: parseFloat(item.precio_mayorista_10) || 11500,
            p30: parseFloat(item.precio_mayorista_30) || 10500
        };
    } catch (error) {
        console.error("Error fetching prices:", error);
        // Fallback defaults if API fails
        return { base: 13500, p10: 11500, p30: 10500 };
    }
};

/**
 * Submits a new order to n8n.
 * @param {FormData} formData - The FormData object containing files and fields
 * @returns {Promise<boolean>} - True if successful
 */
export const submitOrder = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPLOAD_ORDER}`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            console.error("Upload failed", response.status, response.statusText);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error submitting order:", error);
        return false;
    }
};
