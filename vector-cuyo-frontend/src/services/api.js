
/**
 * API Service for interacting with n8n Webhooks
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Endpoints
const ENDPOINTS = {
    PRICES: import.meta.env.VITE_API_PRICES_ENDPOINT,
    UPLOAD_ORDER: import.meta.env.VITE_API_UPLOAD_ORDER_ENDPOINT,
    LOGIN: import.meta.env.VITE_API_LOGIN_ENDPOINT,
    REGISTER: import.meta.env.VITE_API_REGISTER_ENDPOINT,
    GET_ORDERS: import.meta.env.VITE_API_GET_ORDERS_ENDPOINT
};

/**
 * Fetches order history for a specific client.
 * @param {string|number} clientId - The ID of the client
 * @returns {Promise<Array>} - List of orders
 */
export const fetchOrders = async (clientId) => {
    try {
        const formData = new FormData();
        formData.append('id_cliente', clientId);

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_ORDERS}`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error("Failed to fetch orders");

        let data = await response.json();

        // Normalize n8n response structure (similar to legacy logic)
        if (data.json) data = data.json;
        else if (data.data) data = data.data;

        if (!Array.isArray(data)) {
            if (data && typeof data === 'object' && Object.keys(data).length > 0) {
                return [data];
            }
            return [];
        }

        return data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
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
