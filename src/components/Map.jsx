// src/components/Map.jsx
import { MapContainer } from 'react-leaflet';
import { useState, useEffect } from 'react';

const Map = (props) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // Render nothing on the server or during initial client render
  }

  return (
    <MapContainer {...props}>
      {props.children}
    </MapContainer>
  );
};

export default Map;