# OpenSearch Log Viewer

A fullstack application for searching, filtering, and managing logs using FastAPI, OpenSearch, and React.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)

---

## Features

- FastAPI backend with OpenSearch integration
- React frontend for log search, filtering, date range, and pagination
- Dockerized for easy setup and deployment
- Sample log data generation for testing

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/foucherjocelyn/test_opensearch.git
cd test_opensearch
```

### 2. Create a `.env` file

Copy `.env.example` to `.env` and adjust the values as needed:

```sh
cp .env.example .env
```

### 3. Ensure Docker & Docker Compose are installed

- [Install Docker](https://docs.docker.com/get-docker/)
- [Install Docker Compose](https://docs.docker.com/compose/install/)

### 4. Build and launch the application

```sh
docker compose up --build
```

This will start the OpenSearch database, backend API, and frontend UI.

---

## Configuration

- All environment variables are managed via the `.env` file.
- Adjust ports, service names, and OpenSearch settings as needed.

---

## Usage

### 1. Populate sample logs

To generate sample log data for testing, run:

```sh
docker compose exec backend python app/utils/populate_logs.py
```

### 2. Access the frontend

Open your browser and navigate to:

```
http://localhost:3000
```
Or the frontend url you have configured

> **Note:** If you see a 500 error, the OpenSearch database may still be initializing. Wait a few moments and refresh the page.

---

## Troubleshooting

- **500 Internal Server Error:**  
  The OpenSearch container may take several minutes to initialize on first run. Wait and refresh the frontend.
- **Environment Variables:**  
  Ensure your `.env` file matches the required format in `.env.example`.
- **Docker Issues:**  
  Make sure Docker and Docker Compose are running and up to date.

---

## Possible Improvements

- **Add Unit Tests**  
  Implement unit and integration tests for both backend (FastAPI) and frontend (React) to ensure reliability and catch regressions early.

- **Improve Docker Compose Dependencies**  
  Use wait-for-it scripts or healthchecks to ensure the database is fully ready before starting the backend and frontend containers. This prevents startup errors and improves reliability.

- **Refine Code Structure**  
  Further modularize backend and frontend code by separating business logic, models, routers, and utility functions into dedicated folders and files.

- **Optimize OpenSearch Index Usage**  
  Since log indexes are named `logs-YYYY.MM.DD`, implement logic to query only the relevant indexes based on the selected date range, rather than always querying `logs-*`. This can greatly improve search efficiency for large datasets.

- **Enhance Pagination Performance**  
  Implement backend-side pagination optimizations, such as caching the next few pages of results. This will make pagination faster and more responsive, especially when dealing with large amounts of log data.

---
