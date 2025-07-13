import requests
from datetime import datetime, timedelta
import random

URL = "http://localhost:8000/logs"  # Adjust if needed

LEVELS = ["INFO", "WARNING", "ERROR", "DEBUG"]
SERVICES = ["auth-service", "user-service", "payment-service", "notification-service"]
MESSAGES = [
    "User login successful",
    "Payment processed",
    "Email sent",
    "User registration failed",
    "Password reset requested",
    "Database connection error",
    "Cache miss",
    "Session expired",
    "Permission denied",
    "Resource not found"
]

def random_log(i):
    # Random date within the last 90 days, random hour/minute/second
    now = datetime.now()
    random_days = random.randint(0, 89)
    random_seconds = random.randint(0, 86399)  # seconds in a day
    random_time = now - timedelta(days=random_days, seconds=random_seconds)
    return {
        "message": random.choice(MESSAGES) + f" (event {i})",
        "level": random.choice(LEVELS),
        "timestamp": random_time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "service": random.choice(SERVICES)
    }

for i in range(100):  # Change 100 to any number of entries you want
    log = random_log(i)
    resp = requests.post(URL, json=log)
    print(f"Inserted {i}: {resp.status_code} {resp.json()}")