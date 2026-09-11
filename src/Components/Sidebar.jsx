import React from "react";

const Sidebar = ({ properties = [], onSelectProperty, selectedProperty }) => {

    // Normalize IDs once (supports both `id` and `PropertyId`)
    const selectedId = selectedProperty?.id || selectedProperty?.PropertyId;

    return (
        <div style={{
            width: "100%",
            height: "100%",
            overflowY: "auto",
            background: "#fff",
            padding: "8px",
            boxSizing: "border-box"
        }}>
            <h3 style={{ marginBottom: "8px", fontSize: "14px" }}>
                Properties{" "}
                {properties.length > 0 && (
                    <span style={{ color: "#888", fontWeight: "normal", fontSize: "12px" }}>
                        ({properties.length})
                    </span>
                )}
            </h3>

            {/* Empty state */}
            {properties.length === 0 && (
                <p style={{ fontSize: "12px", color: "#888" }}>
                    No properties found. Try adjusting your filters.
                </p>
            )}

            {properties.map(p => {

                const propId = p.id || p.PropertyId;
                const isSelected = selectedId === propId;

                // US number formatting
                const formattedPrice = p.price
                    ? `$${Number(p.price).toLocaleString("en-US")}`
                    : "-";

                return (
                    <div
                        key={propId}
                        onClick={() => {
                            console.log("🖱️ Property clicked:", p);
                            onSelectProperty?.(p);
                        }}
                        style={{
                            padding: "10px",
                            cursor: "pointer",
                            borderRadius: "6px",
                            marginBottom: "6px",

                            fontSize: "12px",
                            lineHeight: "16px",

                            background: isSelected ? "#dbeafe" : "#fff",
                            border: isSelected
                                ? "2px solid #3b82f6"
                                : "1px solid #eee",

                            transition: "all 0.2s ease",
                            boxShadow: isSelected
                                ? "0 2px 6px rgba(59,130,246,0.15)"
                                : "none"
                        }}
                    >
                        <div style={{ fontWeight: "600", marginBottom: "3px" }}>
                            {p.title || "Untitled Property"}
                        </div>

                        <div style={{ color: "#16a34a", fontWeight: "600" }}>
                            💰 {formattedPrice}
                        </div>

                        <div style={{ color: "#555" }}>
                            📍 {p.district || p.district_name || "Unknown District"}
                        </div>

                        {/* Optional extras (render only if present) */}
                        {(p.beds || p.baths || p.sqft) && (
                            <div style={{ color: "#777", fontSize: "11px", marginTop: "3px" }}>
                                {p.beds && `🛏️ ${p.beds} bd `}
                                {p.baths && `🛁 ${p.baths} ba `}
                                {p.sqft && `📐 ${Number(p.sqft).toLocaleString("en-US")} sq ft`}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Sidebar;