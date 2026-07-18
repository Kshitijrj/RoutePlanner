from dataclasses import dataclass


@dataclass
class DriveEvent:

    hours: float
    distance: float

    stop_reason: str

    destination_hours: float
    break_hours: float
    fuel_hours: float
    driving_limit_hours: float
    duty_limit_hours: float