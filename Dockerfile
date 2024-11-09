# Stage 1: Build React App
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Copy the React app's package.json and package-lock.json
COPY movieminds-ui/package.json movieminds-ui/package-lock.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the React app's source code
COPY movieminds-ui .

# Build the React app
RUN npm run build

# Stage 2: Build Flask App
FROM python:3.10

# Set the working directory
WORKDIR /app

# Copy the Flask app's requirements.txt
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Flask app's source code
COPY app.py .
COPY main_data.csv .  
COPY movieminds-ui/build movieminds-ui/build

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Expose the port Flask is running on
EXPOSE 5000

# Command to run the Flask app
CMD ["flask", "run"]