import { useState } from "react";
import { MapPin, Navigation, Flag, RotateCw } from "lucide-react";
import { planTrip } from "../api/tripApi";
import type { TripResponse } from "../types/trip";

interface Props {
  setTrip: (trip: TripResponse) => void;
}

export default function TripForm({ setTrip }: Props) {
  const [current, setCurrent] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [cycleUsed, setCycleUsed] = useState(0);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!current || !pickup || !dropoff) {
      alert("Please fill all locations.");
      return;
    }

    try {
      setLoading(true);

      const response = await planTrip({
        current_location: current,
        pickup_location: pickup,
        dropoff_location: dropoff,
        current_cycle_used: cycleUsed,
      });

      setTrip(response);
    } catch (err: any) {
  console.error(err);

  if (err.response) {
    console.log("Status:", err.response.status);
    console.log("Response:", err.response.data);

    alert(
      err.response.data.error ||
      err.response.data.message ||
      JSON.stringify(err.response.data)
    );
  } else {
    alert(err.message);
  }
} finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid lg:grid-cols-2 gap-8"
    >
      {/* Left */}

      <div className="space-y-6">

        <InputField
          icon={<Navigation className="text-blue-600" />}
          label="Current Location"
          placeholder="Chicago, IL"
          value={current}
          setValue={setCurrent}
        />

        <InputField
          icon={<MapPin className="text-green-600" />}
          label="Pickup Location"
          placeholder="Dallas, TX"
          value={pickup}
          setValue={setPickup}
        />

        <InputField
          icon={<Flag className="text-red-600" />}
          label="Dropoff Location"
          placeholder="Los Angeles, CA"
          value={dropoff}
          setValue={setDropoff}
        />

      </div>

      {/* Right */}

      <div className="flex flex-col justify-between">

        <div>

          <label className="font-semibold text-slate-700">
            Current Cycle Used (hrs)
          </label>

          <input
            type="number"
            min={0}
            max={70}
            step={0.5}
            value={cycleUsed}
            onChange={(e) => setCycleUsed(Number(e.target.value))}
            className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <div className="mt-4">

            <div className="flex justify-between text-sm text-gray-500">
              <span>0 hrs</span>
              <span>70 hrs</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{
                  width: `${Math.min((cycleUsed / 70) * 100, 100)}%`,
                }}
              />
            </div>

          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl py-4 transition-all duration-300 flex justify-center items-center gap-3 disabled:opacity-70"
        >
          {loading && (
            <RotateCw className="animate-spin" size={20} />
          )}

          {loading ? "Planning Route..." : "Plan Trip"}
        </button>

      </div>
    </form>
  );
}

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  setValue: (v: string) => void;
  icon: React.ReactNode;
}

function InputField({
  label,
  placeholder,
  value,
  setValue,
  icon,
}: InputProps) {
  return (
    <div>

      <label className="font-semibold text-slate-700">
        {label}
      </label>

      <div className="mt-2 flex items-center border border-slate-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 bg-white">

        <div className="mr-3">
          {icon}
        </div>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 outline-none"
        />

      </div>

    </div>
  );
}