export interface TripInfo {
    distance_km: number;
    duration_hours: number;
    current_cycle_used: number;
    remaining_cycle_hours: number;
}

export interface Locations {
    current: string;
    pickup: string;
    dropoff: string;
}

export interface Geometry {
    type: string;
    coordinates: number[][];
}

export interface TimelineEvent {
    event_type: string;
    start: string;
    end: string;
    duration_hours: number;
    description: string;
}

export interface ELDEvent {
    start: string;
    end: string;
    status: string;
    description: string;
}

export interface ELDDayLog {
    events: ELDEvent[];
    driving_hours: number;
    on_duty_hours: number;
    off_duty_hours: number;
}

export interface TimelineData {
    timeline: TimelineEvent[];
    eld_logs: Record<string, ELDDayLog>;
}

export interface TripResponse {
    trip: TripInfo;
    locations: Locations;
    geometry: Geometry;
    timeline: TimelineData;
}