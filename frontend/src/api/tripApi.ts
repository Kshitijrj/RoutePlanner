import axios from "axios";
import type { TripResponse } from "../types/trip";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

export const planTrip = async (
    payload: {
        current_location: string;
        pickup_location: string;
        dropoff_location: string;
        current_cycle_used: number;
    }
): Promise<TripResponse> => {

    const response = await api.post<TripResponse>(
        "/plan-trip/",
        payload
    );

    return response.data;
};