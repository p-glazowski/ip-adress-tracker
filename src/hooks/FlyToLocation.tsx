import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

export default function FlyToLocation({
  position,
}: {
  position: [number, number];
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 13, { duration: 1.5 });
  }, [position]);
  return null;
}
