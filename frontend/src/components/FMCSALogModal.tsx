import { useMemo, useState, useEffect } from "react";
import FMCSALogSheet from "./FMCSALogSheet";
import type { ELDDayLog } from "../types/trip";

interface Props {
  open: boolean;
  onClose: () => void;
  logs: Record<string, ELDDayLog>;
}

export default function FMCSALogModal({
  open,
  onClose,
  logs,
}: Props) {
  const dates = useMemo(
    () => Object.keys(logs).sort(),
    [logs]
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setCurrentIndex(0);
    }
  }, [open]);

  if (!open) return null;

  const currentDate = dates[currentIndex];
  const currentLog = logs[currentDate];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <div>
            <h2 className="text-xl font-bold">
              FMCSA Daily Log Sheet
            </h2>

            <p className="text-sm text-gray-500">
              Day {currentIndex + 1} of {dates.length}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-auto p-6 max-h-[75vh]">
          <FMCSALogSheet
            date={currentDate}
            log={currentLog}
          />
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-between">

          <button
            disabled={currentIndex === 0}
            onClick={() =>
              setCurrentIndex((x) => x - 1)
            }
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-40"
          >
            ← Previous
          </button>

          <button
            disabled={currentIndex === dates.length - 1}
            onClick={() =>
              setCurrentIndex((x) => x + 1)
            }
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-40"
          >
            Next →
          </button>

        </div>
      </div>
    </div>
  );
}