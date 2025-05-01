# 🎥 Video Progress Tracker

## Short Write-Up

**How we tracked the watched intervals**  
We record the `start` timestamp when the user hits play (or resumes) and the `end` timestamp when they pause or stop the video. Each play–pause session generates an interval `[start, end]` which we capture in an array.

**How we merged intervals to calculate unique progress**  
On each save, we take the existing watched intervals and the new intervals, sort them by start time, and merge any overlapping or adjacent segments. Example before and after merge:
```js
// Before merge
let intervals = [[0, 10], [5, 15], [20, 25]];
// After merge
intervals = [[0, 15], [20, 25]];
```
We then sum the lengths of those merged intervals (`end - start` for each) to get `totalWatchedSeconds` and compute:
```js
progressPercent = (totalWatchedSeconds / videoDuration) * 100
```

**Challenges encountered and solutions**  
- **Preventing duplicate counts when rewatching**: Merged overlapping intervals before calculating total time.  
- **Handling fast-forward skips**: Only count time in intervals where the video was actually playing, so skipped sections aren’t counted.  
- **Resuming accurately**: Stored `lastPosition` in both `localStorage` and the database, then set the video’s `currentTime` once metadata and saved position loaded.  
- **Malformed or empty intervals**: Validated incoming intervals on the backend and rejected invalid data.  
- **Keeping frontend and backend in sync**: Used Axios and React hooks to fetch and save progress in real time.

---

# 🎥 Video Progress Tracker

A full-stack application that accurately tracks user progress while watching lecture videos — based on **unique time intervals watched**, not just whether the video was played to the end.

---

## 🧩 Features

-  Tracks unique video segments viewed  
-  Ignores rewatched parts to ensure real progress  
-  Stores viewing data persistently in MongoDB  
-  Automatically resumes video from last saved position  
-  Clean UI with real-time progress bar  

---

## 🏗️ Project Structure

```
/video-progress-tracker
├── backend/     # Node.js Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env.example
├── frontend/    # React frontend
│   ├── src/
│   │   ├── components/VideoPlayer.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   └── public/video.mp4
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/AmitVaishnav22/TD-assignment.git
cd TD-assignment
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MongoDB URI in .env
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

---

## ⚙️ Environment Variables

Create a `.env` from `.env.example`:
```
MONGO_URI=mongodb://localhost:27017/progress-db
PORT=5000
```

---

## 🧪 API Endpoints

| Method | Route                               | Description                |
|--------|-------------------------------------|----------------------------|
| GET    | `/api/v1/:videoId                   | Fetch saved progress data  |
| POST   | `/api/v1/save`                      | Save watched intervals     |

---

## 📺 Demo

*(Optional: Add screenshots, GIFs, or a link to a demo video here.)*

---

## 📜 License

MIT © Amit Vaishnav

---

## 🔗 GitHub

[https://github.com/AmitVaishnav22/TD-assignment](https://github.com/AmitVaishnav22/TD-assignment)

