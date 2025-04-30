import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const VideoPlayer = ({ videoId, userId }) => {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentInterval, setCurrentInterval] = useState([0, 0]);

  // Key for localStorage
  const localKey = `video-${videoId}-position`;

  // Fetch progress and lastPosition from backend
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/${videoId}`);
        setProgress(res.data.progress);
        setLastPosition(res.data.lastPosition);

        // Prefer localStorage if user refreshed mid-session
        const localTime = parseFloat(localStorage.getItem(localKey));
        if (!isNaN(localTime)) {
          setLastPosition(localTime);
        }
      } catch (err) {
        console.error('Error fetching progress:', err.message);
      }
    };
    fetchProgress();
  }, [userId, videoId]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    setDuration(video.duration);
    if (lastPosition) {
      video.currentTime = lastPosition;
    }
  };

  const handlePlay = () => {
    const video = videoRef.current;
    const start = Math.floor(video.currentTime);
    setCurrentInterval([start, start]);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    const end = Math.floor(video.currentTime);
    setCurrentInterval(([start]) => [start, end]);

    // Store current time locally every second
    localStorage.setItem(localKey, video.currentTime);
  };

  const handlePause = async () => {
    const video = videoRef.current;

    const payload = {
      userId,
      videoId,
      watchIntervals: [currentInterval],
      lastPosition: Math.floor(video.currentTime),
      duration: Math.floor(video.duration),
    };

    try {
      const res = await axios.post(`http://localhost:5000/api/v1/save`, payload);
      console.log('Progress saved:', res.data);
      setProgress(res.data.progress);

      // Also update localStorage on pause
      localStorage.setItem(localKey, video.currentTime);
    } catch (err) {
      console.error('Error saving progress:', err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Lecture Video</h1>

      <div className="relative w-full aspect-video mb-4">
        <video
          ref={videoRef}
          className="w-full h-full rounded-lg shadow"
          controls
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={handlePlay}
          onTimeUpdate={handleTimeUpdate}
          onPause={handlePause}
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mb-2">
        <div
          className="bg-green-500 h-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-gray-700">Watched: {progress}%</p>
    </div>
  );
};

export default VideoPlayer;
