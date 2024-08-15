import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerifyEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    await dbConnect();
    try {
        const { username, email, password } = await req.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return NextResponse.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }

        const existingUserEmail = await UserModel.findOne({
            email
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserEmail) {
            if (existingUserEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "User already exists with this email"
                }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserEmail.password = hashedPassword
                existingUserEmail.verifyCode = verifyCode
                existingUserEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })

            await newUser.save()
        }

        // send verification email

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode,
        )

        if (!emailResponse.success) {
            return NextResponse.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: "User registered successfully. Please verify your email"
        }, { status: 201 })


    } catch (error) {
        // console.error("Error registering user", error)
        return NextResponse.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}