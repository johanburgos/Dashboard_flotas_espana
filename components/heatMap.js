"use client";
// components/GoogleMap.js

import React from 'react';
import GoogleMapReact from 'google-map-react'

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 40.4168,
  lng: -3.7038,
};

const libraries = ["visualization"];

// Function to generate random coordinates within Madrid bounds
function generateRandomCoordinates() {
  const minLat = 40.41;
  const maxLat = 40.42;
  const minLng = -3.71;
  const maxLng = -3.70;

  const randomLat = Math.random() * (maxLat - minLat) + minLat;
  const randomLng = Math.random() * (maxLng - minLng) + minLng;

  return { lat: randomLat, lng: randomLng };
}

// Generate a large dataset with 200 data points for demonstration
const heatmapData = Array.from({ length: 200 }, generateRandomCoordinates);
const apiKey = {key: 'AIzaSyCufQ68Dqw6V6yfMJLzSEnjalBnhyKLeLQ'}
const GoogleMapComponent = () => {
  return (
    <div style={{ height: '400px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={apiKey}
        defaultCenter={
          {
            lat: 40.4168,
            lng: -3.7038,
          }
        }
        defaultZoom={15}
        heatmapLibrary={true}
        heatmap={
          {
            positions: heatmapData,
            options: {
              radius: 20,
              opacity: 0.6,
            }
          }
        }
      >
      </GoogleMapReact>
    </div>
  );
};

export default GoogleMapComponent;
