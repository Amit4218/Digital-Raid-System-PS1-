import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import axios from "axios";

// Heatmap Layer (always shown)
const HeatmapLayer = () => {
  const map = useMap();
  const [heatLayer, setHeatLayer] = useState(null);
  const intensity = 0.4;

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/heatmap`
        );
        const heatmapPoints = response.data.heatmapData
          .filter((point) => point.lat && point.long)
          .map((point) => [
            parseFloat(point.lat),
            parseFloat(point.long),
            intensity,
          ]);

        if (heatLayer) {
          map.removeLayer(heatLayer);
        }

        const newHeatLayer = L.heatLayer(heatmapPoints, {
          radius: 25,
          blur: 15,
          maxZoom: 17,
          minOpacity: 0.5,
          max: 1.0,
          gradient: {
            0.4: "blue",
            0.6: "cyan",
            0.7: "lime",
            0.8: "yellow",
            1.0: "red",
          },
        }).addTo(map);

        setHeatLayer(newHeatLayer);
      } catch (error) {
        console.error("Error fetching heatmap data:", error);
      }
    };

    fetchHeatmapData();

    return () => {
      if (heatLayer) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map]);

  return null;
};

const Heatmap = () => {
  const [markerPosition, setMarkerPosition] = useState([]);
  const [showMarkers, setShowMarkers] = useState(false);

  const fetchMarkerData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/heatmap`
      );
      const markerPosition = response.data.heatmapData
        .filter((point) => point.lat && point.long)
        .map((point) => [
          parseFloat(point.lat),
          parseFloat(point.long),
          point.description,
          point.address,
          point.culpritName,
        ]);
      setMarkerPosition(markerPosition);
    } catch (error) {
      console.error("Error fetching marker data:", error);
    }
  };

  useEffect(() => {
    fetchMarkerData();
  }, []);

  return (
    <div className="h-[70vh] relative z-20">
      {/* Checkbox UI */}
      <div className="absolute z-[1000] top-4 right-4 bg-white p-3 rounded shadow-md">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showMarkers}
            onChange={(e) => setShowMarkers(e.target.checked)}
          />
          <span>Show Markers</span>
        </label>
      </div>

      <MapContainer
        center={[27.3314, 88.6138]}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HeatmapLayer />

        {showMarkers &&
          markerPosition.map((position, index) => (
            <Marker
              key={index}
              position={[position[0], position[1]]}
              title={position[2]}
            >
              <Popup>
                <div>
                  <h3>{position[2]}</h3>
                  <h2>Culprit: {position[4]}</h2>
                  <h2>Address: {position[3]}</h2>
                  <p>
                    Coordinates: {position[0]}, {position[1]}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default Heatmap;
