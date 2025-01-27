import leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

import { BOUNDS } from "../lib/config";
import { getMapLocationById } from "../lib/locations";
import { getMapLocationId } from "../lib/router";

export default function Map(container: HTMLDivElement) {
  const mapLocationId = getMapLocationId();
  const mapLocation =
    typeof mapLocationId === "number"
      ? getMapLocationById(mapLocationId)
      : null;

  const map = leaflet.map(container, {
    zoomControl: false,
    attributionControl: false,
    minZoom: -3,
    maxZoom: 5,
    zoomSnap: 0.5,
    zoomDelta: 0.5,
    wheelPxPerZoomLevel: 120,
    crs: leaflet.CRS.Simple,
  });
  if (mapLocation) {
    map.setView([mapLocation.y, mapLocation.x], 0);
  } else {
    map.fitBounds(BOUNDS);
  }

  const divElement = leaflet.DomUtil.create("div", "leaflet-position");
  const handleMouseMove = (event: leaflet.LeafletMouseEvent) => {
    divElement.innerHTML = `<span>[${event.latlng.lng.toFixed(
      2
    )}, ${event.latlng.lat.toFixed(2)}]</span>`;
  };
  const handleMouseOut = () => {
    divElement.innerHTML = ``;
  };
  const CoordinatesControl = leaflet.Control.extend({
    onAdd(map: leaflet.Map) {
      map.on("mousemove", handleMouseMove);
      map.on("mouseout", handleMouseOut);
      return divElement;
    },
    onRemove(map: leaflet.Map) {
      map.off("mousemove", handleMouseMove);
      map.off("mouseout", handleMouseOut);
    },
  });

  const coordinates = new CoordinatesControl({ position: "bottomleft" });
  coordinates.addTo(map);

  if (typeof overwolf !== "undefined") {
    overwolf.settings.hotkeys.onPressed.addListener((event) => {
      if (event.name === "zoom_in_app") {
        map.zoomIn();
      } else if (event.name === "zoom_out_app") {
        map.zoomOut();
      }
    });
  }

  return map;
}
