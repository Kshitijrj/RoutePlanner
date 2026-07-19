from datetime import datetime

from routing.ors_service import ORSService
from services.hos_scheduler import HOSScheduler


class TripService:

    @staticmethod
    def plan_trip(data):

        # Full route (used for map)
        full_route = ORSService.get_route(
            data["current_location"],
            data["pickup_location"],
            data["dropoff_location"],
        )

        # Current -> Pickup
        pickup_route = ORSService.get_route(
            data["current_location"],
            data["pickup_location"],
        )

        # Pickup -> Dropoff
        delivery_route = ORSService.get_route(
            data["pickup_location"],
            data["dropoff_location"],
        )

        full_feature = full_route["features"][0]
        pickup_feature = pickup_route["features"][0]
        delivery_feature = delivery_route["features"][0]

        full_summary = full_feature["properties"]["summary"]
        pickup_summary = pickup_feature["properties"]["summary"]
        delivery_summary = delivery_feature["properties"]["summary"]

        total_distance_km = round(full_summary["distance"] / 1000, 2)
        duration_hours = round(full_summary["duration"] / 3600, 2)

        current_to_pickup_km = round(
            pickup_summary["distance"] / 1000,
            2,
        )

        pickup_to_dropoff_km = round(
            delivery_summary["distance"] / 1000,
            2,
        )

        cycle_used = data["current_cycle_used"]
        remaining_cycle_hours = 70 - cycle_used

        scheduler = HOSScheduler(
            current_to_pickup_km=current_to_pickup_km,
            pickup_to_dropoff_km=pickup_to_dropoff_km,
            current_cycle_used=cycle_used,
            start_time=datetime(2026, 7, 18, 8, 0),
        )

        timeline = scheduler.generate()
        pickup_coords = pickup_feature["geometry"]["coordinates"]
        delivery_coords = delivery_feature["geometry"]["coordinates"]

        current_marker = pickup_coords[0]
        pickup_marker = pickup_coords[-1]
        dropoff_marker = delivery_coords[-1]
        return {
            "trip": {
                "distance_km": total_distance_km,
                "duration_hours": duration_hours,
                "current_cycle_used": cycle_used,
                "remaining_cycle_hours": remaining_cycle_hours,
            },
            "legs": {
                "current_to_pickup_km": current_to_pickup_km,
                "pickup_to_dropoff_km": pickup_to_dropoff_km,
            },
            "locations": {
                "current": data["current_location"],
                "pickup": data["pickup_location"],
                "dropoff": data["dropoff_location"],
            },
            "marker_coordinates": {
                "current": current_marker,
                "pickup": pickup_marker,
                "dropoff": dropoff_marker,
            },
            "geometry": full_feature["geometry"],
            "timeline": timeline,
        }