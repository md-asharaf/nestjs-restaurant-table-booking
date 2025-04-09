import { totp } from 'otplib';
import * as crypto from 'crypto';

const BASE_SECRET = process.env.OTP_SECRET || 'my-strong-base-secret';

const getUserSecret = (email: string): string => {
    return crypto
        .createHmac('sha256', BASE_SECRET)
        .update(email.toLowerCase().trim())
        .digest('hex');
};

totp.options = {
    digits: 6,
    step: 600,
    window: 1,
};

export const generateOtp = (email: string) => {
    const secret = getUserSecret(email);
    return totp.generate(secret);
};

export const verifyOtp = (email: string, code: string) => {
    const secret = getUserSecret(email);
    return totp.check(code, secret);
};
