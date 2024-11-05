import React, { useEffect, useState } from 'react';
import PropertyCard from '../PropertyCard';
import './PropertyListing.scss';

const PropertyListing = () => {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        const fetchProperties = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:3000/api/properties');
                if (!response.ok) {
                    throw new Error('Failed to fetch properties');
                }
                const data = await response.json();
                setProperties(data);
            } catch (e) {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperties();
    }, []);

    return (
        <ul className="PropertyListing">
            {isLoading && <h4>Loading...</h4>}
            {properties.length > 0 &&
                properties.map((property, index) => (
                    <li key={`property-item-${property.id + index}`}>
                        <PropertyCard {...property} />
                    </li>
                ))
            }
            {properties.length === 0 && !isLoading && !error && <h2>No properties available</h2>}
            {error && <h2>Error fetching properties</h2>}
        </ul>
    );
};

export default PropertyListing;
