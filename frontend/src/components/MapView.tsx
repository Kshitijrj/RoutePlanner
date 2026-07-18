import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { LayersControl } from "react-leaflet";

const { BaseLayer } = LayersControl;
import { ChevronDown, ChevronUp, MapPinned } from "lucide-react";

import type { TripResponse } from "../types/trip";

import "leaflet/dist/leaflet.css";

interface Props {
  trip: TripResponse;
}

function createMarker(color: string) {
  return new L.DivIcon({
    html: `
      <div style="
        width:26px;
        height:26px;
        border-radius:50%;
        background:${color};
        border:4px solid white;
        box-shadow:0 0 18px rgba(0,0,0,.35);
      "></div>
    `,
    className: "",
    iconSize: [26, 26],
  });
}

const currentIcon = createMarker("#2563eb");
const pickupIcon = createMarker("#22c55e");
const dropoffIcon = createMarker("#ef4444");

function FitBounds({ coordinates }: { coordinates: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length) {
      map.fitBounds(L.latLngBounds(coordinates), {
        padding: [60, 60],
      });
    }
  }, [coordinates, map]);

  return null;
}

export default function MapView({ trip }: Props) {
  const [open, setOpen] = useState(false);

  const coordinates = trip.geometry.coordinates.map(([lng, lat]) => [
    lat,
    lng,
  ]) as [number, number][];

  const current = coordinates[0];
  const pickup = coordinates[Math.floor(coordinates.length / 2)];
  const dropoff = coordinates[coordinates.length - 1];

  return (
    <div className="relative">
      <MapContainer
        center={current}
        zoom={5}
        className="h-[600px] w-full rounded-b-3xl"
        scrollWheelZoom
      >
        <LayersControl position="topright">
          <BaseLayer checked name="Topographic">
            <TileLayer
              attribution="Tiles © Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>

          <BaseLayer name="Street">
            <TileLayer
              attribution="© CARTO"
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          </BaseLayer>

          <BaseLayer name="Terrain">
            <TileLayer
              attribution="Tiles © Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>

          <BaseLayer name="Satellite">
            <TileLayer
              attribution="Tiles © Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>
        </LayersControl>

        <FitBounds coordinates={coordinates} />

        <Polyline
          positions={coordinates}
          pathOptions={{
            color: "#ffffff",
            weight: 10,
            opacity: 0.95,
          }}
        />

        <Polyline
          positions={coordinates}
          pathOptions={{
            color: "#2563eb",
            weight: 6,
            opacity: 1,
          }}
        />

        <Marker position={current} icon={currentIcon}>
          <Popup>
            <div className="space-y-2">
              <h3 className="font-bold text-blue-600">Current Location</h3>

              <p>{trip.locations.current}</p>
            </div>
          </Popup>
        </Marker>

        <Marker position={pickup} icon={pickupIcon}>
          <Popup>
            <div className="space-y-2">
              <h3 className="font-bold text-green-600">Pickup</h3>

              <p>{trip.locations.pickup}</p>
            </div>
          </Popup>
        </Marker>

        <Marker position={dropoff} icon={dropoffIcon}>
          <Popup>
            <div className="space-y-2">
              <h3 className="font-bold text-red-600">Dropoff</h3>

              <p>{trip.locations.dropoff}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Floating Dropdown */}

      <div className="absolute top-5 left-5 z-[1000]">
        <div className="w-72 rounded-2xl bg-white/95 backdrop-blur-lg shadow-xl border border-slate-200 overflow-hidden">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <MapPinned className="text-blue-600" />

              <div className="text-left">
                <h2 className="font-bold">Trip Overview</h2>

                <p className="text-xs text-gray-500">
                  Click to {open ? "hide" : "show"}
                </p>
              </div>
            </div>

            {open ? <ChevronUp /> : <ChevronDown />}
          </button>

          <div
            className={`transition-all duration-300 overflow-hidden ${
              open ? "max-h-80" : "max-h-0"
            }`}
          >
            <div className="px-5 pb-5 space-y-4">
              <Stat
                title="Distance"
                value={`${trip.trip.distance_km.toFixed(1)} km`}
              />

              <Stat
                title="Duration"
                value={`${trip.trip.duration_hours.toFixed(1)} hrs`}
              />

              <Stat
                title="Current Cycle"
                value={`${trip.trip.current_cycle_used.toFixed(1)} hrs`}
              />

              <Stat
                title="Remaining"
                value={`${trip.trip.remaining_cycle_hours.toFixed(1)} hrs`}
                green
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  title,
  value,
  green = false,
}: {
  title: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{title}</span>

      <span
        className={`font-bold ${green ? "text-green-600" : "text-slate-900"}`}
      >
        {value}
      </span>
    </div>
  );
}
