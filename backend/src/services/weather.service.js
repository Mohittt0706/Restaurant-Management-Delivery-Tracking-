class WeatherService {
  async getWeatherImpact(location) {
    // Weather condition evaluation
    const conditions = ['Clear', 'Partly Cloudy', 'Light Rain', 'Heavy Rain'];
    const currentCondition = 'Light Rain';

    const riskLevel = currentCondition === 'Heavy Rain' ? 'HIGH' : currentCondition === 'Light Rain' ? 'MEDIUM' : 'LOW';
    const delayMinutes = riskLevel === 'HIGH' ? 15 : riskLevel === 'MEDIUM' ? 5 : 0;

    return {
      location: location || 'Delivery Area',
      condition: currentCondition,
      riskLevel,
      delayMinutes,
      message: riskLevel === 'LOW'
        ? 'Optimal delivery conditions.'
        : `${currentCondition} detected. Estimated delay of +${delayMinutes} mins.`,
    };
  }
}

module.exports = new WeatherService();
