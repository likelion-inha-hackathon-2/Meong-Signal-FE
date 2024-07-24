export const getDistance = (coord1, coord2) => {
  const { latitude: lat1, longitude: lon1 } = coord1;
  const { latitude: lat2, longitude: lon2 } = coord2;

  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // 지구의 반지름 (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // 거리 (km)

  return d;
};
