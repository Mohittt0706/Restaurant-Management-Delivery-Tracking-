import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, Marker, Polyline, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { MapPin, Navigation, Clock, Compass } from 'lucide-react';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const MAP_CONTAINER_STYLE = { width: '100%', height: '420px' };

const ORANGE_PIN = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44"><path d="M18 0C8 0 0 8 0 18c0 13.5 18 26 18 26s18-12.5 18-26C36 8 28 0 18 0z" fill="#E8642C" stroke="#F5EFE6" stroke-width="2"/><circle cx="18" cy="18" r="6" fill="#0D0B0A"/></svg>'
);

const BLUE_PIN = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44"><path d="M18 0C8 0 0 8 0 18c0 13.5 18 26 18 26s18-12.5 18-26C36 8 28 0 18 0z" fill="#3B82F6" stroke="#F5EFE6" stroke-width="2"/><circle cx="18" cy="18" r="6" fill="#0D0B0A"/></svg>'
);

function decodePolyline(encoded) {
  const points = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

export default function RouteMapPlaceholder({ activeOrder }) {
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);

  const [restaurant, setRestaurant] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [routePath, setRoutePath] = useState(null);
  const [distance, setDistance] = useState(null);
  const [eta, setEta] = useState(null);
  const [openInfo, setOpenInfo] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [routeError, setRouteError] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: MAPS_API_KEY,
  });

  const toLatLng = (location) => {
    if (!location) return null;
    if (typeof location.latitude === 'number' && typeof location.longitude === 'number') {
      return { lat: location.latitude, lng: location.longitude };
    }
    return null;
  };

  const geocodeAddress = useCallback((address) => {
    return new Promise((resolve) => {
      if (!geocoderRef.current) {
        resolve(null);
        return;
      }
      geocoderRef.current.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const { lat, lng } = results[0].geometry.location;
          resolve({ lat: lat(), lng: lng() });
        } else {
          resolve(null);
        }
      });
    });
  }, []);

  // Resolve locations + compute real driving route
  useEffect(() => {
    if (!isLoaded || !activeOrder) return;
    setRouteError(null);
    setMapError(null);

    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }

    (async () => {
      const restLocation = activeOrder.restaurantLocation || null;
      const restCoords = toLatLng(restLocation) || (await geocodeAddress(restLocation?.address));
      setRestaurant(restCoords ? { ...restCoords, label: 'Restaurant', address: restLocation?.address || 'CULT Central Kitchen' } : null);

      const customerCoords = await geocodeAddress(activeOrder.address && activeOrder.address !== 'N/A' ? activeOrder.address : null);
      setCustomer(customerCoords ? { ...customerCoords, label: 'Customer', address: activeOrder.address || 'Customer Address' } : null);

      if (!restCoords || !customerCoords) {
        setRouteError('Location data unavailable');
        return;
      }

      setRouteLoading(true);
      try {
        const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': MAPS_API_KEY,
            'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline',
          },
          body: JSON.stringify({
            origin: { location: { latLng: { latitude: restCoords.lat, longitude: restCoords.lng } } },
            destination: { location: { latLng: { latitude: customerCoords.lat, longitude: customerCoords.lng } } },
            travelMode: 'DRIVE',
          }),
        });

        const data = await res.json();
        const route = data?.routes?.[0];
        if (!route || !route.polyline?.encodedPolyline) {
          setRouteError('Route unavailable');
          return;
        }

        setRoutePath(decodePolyline(route.polyline.encodedPolyline));
        setDistance(route.distanceMeters ? route.distanceMeters / 1000 : null);
        setEta(route.duration ? Math.round(parseInt(route.duration, 10) / 60) : null);
      } catch {
        setRouteError('Route unavailable');
      } finally {
        setRouteLoading(false);
      }
    })();
  }, [isLoaded, activeOrder, geocodeAddress]);

  const fitMap = useCallback(() => {
    const map = mapRef.current;
    if (!map || !window.google?.maps) return;

    const bounds = new window.google.maps.LatLngBounds();
    if (restaurant) bounds.extend(restaurant);
    if (customer) bounds.extend(customer);
    if (routePath && routePath.length > 0) routePath.forEach((p) => bounds.extend(p));

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, 60);
    } else {
      map.setCenter({ lat: 20.5937, lng: 78.9629 });
      map.setZoom(5);
    }
  }, [restaurant, customer, routePath]);

  // Empty state
  if (!activeOrder) {
    return (
      <div className="bg-cult-espresso border border-cult-bronze p-16 text-center space-y-3">
        <Compass className="w-12 h-12 text-cult-warmgray/40 mx-auto" />
        <p className="font-heading text-lg text-cult-cream">No active delivery selected</p>
        <p className="text-xs font-body text-cult-warmgray">Accept an assigned order to view route details and ETA.</p>
      </div>
    );
  }

  // Map script states
  if (loadError || (!isLoaded && !MAPS_API_KEY)) {
    return (
      <div className="bg-cult-espresso border border-cult-bronze p-16 text-center space-y-3">
        <MapPin className="w-12 h-12 text-cult-warmgray/40 mx-auto" />
        <p className="font-heading text-lg text-cult-cream">Unable to load live map.</p>
        <p className="text-xs font-body text-cult-warmgray">
          {MAPS_API_KEY ? 'Google Maps failed to load. Please try again later.' : 'A Google Maps API key is not configured yet.'}
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-cult-espresso border border-cult-bronze p-16 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-cult-ember border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-cult-warmgray uppercase tracking-widest">Loading live map...</p>
      </div>
    );
  }

  return (
    <div className="bg-cult-espresso border border-cult-bronze p-6 space-y-6">
      {/* Route Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pickup Location */}
        <div className="p-4 bg-cult-charcoal border border-cult-bronze space-y-1">
          <div className="flex items-center gap-2 text-cult-ember font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Pickup: Restaurant</span>
          </div>
          <p className="text-xs font-body text-cult-cream">
            {activeOrder.restaurantLocation?.address || 'CULT Central Kitchen'}
          </p>
        </div>

        {/* Dropoff Location */}
        <div className="p-4 bg-cult-charcoal border border-cult-bronze space-y-1">
          <div className="flex items-center gap-2 text-cult-gold font-bold text-xs uppercase tracking-wider">
            <Navigation className="w-4 h-4" />
            <span>Dropoff: Customer</span>
          </div>
          <p className="text-xs font-body text-cult-cream">{activeOrder.address}</p>
        </div>
      </div>

      {/* Distance & ETA Highlights (real values from the routing API) */}
      <div className="flex items-center justify-between p-4 bg-cult-charcoal border border-cult-bronze/70 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-cult-warmgray uppercase text-[10px] tracking-wider">Distance:</span>
          <span className="font-mono font-bold text-cult-cream">
            {typeof distance === 'number' ? `${distance.toFixed(1)} km` : 'Distance unavailable'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cult-ember" />
          <span className="text-cult-warmgray uppercase text-[10px] tracking-wider">Estimated ETA:</span>
          <span className="font-mono font-bold text-cult-ember text-sm">
            {typeof eta === 'number' ? `${eta} mins` : 'ETA unavailable'}
          </span>
        </div>
      </div>

      {/* Live Google Map */}
      <div className="relative bg-cult-charcoal border border-cult-bronze overflow-hidden">
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          options={{
            mapTypeId: 'roadmap',
            fullscreenControl: true,
            zoomControl: true,
            streetViewControl: false,
          }}
          onLoad={(map) => {
            mapRef.current = map;
            fitMap();
          }}
        >
          {restaurant && (
            <Marker
              position={restaurant}
              icon={ORANGE_PIN}
              title={restaurant.label}
              onClick={() => setOpenInfo(restaurant)}
            />
          )}
          {customer && (
            <Marker
              position={customer}
              icon={BLUE_PIN}
              title={customer.label}
              onClick={() => setOpenInfo(customer)}
            />
          )}
          {routePath && routePath.length > 1 && (
            <Polyline
              path={routePath}
              options={{
                strokeColor: '#E8642C',
                strokeOpacity: 0.9,
                strokeWeight: 4,
              }}
            />
          )}
          {openInfo && (
            <InfoWindow position={openInfo} onCloseClick={() => setOpenInfo(null)}>
              <div className="bg-cult-espresso text-cult-cream text-xs font-mono p-2">
                <span className="font-bold uppercase">{openInfo.label}</span>
                <div className="text-cult-warmgray">{openInfo.address}</div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Route loading / error overlays */}
        {routeLoading && (
          <div className="absolute top-3 left-3 z-10 bg-cult-espresso/95 border border-cult-bronze px-3 py-1.5 text-[10px] font-mono text-cult-warmgray">
            Calculating live route...
          </div>
        )}
        {routeError && (
          <div className="absolute bottom-3 right-3 z-10 bg-cult-espresso/95 border border-cult-bronze px-3 py-1.5 text-[10px] font-mono text-cult-ember">
            {routeError}
          </div>
        )}

        {/* Map Label Overlay */}
        <div className="absolute bottom-3 left-3 bg-cult-espresso/90 border border-cult-bronze px-3 py-1 text-[10px] font-mono text-cult-warmgray z-10">
          Live Google Maps — Driving Route
        </div>
      </div>
    </div>
  );
}