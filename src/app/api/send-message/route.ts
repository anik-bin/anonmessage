import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";
import { Message } from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   await dbConnect();
   
   const {username, content} = await req.json();

   try {
    const user = await UserModel.findOne({username}).exec()

    if(!user) {
        return NextResponse.json({
            success: false,
            message: "User not found"
        }, {
            status: 404
        }) 
    }

    // check if user is accepting the message or not

    if(!user.isAcceptingMessages) {
        return NextResponse.json({
            success: false,
            message: "User not accepting the messages"
        }, {
            status: 403
        })
    }

    const newMessage = {content, createdAt: new Date()}

    user.messages.push(newMessage as Message)

    await user.save()

       return NextResponse.json({
           success: true,
           message: "Message has been sent successfully"
       }, {
           status: 200
       })
   } catch (error) {
       return NextResponse.json({
           success: false,
           message: "Error in sending message"
       }, {
           status: 500
       })
   }
}