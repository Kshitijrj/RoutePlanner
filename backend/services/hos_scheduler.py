from datetime import datetime, timedelta

from collections import defaultdict

from trip.constants import *
from .driver_state import DriverState
from .trip_segment import TripSegment
from .events import DriveEvent


class HOSScheduler:

    def __init__(
        self,
        current_to_pickup_km,
        pickup_to_dropoff_km,
        current_cycle_used,
        start_time=None,
    ):
        self.state = DriverState(
            current_time=start_time or datetime.now(),
            cycle_hours_used=current_cycle_used,
        )

        self.timeline = []

        self.segments = [
            TripSegment(
                "Drive to Pickup",
                current_to_pickup_km,
                PICKUP,
            ),
            TripSegment(
                "Drive to Dropoff",
                pickup_to_dropoff_km,
                DROPOFF,
            ),
        ]

    def add_timeline_event(
        self,
        event_type,
        duration,
        description,
    ):
        start = self.state.current_time
        end = start + timedelta(hours=duration)

        self.timeline.append(
            {
                "event_type": event_type,
                "start": start.isoformat(),
                "end": end.isoformat(),
                "duration_hours": round(duration, 2),
                "description": description,
            }
        )

        self.state.current_time = end

    def take_break(self):
        # Reset break counter
        self.state.driving_since_break = 0
        self.state.on_duty_today += BREAK_DURATION

        self.add_timeline_event(
            BREAK,
            BREAK_DURATION,
            "30-minute mandatory break",
        )

    def take_fuel_stop(self):
        self.state.fuel_since_stop = 0
        self.state.on_duty_today += FUEL_STOP_DURATION

        self.add_timeline_event(
            FUEL,
            FUEL_STOP_DURATION,
            "Fuel stop",
        )

    def take_daily_reset(self):
        """
        10-hour off-duty reset.
        Resets daily driving/on-duty limits only.
        """
        self.state.driving_since_break = 0
        self.state.driving_today = 0
        self.state.on_duty_today = 0

        self.add_timeline_event(
            OFF_DUTY,
            10,
            "10-hour off-duty reset",
        )

    def take_cycle_reset(self):
        """
        34-hour cycle restart.
        Resets the 70-hour cycle.
        """
        self.state.driving_since_break = 0
        self.state.driving_today = 0
        self.state.on_duty_today = 0
        self.state.cycle_hours_used = 0

        self.add_timeline_event(
            OFF_DUTY,
            34,
            "34-hour cycle restart",
        )

    def arrive(self, segment):
        if segment.arrival_event == PICKUP:
            self.state.on_duty_today += PICKUP_DURATION

            self.add_timeline_event(
                PICKUP,
                PICKUP_DURATION,
                "Pickup cargo",
            )
        else:
            self.state.on_duty_today += DROPOFF_DURATION

            self.add_timeline_event(
                DROPOFF,
                DROPOFF_DURATION,
                "Dropoff cargo",
            )

    def find_next_event(self, segment):
        state = self.state

        destination_hours = segment.distance_remaining / AVERAGE_SPEED_KMPH

        break_hours = max(
            0,
            BREAK_AFTER_HOURS - state.driving_since_break,
        )

        driving_hours = max(
            0,
            MAX_DRIVING_HOURS - state.driving_today,
        )

        duty_hours = max(
            0,
            MAX_ON_DUTY_HOURS - state.on_duty_today,
        )

        cycle_hours = max(
            0,
            MAX_CYCLE_HOURS - state.cycle_hours_used,
        )

        fuel_hours = max(
            0,
            (FUEL_STOP_DISTANCE_KM - state.fuel_since_stop)
            / AVERAGE_SPEED_KMPH,
        )

        # Smallest legal driving window
        drive_hours = min(
            destination_hours,
            break_hours,
            driving_hours,
            duty_hours,
            cycle_hours,
            fuel_hours,
        )

        if drive_hours < 1e-6:
            drive_hours = 0

        # Decide which event caused the stop
        EPS = 1e-6

        if abs(drive_hours - destination_hours) < EPS:
            reason = "ARRIVAL"
        elif abs(drive_hours - fuel_hours) < EPS:
            reason = "FUEL"
        elif abs(drive_hours - cycle_hours) < EPS:
            reason = "CYCLE_RESET"
        elif (
            abs(drive_hours - driving_hours) < EPS
            or abs(drive_hours - duty_hours) < EPS
        ):
            reason = "DAILY_RESET"
        elif abs(drive_hours - break_hours) < EPS:
            reason = "BREAK"
        else:
            reason = "ARRIVAL"

        return DriveEvent(
            hours=drive_hours,
            distance=drive_hours * AVERAGE_SPEED_KMPH,
            stop_reason=reason,
            destination_hours=destination_hours,
            break_hours=break_hours,
            fuel_hours=fuel_hours,
            driving_limit_hours=driving_hours,
            duty_limit_hours=duty_hours,
        )

    def execute(self, event, segment):
        state = self.state

        # -------------------------------
        # Drive
        # -------------------------------
        if event.hours > 0:
            state.driving_today += event.hours
            state.driving_since_break += event.hours
            state.on_duty_today += event.hours
            state.cycle_hours_used += event.hours

            state.fuel_since_stop += event.distance

            segment.distance_remaining -= event.distance

            # Prevent floating point leftovers
            if segment.distance_remaining < 0.001:
                segment.distance_remaining = 0

            self.add_timeline_event(
                DRIVE,
                event.hours,
                f"Drive {round(event.distance, 1)} km",
            )

        # -------------------------------
        # Execute Stop Event
        # -------------------------------
        if event.stop_reason == "ARRIVAL":
            return

        actions = {
            "BREAK": self.take_break,
            "FUEL": self.take_fuel_stop,
            "DAILY_RESET": self.take_daily_reset,
            "CYCLE_RESET": self.take_cycle_reset,
        }

        action = actions.get(event.stop_reason)
        if action:
            action()

    def generate(self):
        for segment in self.segments:
            while segment.distance_remaining > 0:
                # Safety against floating-point errors
                if segment.distance_remaining < 0.001:
                    segment.distance_remaining = 0
                    break

                # Fuel is already due before driving
                if self.state.fuel_since_stop >= FUEL_STOP_DISTANCE_KM:
                    self.take_fuel_stop()
                    continue

                event = self.find_next_event(segment)

                # Safety check
                if event.hours < 0:
                    raise RuntimeError("Negative drive hours generated.")

                # If we're already at the fuel limit,
                # don't try a 0-hour drive
                if event.stop_reason == "FUEL" and event.hours == 0:
                    self.take_fuel_stop()
                    continue

                # Break immediately if required
                if event.hours == 0:
                    if event.stop_reason == "BREAK":
                        self.take_break()
                    elif event.stop_reason == "FUEL":
                        self.take_fuel_stop()
                    elif event.stop_reason == "DAILY_RESET":
                        self.take_daily_reset()
                    elif event.stop_reason == "CYCLE_RESET":
                        self.take_cycle_reset()
                    continue

                # Reset immediately if required
                if event.stop_reason == "DAILY_RESET" and event.hours == 0:
                    self.take_daily_reset()
                    continue

                if event.stop_reason == "CYCLE_RESET" and event.hours == 0:
                    self.take_cycle_reset()
                    continue

                self.execute(event, segment)

            self.arrive(segment)

        eld_logs = self.generate_eld_logs()

        return {
            "timeline": self.timeline,
            "eld_logs": eld_logs,
        }

    def generate_eld_logs(self):
        logs = defaultdict(
            lambda: {
                "events": [],
                "driving_hours": 0,
                "on_duty_hours": 0,
                "off_duty_hours": 0,
            }
        )

        for event in self.timeline:
            current_start = datetime.fromisoformat(event["start"])
            final_end = datetime.fromisoformat(event["end"])

            while current_start < final_end:
                # Midnight of next day
                next_midnight = (
                    current_start.replace(
                        hour=0,
                        minute=0,
                        second=0,
                        microsecond=0,
                    )
                    + timedelta(days=1)
                )

                current_end = min(final_end, next_midnight)

                duration = (current_end - current_start).total_seconds() / 3600
                day = current_start.date().isoformat()

                # Display 24:00 instead of 00:00 when an event continues to the next day
                if (
                    current_end.hour == 0
                    and current_end.minute == 0
                    and current_end.date() != current_start.date()
                ):
                    end_time = "24:00"
                else:
                    end_time = current_end.strftime("%H:%M")

                logs[day]["events"].append(
                    {
                        "start": current_start.strftime("%H:%M"),
                        "end": end_time,
                        "status": event["event_type"],
                        "description": event["description"],
                    }
                )

                if event["event_type"] == DRIVE:
                   logs[day]["driving_hours"] += duration
                   logs[day]["on_duty_hours"] += duration
                elif event["event_type"] in (PICKUP, DROPOFF, FUEL):
                    logs[day]["on_duty_hours"] += duration
                elif event["event_type"] in (BREAK, OFF_DUTY):
                    logs[day]["off_duty_hours"] += duration

                current_start = current_end

        # Round values
        for day in logs.values():
            day["driving_hours"] = round(day["driving_hours"], 2)
            day["on_duty_hours"] = round(day["on_duty_hours"], 2)
            day["off_duty_hours"] = round(day["off_duty_hours"], 2)

        return dict(logs)

        