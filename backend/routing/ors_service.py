import os
import requests


class ORSService:

    BASE_URL = "https://api.openrouteservice.org"
    API_KEY = os.getenv("ORS_API_KEY")

    @classmethod
    def geocode(cls, location):

        response = requests.get(
            f"{cls.BASE_URL}/geocode/search",
            params={
                "api_key": cls.API_KEY,
                "text": location,
                "size": 1,
            },
        )

        response.raise_for_status()

        features = response.json()["features"]

        if not features:
            raise ValueError(f"Location '{location}' not found.")

        lon, lat = features[0]["geometry"]["coordinates"]

        return lat, lon

    @classmethod
    def get_route(cls, *locations):
        """
        Supports:
            get_route(current, pickup)
            get_route(pickup, dropoff)
            get_route(current, pickup, dropoff)
        """

        if len(locations) < 2:
            raise ValueError("At least two locations are required.")

        coordinates = []

        for location in locations:
            lat, lon = cls.geocode(location)
            coordinates.append([lon, lat])

        response = requests.post(
            f"{cls.BASE_URL}/v2/directions/driving-car/geojson",
            headers={
                "Authorization": cls.API_KEY,
                "Content-Type": "application/json",
            },
            json={
                "coordinates": coordinates,
            },
        )

        response.raise_for_status()

        return response.json()