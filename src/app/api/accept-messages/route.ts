import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { User } from "next-auth";

export async function POST(req: NextRequest) {

    await dbConnect();

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User;

    if(!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not authenticated"
        }, {
            status: 401
        })
    }

    const userId = user?._id;
    const {acceptMessages} = await req.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            {isAcceptingMessages: acceptMessages},
            {new: true}
        )

        if(!updatedUser) {
            return NextResponse.json({
                success: false,
                message: "Failed to update user status to accept messages"
            }, {
                status: 404
            })
        }

        return NextResponse.json({
            success: true,
            message: "Message acceptance status updated successfully", updatedUser
        }, {
            status: 200
        })
    } catch (error) {
        // console.log("Failed to update user status to accept messages");
        return NextResponse.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, {
            status: 500
        })
    }
}

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

    const userId = user?._id;

    try {
        const foundUser = await UserModel.findById(userId)
    
        if(!foundUser) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }
    
        return NextResponse.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages,
            message: "User found and accepting messages"
        }, {
            status: 200
        })
    } catch (error) {
        // console.log("Error in getting message acceptance status");
        return NextResponse.json({
            success: false,
            message: "Error in getting message acceptance status"
        }, {
            status: 500
        })
    }
}