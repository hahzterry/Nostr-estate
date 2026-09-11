import axios from "axios";

const API = axios.create({
    // baseURL: "http://127.0.0.1:8000",
    baseURL: "https://geocoding.geo.census.gov/geocoder/",
    timeout: 10000, // ⏱️ Prevents the request from hanging
});

// =========================
// MAP
// =========================
export const getClusters = (filters) =>
    API.get("/map/clusters", { params: filters });

export const getHeatmap = (filters) =>
    API.get("/map/heatmap", { params: filters });

export const getPoints = (filters) =>
    API.get("/map/points", { params: filters });

// =========================
// PROPERTIES
// =========================
export const getProperties = (filters) =>
    API.get("/properties", { params: filters });

// =========================
// 🔥 PREDICT (NEW)
// =========================
export const getPrediction = (district) =>
    API.get("/predict/", {
        params: { district }
    });

// =========================
// 📍 CENSUS GEOCODER (USA)
// =========================
export const geocodeAddress = (address) =>
    API.get("/locations/onelineaddress", {
        params: {
            address: address,
            benchmark: "Public_AR_Current",
            format: "json"
        }
    });

// =========================
// EXPORT DEFAULT (KEY)
// =========================
export default API;