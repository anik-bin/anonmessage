import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid
    await dbConnect();

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not authenticated"
        }, {
            status: 401
        })
    }

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        )

        if (updatedResult.modifiedCount == 0) {
            return NextResponse.json({
                success: false,
                message: "Message not found or already deleted"
            }, {
                status: 404
            })
        }

        return NextResponse.json({
            success: true,
            message: "Message has been deleted successfully"
        }, {
            status: 200
        }) 
    } catch (error) {
        // console.log("Error in deleting messages", error);
        return NextResponse.json({
            success: false,
            message: "Error in deleting messages"
        }, {
            status: 500
        })
    }
}