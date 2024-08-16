import {resend} from "@/lib/resend"
import VerificationEmail from "../../emails/verificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: 'mail@anonmessage.xyz',
            to: email,
            subject: 'Verification code',
            react: VerificationEmail({username, otp: verifyCode}),
        });
        return {
            success: true,
            message: "Verification email has been sent successfully"
        }
    } catch (sendEmailError) {
        // console.error("Error sending verification email", sendEmailError);
        return {
            success: false,
            message: "Failed to send verification email"
        }
    }
}