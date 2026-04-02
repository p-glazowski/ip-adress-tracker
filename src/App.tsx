import { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from 'react-leaflet';
import FlyToLocation from './hooks/FlyToLocation';
import InfoBox from './components/InfoBox';

export interface IpInfoProps {
  ip: string;
  isp: string;
  location: {
    city: string;
    region: string;
    country: string;
    lat: number;
    lng: number;
    timezone: string;
  };
}

export default function App() {
  const [ip, setIp] = useState<string>('192.212.174.101');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [ipInfo, setIpInfo] = useState<IpInfoProps | null>(null);
  const position: [number, number] | null = ipInfo
    ? [ipInfo?.location.lat, ipInfo?.location.lng]
    : null;
  const mapRef = useRef<HTMLDivElement>(null);

  async function getData() {
    try {
      setLoading(true);
      setError(false);
      const res = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${import.meta.env.VITE_IPIFY_API_KEY}&ipAddress=${ip}`,
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      if (data.code) throw new Error(data.messages);
      setIpInfo(data);
      if (ip !== '192.212.174.101') {
        mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      setError(true);
      console.error('This is error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-70 p-5 flex flex-col gap-5 text-center relative">
        {/* INFO BOX */}
        {!loading && !error && <InfoBox ipInfo={ipInfo} mapRef={mapRef} />}
        <h1 className="text-2xl text-white">IP Address Tracker</h1>
        <label htmlFor="ip">
          <div className="flex shadow shadow-black rounded-r-md max-w-200 mx-auto">
            <input
              className="p-4 bg-white w-full rounded-l-md"
              type="text"
              name="ip"
              id="ip"
              value={ip}
              onChange={(e) => {
                setIp(e.target.value);
              }}
              placeholder="24.48.0.1"
            />
            <button
              className="p-4 px-6 font-bold bg-black rounded-r-md text-white cursor-pointer"
              onClick={getData}
            >
              {'>'}
            </button>
          </div>
          <p className="text-white mt-1.5 text-xs">
            If you click search with empty input, you will get your IP
          </p>
        </label>
      </header>

      <main className="flex-1 z-10 bg-white">
        {error && (
          <p className="text-center pt-10 lg:pt-20">
            Cannot fetch data try again later! :(
          </p>
        )}
        {!error && (
          <div className="h-150">
            <MapContainer
              center={position ? position : [20, 0]}
              zoom={13}
              zoomControl={false}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ZoomControl position="bottomright" />
              {position && <FlyToLocation position={position} />}
              {position && (
                <Marker position={position}>
                  <Popup>
                    {ipInfo?.location.city} <br /> {ipInfo?.location.country}
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        )}
      </main>

      <footer className="justify-center p-2 text-white flex gap-1">
        <a
          href="https://www.github.com/p-glazowski"
          target="_blank"
          className="underline"
        >
          Piotr Głazowski
        </a>
        <span>&copy;</span>
      </footer>
    </div>
  );
}
