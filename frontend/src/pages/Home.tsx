import { useState } from "react";

import TripForm from "../components/TripForm";
import SummaryCards from "../components/SummaryCards";
import MapView from "../components/MapView";
import Timeline from "../components/Timeline";
import ELDLogs from "../components/ELDLogs";
import FMCSALogModal from "../components/FMCSALogModal";
import type { TripResponse } from "../types/trip";

export default function Home() {
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [showFMCSA, setShowFMCSA] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />

        <div className="absolute top-72 -right-28 h-[450px] w-[450px] rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl animate-pulse" />

        <div className="absolute inset-0 bg-[radial-gradient(circle,#cbd5e140_1px,transparent_1px)] [background-size:30px_30px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}

        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 shadow-xl">
          <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-5xl font-extrabold text-white tracking-tight">
                🚛 Driver Trip Planner
              </h1>

              <p className="mt-3 text-blue-100 text-lg">
                Route Planning • HOS Scheduler • Electronic Driver Logs
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20">
              <p className="text-white text-sm">Fleet Dashboard</p>

              <h2 className="text-white text-2xl font-bold">Smart Routing</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Planner */}

        <div className="rounded-3xl bg-white/75 backdrop-blur-xl border border-white/50 shadow-2xl">
          <div className="px-8 pt-8">
            <h2 className="text-3xl font-bold text-slate-800">Plan New Trip</h2>

            <p className="text-slate-500 mt-2">
              Enter locations, remaining cycle hours and generate a compliant
              HOS trip schedule.
            </p>
          </div>

          <div className="p-8">
            <TripForm setTrip={setTrip} />
          </div>
        </div>

        {trip && (
          <>
            {/* Cards */}

            <SummaryCards trip={trip} />

            {/* Map */}

            <div className="rounded-3xl overflow-hidden bg-white/75 backdrop-blur-xl border border-white/50 shadow-2xl">
              <div className="flex justify-between items-center px-8 py-6 border-b border-slate-200">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">
                    🗺 Route Overview
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Interactive route visualization
                  </p>
                </div>
              </div>

              <MapView trip={trip} />
            </div>

            {/* Timeline */}

            <Timeline timeline={trip.timeline.timeline} />

            {/* Logs */}

            <ELDLogs
              logs={trip.timeline.eld_logs}
              onOpenFMCSA={() => setShowFMCSA(true)}
            />

            <FMCSALogModal
              open={showFMCSA}
              onClose={() => setShowFMCSA(false)}
              logs={trip.timeline.eld_logs}
            />
          </>
        )}
      </div>
    </div>
  );
}
