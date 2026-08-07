import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

import type { IJobMapProps } from "../../types/components";
import styles from "./JobMap.module.css";

const USA_CENTER: [number, number] = [39.8283, -98.5795];

function JobMap({
  location,
  latitude,
  longitude,
}: IJobMapProps): React.JSX.Element {
  const markerPosition: [number, number] | null =
    typeof latitude === "number" && typeof longitude === "number"
      ? [latitude, longitude]
      : null;

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2>Job Location</h2>
          <p>{location}</p>
        </div>

        {markerPosition && (
          <span className={styles.status}>Location found</span>
        )}
      </div>

      <MapContainer
        center={USA_CENTER}
        zoom={4}
        minZoom={3}
        scrollWheelZoom={false}
        className={styles.map}
      >
        <TileLayer
          attribution={
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markerPosition && (
          <CircleMarker
            center={markerPosition}
            radius={10}
            pathOptions={{
              color: "#111827",
              fillColor: "#4b5563",
              fillOpacity: 0.9,
              weight: 3,
            }}
          >
            <Popup>
              <strong>{location}</strong>
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>

      {!markerPosition && (
        <p className={styles.message}>
          Exact coordinates are unavailable. The map shows the United States.
        </p>
      )}
    </section>
  );
}

export default JobMap;
