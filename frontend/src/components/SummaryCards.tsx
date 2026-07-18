import {
  MapPin,
  Clock3,
  TimerReset,
  Truck,
} from "lucide-react";

import type { TripResponse } from "../types/trip";

interface Props {
  trip: TripResponse;
}

function Card({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-slate-200">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            {subtitle}
          </p>

        </div>

        <div
          className={`h-14 w-14 rounded-xl flex items-center justify-center ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

export default function SummaryCards({ trip }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      <Card
        title="Distance"
        value={`${trip.trip.distance_km.toFixed(1)} km`}
        subtitle="Total route distance"
        color="bg-blue-100"
        icon={<MapPin size={30} className="text-blue-700" />}
      />

      <Card
        title="Driving Time"
        value={`${trip.trip.duration_hours.toFixed(1)} hrs`}
        subtitle="Estimated duration"
        color="bg-green-100"
        icon={<Clock3 size={30} className="text-green-700" />}
      />

      <Card
        title="Cycle Used"
        value={`${trip.trip.current_cycle_used.toFixed(1)} hrs`}
        subtitle="Hours already consumed"
        color="bg-orange-100"
        icon={<Truck size={30} className="text-orange-700" />}
      />

      <Card
        title="Remaining Cycle"
        value={`${trip.trip.remaining_cycle_hours.toFixed(1)} hrs`}
        subtitle="Hours remaining"
        color="bg-purple-100"
        icon={<TimerReset size={30} className="text-purple-700" />}
      />

    </div>
  );
}