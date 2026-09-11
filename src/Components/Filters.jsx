import React, { useState } from "react";

const Filters = ({ setFilters }) => {
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const [district, setDistrict] = useState("");

    const applyFilters = () => {
        setFilters({
            price_min: priceMin,
            price_max: priceMax,
            district
        });
    };

    return (
        <div>
            <h3>Filters</h3>

            <input
                placeholder="Minimum price"
                value={priceMin}
                onChange={e => setPriceMin(e.target.value)}
            />

            <input
                placeholder="Maximum price"
                value={priceMax}
                onChange={e => setPriceMax(e.target.value)}
            />

            <input
                placeholder="District / ZIP Code"
                value={district}
                onChange={e => setDistrict(e.target.value)}
            />

            <button onClick={applyFilters}>Search</button>
        </div>
    );
};

export default Filters;