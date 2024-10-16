"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FullscreenControl,
  GeolocateControl,
  Layer,
  LayerProps,
  Map,
  Marker,
  NavigationControl,
  Source,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import envConfig from "@/config";
import { navigate } from "@/actions";
import { Button } from "./ui/button";
import { Navigation } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "LineString" | "Point";
    coordinates: [number, number][];
  };
}

interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export default function MapBox({ latitude, longitude }: { latitude: string, longitude: string }) {

  const [start, setStart] = useState({ latitude: 0, longitude: 0 });
  const [end] = useState({
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  });
  const [coords, setCoords] = useState<[number, number][]>([]);
  const geoControlRef = useRef<mapboxgl.GeolocateControl | null>(null);
  const [routeInstructions, setRouteInstructions] = useState<string[]>([]);

  console.log(end);

  const pin = useMemo(
    () => (
      <Marker
        longitude={parseFloat(longitude)}
        latitude={parseFloat(latitude)}
        anchor="center"
      />
    ),
    []
  );

  const getRoute = async () => {
    const routeResponse = await navigate(
      envConfig.NEXT_PUBLIC_MAPBOX_API_TOKEN,
      start,
      end
    );
    console.log(routeResponse);

    const coords = routeResponse.routes[0].geometry.coordinates;
    const instruction = routeResponse.routes[0].legs[0].steps.map(
      (step: any) => step.maneuver.instruction
    );
    setCoords(coords);
    setRouteInstructions(instruction);
  };

  const geojson: GeoJSONFeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: coords,
        },
      },
    ],
  };

  const lineStyle: LayerProps = {
    id: "roadLayer",
    type: "line",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "blue",
      "line-width": 4,
      "line-opacity": 0.75,
    },
  };

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleGeolocate, (error) => {
          console.error("Error getting location:", error);
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getCurrentLocation();
  }, []);

  const handleNavigation = () => {
    geoControlRef.current?.trigger();
    getRoute();
  };

  const handleGeolocate = (position: any) => {
    const { latitude, longitude } = position.coords;
    setStart({ latitude, longitude });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div
        style={{ width: "100%", height: "400px" }}
        className="relative overflow-hidden"
      >
        <Map
          reuseMaps
          style={{ width: "100%", height: "100%" }}
          initialViewState={{
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            zoom: 15,
            bearing: 0,
            pitch: 0,
          }}
          mapboxAccessToken={envConfig.NEXT_PUBLIC_MAPBOX_API_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v11?language=vi"
        >
          <Source id="routeSrc" type="geojson" data={geojson}>
            <Layer {...lineStyle} />
          </Source>
          <GeolocateControl ref={geoControlRef} position="top-left" />
          <FullscreenControl position="top-left" />
          <NavigationControl position="top-left" />
          {pin}
        </Map>

        <div className="absolute right-0 top-0">
          <Button
            variant={"ghost"}
            className="m-[10px] p-3 bg-white"
            type="button"
            onClick={handleNavigation}
          >
            <Navigation size={20} />
          </Button>
        </div>
      </div>

      {routeInstructions.length > 0 && (
        <div className="mt-4 p-4 border-t">
          <h2 className="text-lg font-semibold mb-2">Hướng dẫn</h2>
          <ScrollArea className="h-40 bg-gray-100 p-3 rounded overflow-y-auto">
            <ul className="space-y-2">
              {routeInstructions.map((instruction, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {index + 1}. {instruction}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
