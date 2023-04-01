# Set the base image to Python
FROM python:3.11-slim-buster

# Set the working directory
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Tornado and JWT packages
RUN pip3 install tornado pyjwt

# Copy the application code to the container
COPY ../signaling-server /app

# Expose the application port
EXPOSE 8765

# Start the application
ENTRYPOINT ["python", "server.py"]


