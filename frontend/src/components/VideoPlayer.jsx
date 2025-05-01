import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const VideoPlayer = ({ videoId, userId }) => {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [intervals, setIntervals] = useState([]);
  const [currentStart, setCurrentStart] = useState(null);

  const localKey = `video-${videoId}-position`;

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/${videoId}`);  // currenlty we are not handling on the based on userId since its being done locally for production we can modify with userId via auth
        //console.log('Fetched progress:', res.data);
        const { lastPosition: backendLast, progressPercent, duration } = res.data;

        const savedPosition = parseFloat(localStorage.getItem(localKey));
        const finalPosition = !isNaN(savedPosition) ? savedPosition : backendLast ?? 0;

        setLastPosition(finalPosition);
        setProgress(progressPercent ?? 0);
        setDuration(duration ?? 0);
      } catch (err) {
        console.error('Error fetching progress:', err.message);
      }
    };
    fetchProgress();
  }, [userId, videoId]);

  useEffect(() => {
    if (videoRef.current && lastPosition > 0) {
      videoRef.current.currentTime = lastPosition;
    }
  }, [lastPosition]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    setDuration(video.duration);
  };

  const handlePlay = () => {
    if (currentStart === null) {
      setCurrentStart(Math.floor(videoRef.current.currentTime));
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    const now = Math.floor(video.currentTime);
    localStorage.setItem(localKey, now);

    if (currentStart !== null && now > currentStart) {
      const latestInterval = [currentStart, now];
      const updatedIntervals = [...intervals, latestInterval];
      setIntervals(updatedIntervals);
    }
  };

  const handlePause = async () => {
    const video = videoRef.current;
    const end = Math.floor(video.currentTime);

    if (currentStart !== null && end > currentStart) {
      const interval = [currentStart, end];
      const updatedIntervals = [...intervals, interval];

      const payload = {
        userId,
        videoId,
        watchIntervals: updatedIntervals, 
        lastPosition: end,
        duration: Math.floor(video.duration),
      };

      try {
        const res = await axios.post(`http://localhost:5000/api/v1/save`, payload);
        //console.log('Saved progress:', res.data);
        setProgress(res.data.progressPercent ?? 0);
        localStorage.setItem(localKey, end);
        setIntervals([]); 
      } catch (err) {
        console.error('Error saving progress:', err.message);
      }
    }

    setCurrentStart(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Lecture Video</h1>
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

      {/* Real-time progress bar */}
      <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mb-2">
        <div
          className="bg-green-500 h-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-700">Watched: {progress}%</p>
      <h4 className="text-white">Note : Progess bar is updated on every pause/resume or video complete and only unique intervals are being added in the progess% bar. </h4>
    </div>
  );
};

export default VideoPlayer;


