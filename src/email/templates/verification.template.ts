export function emailVerificationTemplate({
    name,
    otp,
}: {
    name: string;
    otp: string;
}) {
    return `
      <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto;">
        <h2 style="color: #333;">Your One-Time Password (OTP)</h2>
        <p>Hi ${name || 'there'},</p>
        <p>Use the OTP below to verify your email. This code will expire in 10 minutes:</p>
        <div style="font-size: 24px; font-weight: bold; color: #4f46e5; margin: 20px 0;">${otp}</div>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `;
}
