import React, { useState, useEffect } from "react";
import MapView from "./Components/MapView.jsx";
import Sidebar from "./Components/Sidebar.jsx";
import { getClusters, getPrediction } from "./Services/Api.js";
import "../Styles.css";

const App = () => {
    const [properties, setProperties] = useState([]);
    const [clusters, setClusters] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [prediction, setPrediction] = useState(null);

    const [loadingProperties, setLoadingProperties] = useState(false);

    const [filtersCollapsed, setFiltersCollapsed] = useState(false);
    const [clustersCollapsed, setClustersCollapsed] = useState(false);
    const [propertiesCollapsed, setPropertiesCollapsed] = useState(true);

    const [filters, setFilters] = useState({
        min_price: null,
        max_price: null,
        district: "",
    });

    // =========================
    // 🔢 FORMAT
    // =========================
    const formatNumber = (num) => {
        if (num === null || num === undefined || isNaN(num)) return "-";
        return Number(num).toFixed(2);
    };

    // =========================
    // 🔥 AI EVALUATION
    // =========================
    const evaluatePrice = () => {
        if (!prediction) return null;

        const predicted = Number(prediction.predicted_price);
        const avg = Number(prediction.avg_price);

        if (!predicted || !avg) return null;

        const diff = (predicted - avg) / avg;

        if (diff > 0.05) {
            return {
                label: "Opportunity",
                color: "#16a34a",
                icon: "🟢",
                message: "The projected price is above average. Area with upward potential."
            };
        }

        if (diff < -0.05) {
            return {
                label: "Overvalued",
                color: "#dc2626",
                icon: "🔴",
                message: "The projected price is below average. Risk of overpricing."
            };
        }

        return {
            label: "Fair Price",
            color: "#ca8a04",
            icon: "🟡",
            message: "The price is aligned with the market."
        };
    };

    const evaluation = evaluatePrice();

    // =========================
    // CLUSTERS
    // =========================
    useEffect(() => {
        const loadClusters = async () => {
            try {
                const res = await getClusters(filters);
                setClusters(res.data || []);
            } catch (err) {
                console.error(err);
                setClusters([]);
            }
        };
        loadClusters();
    }, [filters]);

    const filteredClusters = clusters
        .filter((c) =>
            filters.district
                ? c.district.toLowerCase().includes(filters.district.toLowerCase())
                : true
        )
        .sort((a, b) => (b.total_properties || 0) - (a.total_properties || 0));

    // =========================
    // 🔥 PREDICT
    // =========================
    useEffect(() => {
        if (!filters.district) {
            setPrediction(null);
            return;
        }

        const fetchPrediction = async () => {
            try {
                const res = await getPrediction(filters.district);
                setPrediction(res.data);
            } catch (err) {
                console.error(err);
                setPrediction({ error: "Prediction error" });
            }
        };

        fetchPrediction();
    }, [filters.district]);

    const handleSelectProperty = (prop) => {
        setSelectedProperty(prop);
        setPropertiesCollapsed(false);
    };

    const resetFilters = () => {
        setFilters({ min_price: null, max_price: null, district: "" });
        setPrediction(null);
    };

    return (
        <div className="layout">
            <div className="sidebar">

                {/* FILTERS */}
                <div className="section">
                    <h3 className="section-title" onClick={() => setFiltersCollapsed(p => !p)}>
                        Filters {filtersCollapsed ? "▼" : "▲"}
                    </h3>

                    {!filtersCollapsed && (
                        <div className="section-content">
                            <input type="number" placeholder="Minimum price"
                                onChange={e => setFilters(p => ({
                                    ...p,
                                    min_price: e.target.value ? Number(e.target.value) : null
                                }))} />

                            <input type="number" placeholder="Maximum price"
                                onChange={e => setFilters(p => ({
                                    ...p,
                                    max_price: e.target.value ? Number(e.target.value) : null
                                }))} />

                            <input type="text" placeholder="District"
                                value={filters.district}
                                onChange={e => setFilters(p => ({
                                    ...p,
                                    district: e.target.value
                                }))} />

                            <button onClick={resetFilters}>Reset</button>
                        </div>
                    )}
                </div>

                {/* CLUSTERS */}
                <div className="section">
                    <h3 className="section-title" onClick={() => setClustersCollapsed(p => !p)}>
                        Districts (Cluster) {clustersCollapsed ? "▼" : "▲"}
                    </h3>

                    {!clustersCollapsed && (
                        <div className="section-content clusters">
                            {filteredClusters.map((c, i) => {
                                const isSelected =
                                    filters.district.toLowerCase() === c.district.toLowerCase();

                                return (
                                    <div key={i}>
                                        <div
                                            className={`card ${isSelected ? "selected" : ""}`}
                                            onClick={() =>
                                                setFilters(p => ({ ...p, district: c.district }))
                                            }
                                        >
                                            <b>{c.district}</b><br />
                                            📦 {c.total_properties || 0}<br />
                                            💰 ${formatNumber(c.avg_price_m2)} / m²
                                        </div>

                                        {/* 🔥 PREDICTION */}
                                        {isSelected && (
                                            <div className="prediction">
                                                {!prediction && <p>⏳ Calculating...</p>}

                                                {prediction?.error && (
                                                    <p style={{ color: "red" }}>
                                                        ❌ {prediction.error}
                                                    </p>
                                                )}

                                                {prediction && !prediction.error && (
                                                    <>
                                                        <p>🤖 Estimated price: ${formatNumber(prediction.predicted_price)}</p>
                                                        <p>💰 Average: ${formatNumber(prediction.avg_price)}</p>
                                                        <p>📈 Trend: {formatNumber(prediction.trend)}</p>

                                                        {/* 🔥 AI CARD */}
                                                        {evaluation && (
                                                            <div style={{
                                                                marginTop: "10px",
                                                                padding: "10px",
                                                                borderRadius: "8px",
                                                                background: "#f9fafb",
                                                                border: `2px solid ${evaluation.color}`,
                                                                fontSize: "12px"
                                                            }}>
                                                                <b style={{ color: evaluation.color }}>
                                                                    {evaluation.icon} {evaluation.label}
                                                                </b>
                                                                <p style={{ marginTop: "5px" }}>
                                                                    {evaluation.message}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* PROPERTIES */}
                <div className="section">
                    <h3 className="section-title" onClick={() => setPropertiesCollapsed(p => !p)}>
                        Properties {propertiesCollapsed ? "▼" : "▲"}
                    </h3>

                    {!propertiesCollapsed && (
                        <div className="section-content">
                            {loadingProperties && <p>⏳ Loading...</p>}

                            <Sidebar
                                properties={properties}
                                onSelectProperty={handleSelectProperty}
                                selectedProperty={selectedProperty}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* MAP */}
            <div className="map-container">
                <MapView
                    filters={filters}
                    onPropertiesLoaded={(data) => {
                        setProperties(data || []);
                        setLoadingProperties(false);
                    }}
                    onLoading={() => setLoadingProperties(true)}
                    selectedProperty={selectedProperty}
                />
            </div>
        </div>
    );
};

export default App;