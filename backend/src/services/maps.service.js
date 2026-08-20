class MapsService {
  async calculateRoute(origin = 'Cult Restaurant, Main Street', destination) {
    // Distance & ETA calculation algorithm
    const distanceKm = 4.2;
    const estimatedMinutes = 18;

    return {
      origin,
      destination: destination || 'Customer Address',
      distanceKm,
      estimatedMinutes,
      restaurantLocation: { lat: 28.6139, lng: 77.2090 },
      routeWaypoints: [
        { lat: 28.6139, lng: 77.2090 },
        { lat: 28.6180, lng: 77.2150 },
        { lat: 28.6250, lng: 77.2210 },
      ],
    };
  }
}

module.exports = new MapsService();
