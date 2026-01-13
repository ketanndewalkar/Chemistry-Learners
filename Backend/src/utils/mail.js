import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();    

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, emailVerificationToken) => {
  
  const emailUrl = `${process.env.BASE_URL}/api/v1/auth/verify/${emailVerificationToken}`;

  const {data,error} = await resend.emails.send({
    from: "ChemistryLearners <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5">
        <h2>Email Verification</h2>
        <p>Click the button below to verify your email:</p>

        <a href="${emailUrl}"
           style="
             display: inline-block;
             padding: 12px 18px;
             background-color: #2563eb;
             color: #ffffff;
             text-decoration: none;
             border-radius: 6px;
             font-weight: bold;
           ">
          Verify Email
        </a>

        <p style="margin-top: 16px;">
          If you didn’t create an account, you can ignore this email.
        </p>
      </div>
    `,
  });
  if(error){
     return console.error({ error });
  }
  
};


