import React, { useState, useEffect } from 'react';
import { getMapLocations as getPins } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import './MapPage.css';

const MapPage = () => {
  const [pins, setPins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
            <div
              className="simple-map-container"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: 'white',
                borderRadius: '8px',
                margin: '20px 0',
              }}
            >
              <h3 style={{ marginBottom: '20px' }}>Interactive Map</h3>
              <div style={{ textAlign: 'center' }}>
                <p>🌍 World Map with Guest Locations</p>
                <p>📍 {pins.length} pins from our wonderful guests</p>
                <div style={{ marginTop: '20px' }}>
                  {pins.length > 0 && (
                    <div>
                      <h4>Locations:</h4>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {pins.slice(0, 5).map((pin, idx) => (
                          <li key={`${pin.lat}-${pin.lng}-${idx}`} style={{ margin: '5px 0' }}>
                            📍 {pin.label || `Location ${idx + 1}`}
                          </li>
                        ))}
                        {pins.length > 5 && (
                          <li style={{ fontStyle: 'italic' }}>
                            ... and {pins.length - 5} more locations
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.8 }}>
                  Interactive map functionality will be restored soon
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MapPage;
