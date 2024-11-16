# Stage 1: Build React App
FROM node:16 AS build

WORKDIR /app

COPY movieminds-ui/package.json movieminds-ui/package-lock.json ./

RUN npm install --force

COPY movieminds-ui .

RUN npm run build

# Stage 2: Build Flask App
FROM python:3.10

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .
COPY main_data.csv .  
COPY movieminds-ui/build movieminds-ui/build

# Copy the env.sh script
COPY movieminds-ui/env.sh /usr/share/nginx/html/env.sh

# Expose the port Flask is running on
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Command to run the Flask app and inject env variables
CMD ["sh", "-c", "/usr/share/nginx/html/env.sh && flask run"]