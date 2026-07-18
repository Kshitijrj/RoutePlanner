import {
  Coffee,
  Fuel,
  Moon,
  Truck,
  Package,
  Flag,
} from "lucide-react";

import type { TimelineEvent } from "../types/trip";

interface Props {
  timeline: TimelineEvent[];
}

function getIcon(type: string) {
  const event = type.toLowerCase();

  if (event.includes("drive"))
    return <Truck className="text-blue-600" size={22} />;

  if (event.includes("pickup"))
    return <Package className="text-green-600" size={22} />;

  if (event.includes("drop"))
    return <Flag className="text-red-600" size={22} />;

  if (event.includes("break"))
    return <Coffee className="text-orange-500" size={22} />;

  if (event.includes("fuel"))
    return <Fuel className="text-yellow-500" size={22} />;

  if (event.includes("off"))
    return <Moon className="text-indigo-600" size={22} />;

  return <Truck className="text-gray-600" size={22} />;
}

function getBadge(type: string) {
  const event = type.toLowerCase();

  if (event.includes("drive"))
    return "bg-blue-100 text-blue-700";

  if (event.includes("pickup"))
    return "bg-green-100 text-green-700";

  if (event.includes("drop"))
    return "bg-red-100 text-red-700";

  if (event.includes("break"))
    return "bg-orange-100 text-orange-700";

  if (event.includes("fuel"))
    return "bg-yellow-100 text-yellow-700";

  if (event.includes("off"))
    return "bg-indigo-100 text-indigo-700";

  return "bg-gray-100 text-gray-700";
}

function format(date: string) {
  return new Date(date).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Timeline({ timeline }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg">

      <div className="border-b px-6 py-5">
        <h2 className="text-2xl font-bold">
          📍 Trip Timeline
        </h2>

        <p className="text-gray-500 mt-1">
          Driver activity throughout the trip
        </p>
      </div>

      <div className="p-8">

        {timeline.map((event, index) => (
          <div
            key={index}
            className="flex gap-6 group"
          >
            {/* Timeline */}

            <div className="flex flex-col items-center">

              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shadow">
                {getIcon(event.event_type)}
              </div>

              {index !== timeline.length - 1 && (
                <div className="w-1 flex-1 bg-slate-200 mt-2 mb-2" />
              )}
            </div>

            {/* Card */}

            <div className="flex-1 pb-10">

              <div className="bg-slate-50 rounded-xl p-5 border hover:shadow-lg transition">

                <div className="flex flex-wrap justify-between gap-3">

                  <div>

                    <h3 className="font-bold text-lg">
                      {event.event_type}
                    </h3>

                    <p className="text-gray-500 mt-2">
                      {event.description}
                    </p>

                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getBadge(
                      event.event_type
                    )}`}
                  >
                    {event.duration_hours.toFixed(1)} hrs
                  </span>

                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">

                  <div>
                    <p className="text-gray-400 text-sm">
                      Start
                    </p>

                    <p className="font-semibold">
                      {format(event.start)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">
                      End
                    </p>

                    <p className="font-semibold">
                      {format(event.end)}
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}