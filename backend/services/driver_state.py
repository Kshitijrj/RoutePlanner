from dataclasses import dataclass
from datetime import datetime


@dataclass
class DriverState:

    current_time: datetime

    cycle_hours_used: float

    driving_today: float = 0
    on_duty_today: float = 0

    fuel_since_stop: float = 0
    driving_since_break: float = 0
    break_taken: bool = False