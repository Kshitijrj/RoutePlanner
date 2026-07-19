# 🚛 Driver Trip Planner & HOS Scheduler

A full-stack web application built with **Django** and **React** that helps truck drivers plan compliant trips by generating optimized routes, scheduling according to FMCSA Hours of Service (HOS) regulations, and producing both Electronic Driver Logs (ELD) and traditional FMCSA Daily Log Sheets.

> Built as a Full Stack Developer Assessment.

---

## 🌐 Live Demo

**Frontend:** [https://your-vercel-url.vercel.app](https://route-planner-eziae73nv-kshitijrjs-projects.vercel.app/)

**Backend API:** [https://your-render-url.onrender.com
](https://routeplanne.onrender.com/)
**Loom Walkthrough:** https://loom.com/share/your-video-link

---

## ✨ Features

### 🚛 Trip Planning

- Enter Current Location
- Pickup Location
- Dropoff Location
- Current Cycle Used
- Automatic trip generation

### 🗺 Interactive Route Map

- OpenRouteService integration
- Interactive Leaflet map
- Route visualization
- Current, Pickup and Dropoff markers

### ⏰ Hours of Service Scheduler

Automatically schedules trips while complying with FMCSA regulations:

- ✅ 11-hour driving limit
- ✅ 14-hour duty window
- ✅ Mandatory 30-minute break
- ✅ 10-hour off-duty reset
- ✅ 34-hour cycle restart
- ✅ 70-hour / 8-day cycle limit
- ✅ Fuel stops every ~1000 miles
- ✅ Pickup & Dropoff handling

---

### 📅 Trip Timeline

Visual chronological timeline showing:

- Driving
- Pickup
- Dropoff
- Fuel Stops
- Breaks
- Off Duty
- Cycle Resets

---

### 📋 Electronic Driver Logs (ELD)

Daily HOS logs including:

- Driving hours
- On-duty hours
- Off-duty hours
- Duty status events
- Activity descriptions
- Start & End times

---

### 📝 Traditional FMCSA Daily Log Sheet

A paper-style FMCSA log visualization that provides:

- 24-hour duty status grid
- Daily driving summary
- Multiple-day navigation
- Traditional driver log representation

---

## 🛠 Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Leaflet
- Lucide Icons

### Backend

- Django
- Django REST Framework
- Gunicorn

### APIs

- OpenRouteService API

### Deployment

- Vercel
- Render

---

# Project Structure

```
RoutePlanner/
│
├── backend/
│   ├── trip/
│   │   ├── services/
│   │   │   ├── trip_service.py
│   │   │   ├── scheduler.py
│   │   │   ├── driver_state.py
│   │   │   ├── trip_segment.py
│   │   │   └── events.py
│   │   ├── views.py
│   │   └── serializers.py
│   │
│   └── config/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TripForm.tsx
│   │   │   ├── SummaryCards.tsx
│   │   │   ├── MapView.tsx
│   │   │   ├── Timeline.tsx
│   │   │   ├── ELDLogs.tsx
│   │   │   ├── FMCSALogModal.tsx
│   │   │   └── FMCSALogSheet.tsx
│   │   │
│   │   ├── pages/
│   │   └── types/
│   │
│   └── package.json
│
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/RoutePlanner.git

cd RoutePlanner
```

---

## Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate
# Windows
venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

Backend runs on

```
http://127.0.0.1:8000
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# Environment Variables

Backend

```
ORS_API_KEY=your_openrouteservice_api_key
```

Frontend

```
VITE_API_URL=http://127.0.0.1:8000
```

For production:

```
VITE_API_URL=https://your-render-api.onrender.com
```

---

# API Endpoint

## Plan Trip

```
POST /api/plan-trip/
```

### Request

```json
{
    "current_location": "Delhi",
    "pickup_location": "Agra",
    "dropoff_location": "Mumbai",
    "current_cycle_used": 20
}
```

---

### Response

```json
{
  "trip": {},
  "legs": {},
  "locations": {},
  "marker_coordinates": {},
  "geometry": {},
  "timeline": {}
}
```

---

# Hours of Service Rules Implemented

| Rule | Status |
|-------|--------|
| 11 Hour Driving Limit | ✅ |
| 14 Hour Duty Window | ✅ |
| 30 Minute Break | ✅ |
| 10 Hour Reset | ✅ |
| 34 Hour Restart | ✅ |
| 70 Hour / 8 Day Cycle | ✅ |
| Fuel Stops | ✅ |
| Pickup / Dropoff Time | ✅ |

---

# Screenshots

## Dashboard

_Add screenshot here_

---

## Route Map

_Add screenshot here_

---

## Timeline

_Add screenshot here_

---

## Electronic Driver Logs

_Add screenshot here_

---

## FMCSA Log Sheet

_Add screenshot here_

---

# Future Improvements

- Export trip as PDF
- Download FMCSA log sheets
- Driver authentication
- Fleet management
- Weather integration
- Traffic-aware routing
- Printable reports
- Real-time GPS tracking

---

# Author

**Kshitij Raj**

B.Tech Information Technology

Indian Institute of Information Technology, Allahabad


---

# License

This project was developed as part of a Full Stack Developer Assessment.
