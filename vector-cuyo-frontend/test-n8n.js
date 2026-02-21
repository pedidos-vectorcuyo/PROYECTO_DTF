import fetch from 'node-fetch';

const BASE_URL = "https://n8n.vectorcuyo.com/webhook";
const PRICE_ENDPOINT = "/precio-dtf";

console.log(`Testing connection to: ${BASE_URL}${PRICE_ENDPOINT}`);

async function testConnection() {
    try {
        const response = await fetch(`${BASE_URL}${PRICE_ENDPOINT}`);
        console.log(`Status: ${response.status}`);

        if (response.ok) {
            const data = await response.json();
            console.log("Success! Data received:");
            console.log(data);
        } else {
            console.error("Error: Server responded with status", response.status);
            const text = await response.text();
            console.error("Response body:", text);
        }
    } catch (error) {
        console.error("Network Error:", error.message);
    }
}

testConnection();
