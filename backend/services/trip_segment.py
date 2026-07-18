from dataclasses import dataclass


@dataclass
class TripSegment:

    name: str

    distance_remaining: float

    arrival_event: str