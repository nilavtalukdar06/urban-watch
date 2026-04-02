"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

export function ReportMap({ location, latStr, lngStr }: { location?: string; latStr?: string; lngStr?: string }) {
  if (!location && !latStr && !lngStr) return null;

  let lat = parseFloat(latStr || "");
  let lng = parseFloat(lngStr || "");

  if (isNaN(lat) || isNaN(lng)) {
    if (location) {
      const locParts = location.split(",").map((s) => parseFloat(s.trim()));
      lat = locParts.length === 2 ? (locParts[0] ?? 0) : 0;
      lng = locParts.length === 2 ? (locParts[1] ?? 0) : 0;
    } else {
      lat = 0;
      lng = 0;
    }
  }

  const isValidCoord = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-fit mt-2 rounded-none shadow-none"
        >
          Open on Map
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl border-none p-0 overflow-hidden bg-transparent shadow-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Report Location</DialogTitle>
        </DialogHeader>

        <div className="w-full h-[600px] rounded-lg overflow-hidden relative shadow-md">
          {isValidCoord && lat && lng ? (
            <Map
              mapboxAccessToken={MAPBOX_TOKEN}
              initialViewState={{
                longitude: lng,
                latitude: lat,
                zoom: 16,
              }}
              mapStyle="mapbox://styles/mapbox/streets-v12"
              style={{ width: "100%", height: "100%" }}
            >
              <Marker longitude={lng} latitude={lat} anchor="bottom">
                <MapPin className="text-red-500 fill-red-100 h-8 w-8" />
              </Marker>
            </Map>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-background rounded-lg border text-muted-foreground p-4 text-center">
              <p>Map view requires precise coordinates.</p>
              <p className="mt-2">
                Address entered: <strong>{location}</strong>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
