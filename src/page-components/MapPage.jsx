import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getMapLocations as getPins } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import './MapPage.css';

const Map = dynamic(() => import('../components/Map'), {
  loading: () => <p>Loading map...</p>,
  ssr: false,
});

const MapPage = () => {
  const [pins, setPins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchPins = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPins();
        setPins(response.data);
      } catch {
        setError('Could not load map pins. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPins();
  }, []);

  // Optionally allow users to add a pin by clicking the map (disabled by default for privacy)
  // const handleMapClick = async (e) => {
  //   const { lat, lng } = e.latlng;
  //   try {
  //     await addPin({ lat, lng });
  //     setSuccess('Your visit has been logged!');
  //     const response = await getPins();
  //     setPins(response.data);
  //   } catch (err) {
  //     setError('Could not log your visit.');
  //   }
  // };

  return (
    <div className="map-page">
      {isLoading && <LoadingScreen message="Loading map..." />}
      {!isLoading && (
        <>
          <h2 className="section-title">Visitor Map</h2>
          <p className="subheading">See where our guests are joining from!</p>
          {error ? (
            <div className="error-message" role="alert">
              {error}
            </div>
          ) : (
            <Map pins={pins} />
          )}
        </>
      )}
    </div>
  );
};

export default MapPage;
