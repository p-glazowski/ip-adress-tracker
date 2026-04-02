import type { IpInfoProps } from '../App';
import { type RefObject } from 'react';

interface InfoBoxProps {
  mapRef: RefObject<HTMLDivElement | null>;
  ipInfo: IpInfoProps | null;
}

export default function InfoBox({ mapRef, ipInfo }: InfoBoxProps) {
  return (
    <div
      ref={mapRef}
      className="absolute top-40 left-5 right-5 min-h-60 rounded-md shadow-xs shadow-black bg-white p-5 flex flex-col gap-6 z-50 lg:flex-row lg:items-center lg:justify-center lg:min-h-40 lg:gap-10"
    >
      <div className="lg:border-r-2 lg:pr-10 border-gray-400/30">
        <h2 className="font-bold text-gray-400 uppercase text-[0.65rem]">
          ip address
        </h2>
        <p className="font-bold text-xl">{ipInfo?.ip}</p>
      </div>
      <div className="lg:border-r-2 lg:pr-10 border-gray-400/30">
        <h2 className="font-bold text-gray-400 uppercase text-[0.65rem]">
          location
        </h2>
        <p className="font-bold text-xl">
          {ipInfo?.location.city}, {ipInfo?.location.country}
        </p>
      </div>
      <div className="lg:border-r-2 lg:pr-10 border-gray-400/30">
        <h2 className="font-bold text-gray-400 uppercase text-[0.65rem]">
          timezone
        </h2>
        <p className="font-bold text-xl">
          {!ipInfo ? 'Loading...' : ipInfo.location.timezone}
        </p>
      </div>
      <div>
        <h2 className="font-bold text-gray-400 uppercase text-[0.65rem]">
          ISP
        </h2>
        <p className="font-bold text-xl">
          {ipInfo?.isp === '' ? 'Unknown' : ipInfo?.isp}
        </p>
      </div>
    </div>
  );
}
