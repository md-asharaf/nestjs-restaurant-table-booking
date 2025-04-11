import { ConfigService } from '@nestjs/config';
import {
    bookingConfirmationTemplate,
    bookingReminderTemplate,
    emailVerificationTemplate,
} from './templates';
import { Resend } from 'resend';
import {
    BookingConfirmationData,
    BookingReminderData,
    EmailVerificationData,
} from './interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    private readonly resend: Resend;
    constructor(private readonly config: ConfigService) {
        this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
    }

    private async sendEmail(to: string, subject: string, html: string) {
        return await this.resend.emails.send({
            from: `Table Booking <booking@${this.config.get<string>('RESEND_DOMAIN')}>`,
            to,
            subject,
            html,
        });
    }
    async sendBookingConfirmationEmail(dto: BookingConfirmationData) {
        const { to, ...rest } = dto;
        const html = bookingConfirmationTemplate(rest);
        const subject = `Booking Confirmation`;
        return await this.sendEmail(to, subject, html);
    }

    async sendBookingReminderEmail(dto: BookingReminderData) {
        const { to, ...rest } = dto;
        const html = bookingReminderTemplate(rest);
        const subject = `Booking Reminder`;
        return await this.sendEmail(to, subject, html);
    }
    async sendEmailVerificationCode(dto: EmailVerificationData) {
        const { to, ...rest } = dto;
        const html = emailVerificationTemplate(rest);
        const subject = `Verify Your Email`;
        return await this.sendEmail(to, subject, html);
    }
}
