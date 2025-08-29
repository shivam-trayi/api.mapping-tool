export const verificationEmailTemplate = (
  frontendUrl: string,
  token: string
) => `
<html>
  <body>
    <h2>Email Verification</h2>
    <p>Hello,</p>
    <p>Thank you for registering. Please verify your email by clicking the link below:</p>
    <a href="${frontendUrl}/verify-email?token=${token}">Verify Email</a>
    <p>If you did not request this, please ignore this email.</p>
  </body>
</html>
`;


export const resetPasswordEmailTemplate = (
  frontendUrl: string,
  token: string,
  redirectUrl: string = '/dashboard' // default redirect
) => `
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
    <h2 style="color: #1a73e8;">Password Reset Request</h2>
    <p>Hello,</p>
    <p>We received a request to reset your password for your account.</p>
    <p style="margin: 20px 0;">
      <a href="${frontendUrl}/reset-password?token=${token}&redirect=${encodeURIComponent(redirectUrl)}" 
         style="display: inline-block; padding: 10px 20px; background-color: #1a73e8; color: #fff; text-decoration: none; border-radius: 4px; cursor: pointer;">
        Reset Password
      </a>
    </p>
    <p>If you did not request this password reset, please ignore this email.</p>
    <p>Thank you,<br/>Cyber Security Team</p>
  </body>
</html>
`;

