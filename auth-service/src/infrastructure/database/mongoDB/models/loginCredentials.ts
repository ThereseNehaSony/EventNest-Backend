import { Schema, model } from "mongoose";
import { UserEntity } from "../../../../domain/entities";

const userSchema = new Schema ({ 
    username:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin","host"],
        default: "user"
    },
    otp: {
        type: String
    },
    status: {
        type: String,
        default: "active"
    },
    phone:{
        type: String
    },
    isGoogleSignup:{
        type: Boolean,
        default:false
    }
}, {
    timestamps: true
})

export const User = model<UserEntity>("logincredentials",userSchema)