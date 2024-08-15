import {resend} from "@/lib/resend"
import VerificationEmail from "../../emails/verificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {

        const response = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
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