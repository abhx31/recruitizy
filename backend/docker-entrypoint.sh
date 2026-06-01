#!/bin/sh
set -e

# Wait for postgres before doing anything that touches the DB
if [ -n "$DATABASE_URL" ]; then
  echo "Waiting for database..."
  python -c "
import os, sys, time
from sqlalchemy import create_engine
url = os.environ['DATABASE_URL']
for _ in range(30):
    try:
        create_engine(url).connect().close()
        sys.exit(0)
    except Exception as e:
        print(f'  db not ready: {e}')
        time.sleep(2)
sys.exit('database never became available')
"
fi

case "$1" in
  api)
    echo "Running database migrations..."
    alembic upgrade head
    echo "Starting API on 0.0.0.0:8000..."
    exec uvicorn app.main:app --host 0.0.0.0 --port 8000
    ;;
  worker)
    echo "Starting Celery worker..."
    exec celery -A app.core.celery.celery worker --loglevel=info
    ;;
  beat)
    echo "Starting Celery beat..."
    exec celery -A app.core.celery.celery beat --loglevel=info
    ;;
  migrate)
    exec alembic upgrade head
    ;;
  *)
    exec "$@"
    ;;
esac
