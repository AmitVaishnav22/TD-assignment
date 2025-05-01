import { Progress } from '../models/progress.model.js';
import mergeIntervals from './calculating.controller.js';

const saveProgress = async (req, res) => {
  const { userId, videoId, watchIntervals, duration, lastPosition } = req.body;
  console.log("Received data:", req.body);

  // Validate intervals
  if (
    !Array.isArray(watchIntervals) ||
    watchIntervals.length === 0 ||
    !Array.isArray(watchIntervals[0])
  ) {
    return res.status(400).json({ error: 'Invalid or empty watchIntervals' });
  }

  try {
    let progress = await Progress.findOne({ userId, videoId });

    // Merge new intervals with existing ones
    const mergedIntervals = progress
      ? mergeIntervals([...progress.watchIntervals, ...watchIntervals])
      : mergeIntervals(watchIntervals);

    // Calculate watched seconds and progress
    const totalWatchedSeconds = mergedIntervals.reduce(
      (acc, [start, end]) => acc + (end - start),
      0
    );

    const computedProgressPercent = duration
      ? parseFloat(((totalWatchedSeconds / duration) * 100).toFixed(2))
      : 0;

    if (progress) {
      // Update existing progress
      progress.watchIntervals = mergedIntervals;
      progress.lastPosition = lastPosition;
      progress.duration = duration;
      progress.progressPercent = computedProgressPercent;
      await progress.save();
    } else {
      // Create new progress record
      progress = new Progress({
        userId,
        videoId,
        watchIntervals: mergedIntervals,
        lastPosition,
        duration,
        progressPercent: computedProgressPercent,
      });
      await progress.save();
    }

    return res.status(200).json(progress);
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: err.message });
  }
};

export { saveProgress };
