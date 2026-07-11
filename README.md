# SkyFlow | Weather Forecast Portal

SkyFlow is a modern, responsive Weather Forecast Portal. It features real-time weather integration and holds user preferences (such as temperature unit, color theme, and favorite city) inside a backend SQLite database.

## 🚀 Features

- **Real-Time Weather Details**: Fetches temperature, apparent temperature, humidity, wind speed, local time, and condition description for any city in the world.
- **Keyless API Integration**: Uses the free, high-performance Open-Meteo Geocoding & Forecast APIs (no registration or API keys required).
- **Persistent SQL Settings**: User settings are saved using standard SQL transactions inside a local SQLite database file (`database.sqlite`).
- **Dynamic Startup Load**: Upon loading, the portal automatically requests your preferences from the database, applies the selected theme, and searches for your favorite city if set.
- **Vibrant Premium Aesthetics**: Responsive, glassmorphic UI utilizing CSS custom variables to toggle instantly between Light and Dark mode.
- **No Dependencies on CSS Frameworks**: Built using pure vanilla CSS and HTML for high performance and full custom control.

---

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, and modern ES6+ JavaScript.
- **Backend Server**: Node.js and Express.js.
- **Database**: SQL (via SQLite3 node package).

---

## 📂 Project Structure

```
Jahnavi/
├── package.json         # Node.js dependencies (express, sqlite3, cors)
├── server.js            # Express backend & SQLite database configuration
├── database.sqlite      # SQLite database file (created automatically on startup)
├── .gitignore           # File to ignore node_modules and local DB from Git staging
└── public/              # Frontend web assets
    ├── index.html       # Main HTML interface structure
    ├── style.css        # Responsive glassmorphic theme styling
    └── app.js           # Frontend client-side controller
```

---

## ⚙️ How to Setup and Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 1. Install Dependencies
Navigate to the project folder in your terminal and run:
```bash
npm install
```

### 2. Start the Server
Start the Express server:
```bash
node server.js
```

### 3. Open the Browser
Once the server starts up, open your browser and navigate to:
```
http://localhost:3000
```

---

## 🌐 API Reference (Backend Settings DB)

- **Get Settings**: `GET /api/settings`
  - Returns the single-user JSON settings configuration from the SQL database.
  - Response Example:
    ```json
    {
      "temp_unit": "C",
      "theme": "dark",
      "favorite_city": "London"
    }
    ```
- **Update Settings**: `POST /api/settings`
  - Saves new preferences (`temp_unit`, `theme`, `favorite_city`) using `INSERT OR REPLACE` SQL query.
  - Body payload format:
    ```json
    {
      "temp_unit": "F",
      "theme": "light",
      "favorite_city": "Tokyo"
    }
    ```
