import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        
        const { username, code } = await req.json();

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, {
                status: 500
            })
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save()

            return NextResponse.json({
                success: true,
                message: "Account has been verified successfully"
            }, {
                status: 200
            })
        } else if (!isCodeNotExpired) {
            return NextResponse.json({
                success: false,
                message: "Verification code has expired. Please sign up again"
            }, {
                status: 400
            })
        } else {
            return NextResponse.json({
                success: false,
                message: "Verification code is wrong"
            }, {
                status: 400
            })
        }
    } catch (error) {
        // console.log("Error verifying user", error);
        return NextResponse.json({
            success: false,
            message: "Error verifying user"
        }, {
            status: 500
        })
    }
}