import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions)

    const user = session?.user;

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not authenticated"
        }, {
            status: 401
        })
    }

    const userId = new mongoose.Types.ObjectId(user?._id)

    try {
        const user = await UserModel.aggregate([
            {$match: {_id: userId}},
            { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ]).exec()

        if(!user || user.length === 0) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }

        return NextResponse.json({
            success: true,
            messages: user[0].messages
        }, {
            status: 200
        })
    } catch (error) {
        // console.log("Error in fetching messages", error);
        return NextResponse.json({
            success: false,
            message: "Error in fetching messages"
        }, {
            status: 500
        })
    }
}