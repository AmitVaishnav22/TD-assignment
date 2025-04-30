import mongoose from 'mongoose';
import { Progress } from '../models/progress.model.js';
import mergeIntervals from "./calculating.controller.js";

const saveProgress = async (req, res) => {
    const {userId,videoId,watchIntervals,duration,lastPostion} = req.body;
    try {
        const progress = await Progress.findOne({ userId, videoId });
        if (progress){
            const combinedIntervals = [...progress.watchIntervals, ...watchIntervals];
            progress.watchIntervals = mergeIntervals(combinedIntervals);
            console.log("Merged intervals:", progress.watchIntervals);
            progress.lastPostion = lastPostion;
            progress.duration = duration;
            await progress.save();
            return res.json(progress);
        }
        else{
            const newProgress = new Progress({
                userId,
                videoId,
                watchedIntervals: mergeIntervals(watchIntervals),
                lastPostion,
                duration
            });
            await newProgress.save();
            return res.status(201).json(newProgress);
        }
        
    } catch (error) {
        res.status(500).json({ error: err.message });
    }

}

export { saveProgress };