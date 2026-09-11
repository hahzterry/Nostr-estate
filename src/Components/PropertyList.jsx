import React from "react";

const PropertyList = ({ properties, selectedProperty, onSelectProperty }) => {
    if (!properties || properties.length === 0) {
        return (
            <div className="property-list">
                <h3>Properties</h3>
                <p style={{ color: "#888", fontSize: "13px" }}>
                    No properties found. Try adjusting your filters.
                </p>
            </div>
        );
    }

    return (
        <div className="property-list">
            <h3>
                Properties{" "}
                <span style={{ color: "#888", fontSize: "13px", fontWeight: "normal" }}>
                    ({properties.length})
                </span>
            </h3>

            {properties.map((p, i) => {
                const isSelected = selectedProperty?.id === p.id;

                return (
                    <div
                        key={p.id || i}
                        className={`card ${isSelected ? "selected" : ""}`}
                        onClick={() => onSelectProperty?.(p)}
                        style={{
                            cursor: "pointer",
                            padding: "12px",
                            marginBottom: "10px",
                            borderRadius: "8px",
                            border: isSelected ? "2px solid #2563eb" : "1px solid #e5e7eb",
                            background: isSelected ? "#eff6ff" : "white",
                            transition: "all 0.2s ease",
                            boxShadow: isSelected ? "0 2px 8px rgba(37,99,235,0.15)" : "none"
                        }}
                    >
                        <h4 style={{ margin: "0 0 6px 0", fontSize: "14px" }}>
                            {p.title || "Untitled Property"}
                        </h4>

                        <p style={{ margin: "2px 0", fontSize: "12px", color: "#555" }}>
                            📍 {p.district || "Unknown District"}
                        </p>

                        <p style={{ margin: "2px 0", fontSize: "14px", fontWeight: "bold", color: "#16a34a" }}>
                            💰 ${p.price?.toLocaleString("en-US") || "-"}
                        </p>

                        {p.beds && p.baths && (
                            <p style={{ margin: "2px 0", fontSize: "12px", color: "#666" }}>
                                🛏️ {p.beds} bd &nbsp;|&nbsp; 🛁 {p.baths} ba
                                {p.sqft && ` | 📐 ${p.sqft.toLocaleString("en-US")} sq ft`}
                            </p>
                        )}

                        {p.price_sqft && (
                            <p style={{ margin: "2px 0", fontSize: "11px", color: "#888" }}>
                                ${p.price_sqft.toFixed(0)} / sq ft
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default PropertyList;