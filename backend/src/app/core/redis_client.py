import os

import redis

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Shared client. decode_responses=True so GETs return str instead of bytes.
redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
