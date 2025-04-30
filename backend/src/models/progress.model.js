import mongoose,{Schema} from "mongoose";

const ProgressSchema = new Schema({
    userId:{
        type:String,
        required:true,
    },
    videoId:{
        type:String,
        required:true,
    },
    watchIntervals:[
        [Number]
    ],
    duration:{
        type:Number,
        required:true,
    },
    lastPostion:{
        type:Number,
        default:0,
    }

},{timestamps:true});

export const Progress = mongoose.model("Progress",ProgressSchema);