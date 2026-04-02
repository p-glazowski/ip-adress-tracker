import { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from 'react-leaflet';
import FlyToLocation from './hooks/FlyToLocation';

interface IpInfoProps {
  query: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
}

export default function App() {
  const [ip, setIp] = useState<string>('192.212.174.101');
  const [loading, setLoading] = useState(false);
  const [ipInfo, setIpInfo] = useState<IpInfoProps | null>(null);
  const position: [number, number] | null = ipInfo
    ? [ipInfo?.lat, ipInfo?.lon]
    : null;
  const mapRef = useRef<HTMLDivElement>(null);

  function getUtcOffset(timezone: string): string {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'shortOffset', // gives "GMT-7", "GMT+5:30" etc
    });
    const parts = formatter.formatToParts(date);
    const offset = parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
    return offset.replace('GMT', 'UTC'); // "GMT-7" → "UTC-7"
  }

  async function getData() {
    try {
      setLoading(true);
      const res = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await res.json();
      setIpInfo(data);
      if (ip !== '192.212.174.101') {
        mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      console.error(err);
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
        <div
          ref={mapRef}
          className="absolute top-40 left-5 right-5 min-h-60 rounded-md shadow-xs shadow-black bg-white p-5 flex flex-col gap-6 z-50 lg:flex-row lg:items-center lg:justify-center lg:min-h-40 lg:gap-10"
        >
          {!loading ? (
            <>
              <div className="lg:border-r-2 lg:pr-10 border-gray-400/30">
                <h2 className="font-bold text-gray-400 uppercase text-[0.65rem]">
                  ip address
                </h2>
                <p className="font-bold text-xl">{ipInfo?.query}</p>
              </div>
              <div className="lg:border-r-2 lg:pr-10 border-gray-400/30">
                <h2 className="font-bold text-gray-400 uppercase text-[0.65rem]">
                  location
                </h2>
                <p className="font-bold text-xl">
                  {ipInfo?.city}, {ipInfo?.country}
                </p>
              </div>
              <div className="lg:border-r-2 lg:pr-10 border-gray-400/30">
                <h2 className="font-bold text-gray-400 uppercase text-[0.65rem]">
                  timezone
                </h2>
                <p className="font-bold text-xl">
                  {!ipInfo ? 'Loading...' : getUtcOffset(ipInfo?.timezone)}
                </p>
              </div>
              <div>
                <h2 className="font-bold text-gray-400 uppercase text-[0.65rem]">
                  ISP
                </h2>
                <p className="font-bold text-xl">{ipInfo?.isp}</p>
              </div>
            </>
          ) : (
            <div className="text-xl font-bold">Loading...</div>
          )}
        </div>
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
          <p className="text-white mt-1.5 text-sm">
            If you click search with empty input, you will get your IP
          </p>
        </label>
      </header>
      <main className="flex-1 z-10">
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
                  {ipInfo?.city} <br /> {ipInfo?.country}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
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
