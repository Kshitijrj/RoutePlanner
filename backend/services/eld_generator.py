from collections import defaultdict
from datetime import datetime


class ELDGenerator:

    def __init__(self, timeline):
        self.timeline = timeline

    def generate(self):

        logs = defaultdict(list)

        for event in self.timeline:

            start = datetime.fromisoformat(event["start"])
            end = datetime.fromisoformat(event["end"])

            logs[start.date().isoformat()].append({
                "start": start.strftime("%H:%M"),
                "end": end.strftime("%H:%M"),
                "status": event["event_type"],
                "description": event["description"],
            })

        return dict(logs)