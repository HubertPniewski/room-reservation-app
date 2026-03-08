FROM python:3.12-slim

# Install system dependencies (for Postgresa and Pillow)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python libs
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Run server
CMD ["python", "booking_app/manage.py", "runserver", "0.0.0.0:8000"]