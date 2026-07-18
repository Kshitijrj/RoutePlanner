import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock3,
  Truck,
  Moon,
  Briefcase,
} from "lucide-react";

import type { ELDDayLog } from "../types/trip";

interface Props {
  logs: Record<string, ELDDayLog>;
}

function Progress({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span>{label}</span>
        <span className="font-semibold">
          {value.toFixed(1)} hrs
        </span>
      </div>

      <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
        <div
          className={`${color} h-full transition-all duration-700`}
          style={{
            width: `${Math.min((value / max) * 100, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

function badge(status: string) {
  const s = status.toLowerCase();

  if (s.includes("drive"))
    return "bg-blue-100 text-blue-700";

  if (s.includes("off"))
    return "bg-indigo-100 text-indigo-700";

  if (s.includes("on"))
    return "bg-green-100 text-green-700";

  return "bg-slate-100 text-slate-700";
}

function icon(status: string) {
  const s = status.toLowerCase();

  if (s.includes("drive"))
    return <Truck className="text-blue-600" size={20} />;

  if (s.includes("off"))
    return <Moon className="text-indigo-600" size={20} />;

  return <Briefcase className="text-green-600" size={20} />;
}
function formatTime(time: string) {
  if (!time) return "--";

  // Handle end-of-day specially
  if (time === "24:00") {
    return "12:00 AM";
  }

  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return time;
  }

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
}

export default function ELDLogs({ logs }: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <div className="bg-white rounded-2xl shadow-lg">

      <div className="px-6 py-5 border-b">

        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Clock3 className="text-blue-600" />
          Electronic Driver Logs
        </h2>

        <p className="text-gray-500 mt-2">
          Daily HOS summary and duty status.
        </p>

      </div>

      <div className="p-6 space-y-6">

        {Object.entries(logs).map(([day, log]) => {

          const expanded = open[day] ?? true;

          return (
            <div
              key={day}
              className="border rounded-xl overflow-hidden"
            >
              {/* Header */}

              <button
                onClick={() =>
                  setOpen({
                    ...open,
                    [day]: !expanded,
                  })
                }
                className="w-full flex justify-between items-center bg-slate-50 px-6 py-5 hover:bg-slate-100"
              >
                <div>

                  <h3 className="text-lg font-bold">
                    {day}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {log.events.length} log entries
                  </p>

                </div>

                {expanded ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </button>

              {expanded && (
                <div className="p-6">

                  {/* Progress */}

                  <div className="grid md:grid-cols-3 gap-6">

                    <Progress
                      label="Driving"
                      value={log.driving_hours}
                      max={11}
                      color="bg-blue-600"
                    />

                    <Progress
                      label="On Duty"
                      value={log.on_duty_hours}
                      max={14}
                      color="bg-green-600"
                    />

                    <Progress
                      label="Off Duty"
                      value={log.off_duty_hours}
                      max={24}
                      color="bg-indigo-600"
                    />

                  </div>

                  {/* Events */}

                  <div className="mt-8 space-y-4">

                    {log.events.map((event, i) => (
                      <div
                        key={i}
                        className="rounded-xl border bg-white hover:shadow-md transition p-5"
                      >
                        <div className="flex justify-between items-start flex-wrap gap-3">

                          <div className="flex gap-4">

                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                              {icon(event.status)}
                            </div>

                            <div>

                              <h4 className="font-semibold text-lg">
                                {event.status}
                              </h4>

                              <p className="text-gray-500 mt-1">
                                {event.description}
                              </p>

                            </div>

                          </div>

                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${badge(
                              event.status
                            )}`}
                          >
                            {event.status}
                          </span>

                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-6">

                          <div>

                            <p className="text-gray-400 text-sm">
                              Start
                            </p>

                            <p className="font-semibold">
                              {formatTime(event.start)}
                            </p>

                          </div>

                          <div>

                            <p className="text-gray-400 text-sm">
                              End
                            </p>

                            <p className="font-semibold">
                              {formatTime(event.end)}
                            </p>

                          </div>

                        </div>

                      </div>
                    ))}

                  </div>

                </div>
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
}