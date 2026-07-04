"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export interface MapMarker {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
}

interface LocationMapProps {
  markers: MapMarker[];
  className?: string;
  zoom?: number;
}

const MapInner = dynamic(
  () => import("./location-map-inner").then((m) => m.LocationMapInner),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full min-h-[220px] w-full rounded-xl" />,
  },
);

export function LocationMap({ markers, className, zoom = 13 }: LocationMapProps) {
  if (markers.length === 0) return null;

  return (
    <div className={className}>
      <MapInner markers={markers} zoom={zoom} />
    </div>
  );
}
