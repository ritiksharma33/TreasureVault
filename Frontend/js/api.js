// File: frontend/js/api.js (FINAL UNIFIED AND SECURED CODE)

const API_BASE_URL = 'http://127.0.0.1:8000';
const AUTH_PREFIX = '/auth'; // Used for Login/Register endpoints
const API_PREFIX = '/api';   // Used for Vault/Transcript endpoints

// ==========================================================
// HELPER: Get Auth Headers
// ==========================================================

/**
 * Retrieves the JWT token from localStorage and formats it as a Bearer header.
 */
function getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    if (!token) return {};
    return {
        'Authorization': `Bearer ${token}`
    };
}

/**
 * Helper to consolidate headers for JSON requests.
 */
function getJsonAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        ...getAuthHeaders() 
    };
}

/**
 * Generic handler to check for 401 Unauthorized errors in API responses.
 * Throws a specific "Unauthorized" error if the token is invalid or missing.
 */
async function checkResponse(response) {
    if (response.status === 401) {
        localStorage.removeItem('access_token');
        throw new Error("Unauthorized");
    }
    if (!response.ok) {
        // Attempt to extract the detailed error from FastAPI's response body
        let errorDetail = "API call failed with unknown error.";
        try {
            const errorData = await response.json();
            errorDetail = errorData.detail || errorDetail;
        } catch(e) {
            // Ignore if response body isn't parsable JSON
        }
        throw new Error(errorDetail);
    }
    return response;
}

// ==========================================================
// AUTHENTICATION OPERATIONS
// ==========================================================

async function registerUser(username, password) {
    const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    // Use checkResponse to validate success and handle errors
    const checkedResponse = await checkResponse(response);
    return await checkedResponse.json(); 
}

async function loginUser(username, password) {
    // IMPORTANT: Use URLSearchParams to mimic form-data for FastAPI's OAuth2
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/login`, {
        method: 'POST',
        body: params, 
    });

    const checkedResponse = await checkResponse(response);
    const data = await checkedResponse.json();
    return data.access_token; 
}

// ==========================================================
// VAULT CRUD OPERATIONS (ALL SECURED)
// ==========================================================

/**
 * Fetches all vaults from the backend.
 */
async function getVaults(searchTerm = null) {
    let url = `${API_BASE_URL}${API_PREFIX}/vaults`;
    if (searchTerm) {
        // Search query parameter is added
        url += `?search=${encodeURIComponent(searchTerm)}`; 
    }
    
    const response = await fetch(url, {
        headers: getAuthHeaders() // Sending Auth Header for GET
    });

    const checkedResponse = await checkResponse(response);
    return await checkedResponse.json();
}

/**
 * Fetches a single vault by its ID.
 */
async function getVaultById(vaultId) {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/vaults/${vaultId}`, {
        headers: getAuthHeaders() // Sending Auth Header for GET
    });
    const checkedResponse = await checkResponse(response);
    return await checkedResponse.json();
}

/**
 * Creates a new vault by sending data to the backend.
 */
async function createVault(vaultData) {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/vaults`, {
        method: 'POST',
        headers: getJsonAuthHeaders(), // Sending JSON and Auth Header
        body: JSON.stringify(vaultData),
    });
    const checkedResponse = await checkResponse(response);
    return await checkedResponse.json();
}

/**
 * Updates an existing vault by its ID.
 */
async function updateVault(vaultId, vaultData) {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/vaults/${vaultId}`, {
        method: 'PUT',
        headers: getJsonAuthHeaders(), // Sending JSON and Auth Header
        body: JSON.stringify(vaultData),
    });
    const checkedResponse = await checkResponse(response);
    return await checkedResponse.json();
}

/**
 * Deletes a vault by its ID.
 */
async function deleteVault(vaultId) {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/vaults/${vaultId}`, {
        method: 'DELETE',
        headers: getAuthHeaders() // Sending Auth Header for DELETE
    });
    const checkedResponse = await checkResponse(response);
    return await checkedResponse.json();
}

// ==========================================================
// TRANSCRIPT SERVICE OPERATION (SECURED)
// ==========================================================

/**
 * Sends a YouTube URL to the backend to fetch its transcript and save as a vault.
 */
// File: frontend/js/api.js

async function fetchTranscriptAndSave(url) {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/transcript`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // REMOVED getJsonAuthHeaders
        body: JSON.stringify({ url: url }),
    });

    const checkedResponse = await checkResponse(response);
    return await checkedResponse.json(); // This returns the newly created Vault object
}
