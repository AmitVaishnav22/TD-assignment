import mongoose from 'mongoose';
import { Progress } from '../models/progress.model.js';

const getProgress = async (req, res) => {
    const { videoId } = req.params;
    try {
        const progress = await Progress.findOne({ videoId });
        if (progress) {
            return res.json(progress);
        } else {
            return res.status(404).json({ message: 'Progress not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { getProgress };