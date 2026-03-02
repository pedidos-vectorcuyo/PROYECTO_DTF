
/**
 * API Service for interacting with n8n Webhooks
 */
// API Base URL - Injected via GitHub Actions Secrets
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Endpoints
const ENDPOINTS = {
    PRICES: import.meta.env.VITE_API_PRICES_ENDPOINT,
    UPLOAD_ORDER: import.meta.env.VITE_API_UPLOAD_ORDER_ENDPOINT,
    LOGIN: import.meta.env.VITE_API_LOGIN_ENDPOINT || '/auth-login',
    REGISTER: import.meta.env.VITE_API_REGISTER_ENDPOINT || '/auth-register',
    GOOGLE_LOGIN: import.meta.env.VITE_API_GOOGLE_LOGIN_ENDPOINT || '/auth-google',
    GET_ORDERS: import.meta.env.VITE_API_GET_ORDERS_ENDPOINT,
    VERIFY_PAYMENT: '/webhook/verificar-pago',
    B2B_ORDER: '/webhook/b2b-order',
    // Admin Endpoints
    GET_ALL_ORDERS: '/admin/get-all-orders',
    UPDATE_ORDER_STATUS: '/admin/update-order-status',
    UPDATE_PRICES: '/admin/update-prices'
};

/**
 * Authenticates a user.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object|null>} User object if success, or null
 */
export const login = async (email, password) => {
    try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error("Login failed");

        let data = await response.json();
        if (Array.isArray(data)) data = data[0];

        return data; // Expected { id, nombre, correo, ... }
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

/**
 * Registers a new user.
 * @param {Object} userData 
 * @returns {Promise<Object|null>} New user object if success
 */
export const register = async (userData) => {
    try {
        const formData = new FormData();
        Object.keys(userData).forEach(key => formData.append(key, userData[key]));

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.REGISTER}`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error("Registration failed");

        let data = await response.json();
        if (Array.isArray(data)) data = data[0];

        return data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

/**
 * Authenticates a user via Google OAuth.
 * @param {string} googleCredential - JWT credential token from Google
 * @returns {Promise<Object|null>} User object if success, or null
 */
export const loginWithGoogle = async (googleCredential) => {
    try {
        const formData = new FormData();
        formData.append('google_token', googleCredential);

        const loginUrl = `${API_BASE_URL.replace(/\/$/, '')}/${ENDPOINTS.GOOGLE_LOGIN.replace(/^\//, '')}`;
        console.log('[DEBUG] api.js: calling Google Login at:', loginUrl);

        const response = await fetch(loginUrl, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Google Login failed');

        let data = await response.json();
        if (Array.isArray(data)) data = data[0];

        return data; // Expected { id, nombre, correo, ... }
    } catch (error) {
        console.error('Google Login error:', error);
        throw error;
    }
};

/**
 * Verifies a payment receipt.
 * @param {Object} paymentData 
 * @returns {Promise<boolean>} True if verified
 */
export const verifyPayment = async (paymentData) => {
    try {
        const formData = new FormData();
        Object.keys(paymentData).forEach(key => formData.append(key, paymentData[key]));

        // Direct URL since it's a specific webhook
        const response = await fetch(`https://n8n.vectorcuyo.com${ENDPOINTS.VERIFY_PAYMENT}`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) return false;

        const data = await response.json();
        // Check if n8n returned a success indicator
        // Assuming n8n returns { success: true } or similar, otherwise status 200 is enough
        return true;
    } catch (error) {
        console.error("Payment verification error:", error);
        return false;
    }
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
        formData.append('id_usuario', clientId); // Added for backends that check both
        formData.append('include_sent', 'true'); // Hint for n8n to include emisor matches

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
 * Fetches current pricing and dimension configuration from n8n.
 * @returns {Promise<Object>}
 */
export const fetchPrices = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PRICES}?t=${Date.now()}`);
        if (!response.ok) throw new Error("Failed to fetch prices");

        const data = await response.json();
        const item = Array.isArray(data) ? data[0] : data;

        // Standardized configuration object
        return {
            textil: {
                base: parseFloat(item.precio_metro) || 13500,
                p10: parseFloat(item.precio_mayorista_10) || 11500,
                p30: parseFloat(item.precio_mayorista_30) || 10500,
                limits: {
                    minWidth: parseFloat(item.textil_min_width) || 50,
                    maxWidth: parseFloat(item.textil_max_width) || 58,
                    minLength: parseFloat(item.textil_min_length) || 1,
                    maxLength: parseFloat(item.textil_max_length) || 10
                }
            },
            uv: {
                base: parseFloat(item.uv_precio_metro) || 18000,
                p10: parseFloat(item.uv_precio_mayorista_10) || 16000,
                p30: parseFloat(item.uv_precio_mayorista_30) || 15000,
                limits: {
                    minWidth: parseFloat(item.uv_min_width) || 25,
                    maxWidth: parseFloat(item.uv_max_width) || 28,
                    minLength: parseFloat(item.uv_min_length) || 0.1,
                    maxLength: parseFloat(item.uv_max_length) || 5
                }
            }
        };
    } catch (error) {
        console.error("Error fetching prices:", error);
        // Fallback defaults
        return {
            textil: { base: 13500, p10: 11500, p30: 10500, limits: { minWidth: 50, maxWidth: 58, minLength: 1, maxLength: 10 } },
            uv: { base: 18000, p10: 16000, p30: 15000, limits: { minWidth: 25, maxWidth: 28, minLength: 0.1, maxLength: 5 } }
        };
    }
};

/**
 * Submits a new order to n8n.
 * @param {FormData} formData - The FormData object containing files and fields
 * @param {boolean} isB2B - Whether this is a B2B order sent to a client
 * @returns {Promise<boolean>} - True if successful
 */
export const submitOrder = async (formData, isB2B = false) => {
    try {
        const endpoint = isB2B ? "https://n8n.vectorcuyo.com/webhook/b2b-order" : `${API_BASE_URL}${ENDPOINTS.UPLOAD_ORDER}`;
        const response = await fetch(endpoint, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Upload failed [${response.status}]:`, errorText);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error submitting order:", error);
        return false;
    }
};

