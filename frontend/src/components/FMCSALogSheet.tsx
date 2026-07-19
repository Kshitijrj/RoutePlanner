import React from "react";
import type { ELDDayLog } from "../types/trip";

interface Props {
  date: string;
  log: ELDDayLog;
}
const STATUS_ROWS: Record<string, number> = {
  OFF_DUTY: 0,
  BREAK: 0,

  SLEEPER: 1,

  DRIVE: 2,

  PICKUP: 3,
  DROPOFF: 3,
  ON_DUTY: 3,
};

const ROW_NAMES = ["Off Duty", "Sleeper", "Driving", "On Duty"];

function hourValue(time: string): number {
  if (time === "24:00") return 24;

  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

export default function FMCSALogSheet({ date, log }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 overflow-auto">
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Driver Daily Log</h2>

          <p className="text-gray-500">{new Date(date).toDateString()}</p>
        </div>

        <div className="text-right text-sm">
          <p>
            Driving:
            <span className="font-semibold ml-2">
              {log.driving_hours.toFixed(1)} hrs
            </span>
          </p>

          <p>
            On Duty:
            <span className="font-semibold ml-2">
              {log.on_duty_hours.toFixed(1)} hrs
            </span>
          </p>

          <p>
            Off Duty:
            <span className="font-semibold ml-2">
              {log.off_duty_hours.toFixed(1)} hrs
            </span>
          </p>
        </div>
      </div>

      <div className="flex">
        {/* Status labels */}
        <div className="w-28">
          <div className="h-10" />

          {ROW_NAMES.map((row) => (
            <div
              key={row}
              className="h-16 flex items-center font-medium border-b"
            >
              {row}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 relative">
          {/* Hour labels */}
          <div className="grid grid-cols-24 h-10">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="relative text-xs text-center border-l border-black"
              >
                {i}

                <div className="absolute top-0 left-1/4 h-full border-l border-gray-300" />
                <div className="absolute top-0 left-2/4 h-full border-l border-gray-300" />
                <div className="absolute top-0 left-3/4 h-full border-l border-gray-300" />
              </div>
            ))}
          </div>

          {/* Rows */}
          {ROW_NAMES.map((row, idx) => (
            <div key={row} className="grid grid-cols-24 h-16 border-t">
              {Array.from({ length: 24 }).map((_, j) => (
                <div key={j} className="relative border-l border-black">
                  <div className="absolute left-1/4 top-0 h-full border-l border-gray-300" />
                  <div className="absolute left-2/4 top-0 h-full border-l border-gray-300" />
                  <div className="absolute left-3/4 top-0 h-full border-l border-gray-300" />
                </div>
              ))}
            </div>
          ))}

          {/* Events */}
          <div className="absolute inset-0 mt-10">
            {log.events.map((event, index) => {
              const row = STATUS_ROWS[event.status] ?? 0;

              const start = hourValue(event.start);
              const end = hourValue(event.end);

              const left = `${(start / 24) * 100}%`;
              const width = `${((end - start) / 24) * 100}%`;

              return (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    left,
                    width,
                    top: row * 64 + 24,
                  }}
                >
                  <div
                    className={`
                    h-8 rounded-full border
                    ${
                      event.status === "DRIVE"
                        ? "bg-green-500"
                        : event.status === "PICKUP" ||
                            event.status === "DROPOFF" ||
                            event.status === "ON_DUTY"
                          ? "bg-yellow-400"
                          : event.status === "SLEEPER"
                            ? "bg-purple-500"
                            : "bg-gray-500"
                    }
                    `}
                  />

                  <div className="text-[10px] text-center mt-1 font-medium">
                    {event.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Table */}

      <div className="mt-8">
        <h3 className="font-semibold mb-3">Activity Details</h3>

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Status</th>
              <th className="border p-2">Start</th>
              <th className="border p-2">End</th>
              <th className="border p-2">Description</th>
            </tr>
          </thead>

          <tbody>
            {log.events.map((event, idx) => (
              <tr key={idx}>
                <td className="border p-2">{event.status}</td>

                <td className="border p-2">{event.start}</td>

                <td className="border p-2">{event.end}</td>

                <td className="border p-2">{event.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
