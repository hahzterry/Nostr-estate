import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { getHeatmap, getPoints } from "../Services/Api.js";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";

// FIX icons (default Leaflet marker icons don't load in bundlers)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ===============================
// 🔥 HEATMAP COMPONENT
// ===============================
const Heatmap = ({ data }) => {
    const map = useMap();

    useEffect(() => {
        console.log("🔥 [HEATMAP] render with data:", data);

        if (!map || !data || data.length === 0) return;

        const points = data
            .filter(d =>
                d &&
                d.lat !== null &&
                d.lng !== null &&
                !isNaN(Number(d.lat)) &&
                !isNaN(Number(d.lng))
            )
            .map(d => [
                Number(d.lat),
                Number(d.lng),
                // 🔥 USA: price is in USD per sq ft. Normalize by 1000 for heat intensity.
                d.price_sqft && d.price_sqft > 0
                    ? d.price_sqft / 1000
                    : 0.2
            ]);

        if (points.length === 0) return;

        const heat = L.heatLayer(points, {
            radius: 25,
            blur: 20,
            minOpacity: 0.2,
            gradient: {
                0.2: "blue",
                0.4: "lime",
                0.6: "yellow",
                1.0: "red"
            }
        });

        heat.addTo(map);

        return () => {
            map.removeLayer(heat);
        };
    }, [data, map]);

    return null;
};

// ===============================
// 📍 SELECTED MARKER
// ===============================
const SelectedMarker = ({ property }) => {
    const map = useMap();

    useEffect(() => {
        if (!property) return;

        if (property.lat && property.lng) {
            console.log("📍 [MAP] flyTo:", property.lat, property.lng);
            map.flyTo([property.lat, property.lng], 16, {
                duration: 1.2
            });
        }
    }, [property, map]);

    if (!property || !property.lat || !property.lng) return null;

    return (
        <Marker position={[property.lat, property.lng]}>
            <Popup>
                <b>{property.title || "Property"}</b><br />
                💰 ${property.price?.toLocaleString("en-US") || "-"}<br />
                📍 {property.district || "-"}
            </Popup>
        </Marker>
    );
};

// ===============================
// 🗺️ MAP VIEW
// ===============================
const MapView = ({ filters, onPropertiesLoaded, onLoading, selectedProperty }) => {

    const [heatmapData, setHeatmapData] = useState([]);

    useEffect(() => {

        const fetchData = async () => {

            console.log("🗺️ [MAP] fetch started with filters:", filters);

            onLoading?.();

            try {
                const [heatRes, propRes] = await Promise.all([
                    getHeatmap(filters),
                    getPoints(filters)
                ]);

                console.log("🔥 [MAP] HEAT RAW:", heatRes?.data);
                console.log("🏠 [MAP] PROPERTIES RAW:", propRes?.data);

                const cleanHeat = (heatRes?.data || []).filter(d =>
                    d &&
                    d.lat !== null &&
                    d.lng !== null &&
                    !isNaN(Number(d.lat)) &&
                    !isNaN(Number(d.lng))
                );

                setHeatmapData(cleanHeat);

                const properties = propRes?.data || [];
                onPropertiesLoaded?.(properties);

            } catch (err) {
                console.error("❌ [MAP] API ERROR:", err);
                setHeatmapData([]);
                onPropertiesLoaded?.([]);
            }
        };

        fetchData();

    }, [filters]);

    return (
        <MapContainer
            center={[33.7490, -84.3880]}   // 🍑 Atlanta, Georgia (USA default)
            zoom={12}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                referrerPolicy="no-referrer-when-downgrade"
            />

            <Heatmap data={heatmapData} />

            {/* 🔥 Selected property marker */}
            <SelectedMarker property={selectedProperty} />

        </MapContainer>
    );
};

export default MapView;