/**
 * Admin: Fetches all orders from n8n.
 * @returns {Promise<Array>}
 */
export const fetchAllOrders = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_ALL_ORDERS}`);
        if (!response.ok) throw new Error("Failed to fetch all orders");
        const data = await response.json();
        return Array.isArray(data) ? data : (data.json || []);
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return [];
    }
};

/**
 * Admin: Updates the status of an order.
 * @param {string} orderId 
 * @param {string} newStatus 
 * @returns {Promise<boolean>}
 */
export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPDATE_ORDER_STATUS}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: orderId, status: newStatus })
        });
        return response.ok;
    } catch (error) {
        console.error("Error updating order status:", error);
        return false;
    }
};

/**
 * Admin: Updates product prices.
 * @param {Object} newPrices { precio_metro, precio_mayorista_10, precio_mayorista_30 }
 * @returns {Promise<boolean>}
 */
export const updatePrices = async (newPrices) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPDATE_PRICES}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPrices)
        });
        return response.ok;
    } catch (error) {
        console.error("Error updating prices:", error);
        return false;
    }
};
/**
 * Submits an order linked to a client via B2B Token.
 * @param {FormData} formData 
 * @returns {Promise<Object>} Response data
 */
export const submitB2BOrder = async (formData) => {
    try {
        const response = await fetch(`https://n8n.vectorcuyo.com/webhook/b2b-order`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error("B2B Submission failed");
        return await response.json();
    } catch (error) {
        console.error("B2B Submission error:", error);
        throw error;
    }
};

export default {
    login,
    register,
    verifyPayment,
    fetchOrders,
    fetchPrices,
    submitOrder,
    fetchAllOrders,
    updateOrderStatus,
    updatePrices,
    submitB2BOrder
};
