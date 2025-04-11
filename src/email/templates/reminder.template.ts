import { BookingReminderData } from '../interfaces';

export function bookingReminderTemplate({
    name,
    restaurant,
    time,
}: Partial<BookingReminderData>) {
    return `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #FF9800;">Upcoming Reservation Reminder ⏰</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>This is a reminder for your upcoming reservation at <strong>${restaurant}</strong>.</p>
        <p><strong>Date:</strong> ${new Date().toISOString().split('T')[0]}<br><strong>Time:</strong> ${time}</p>
        <p>We’re excited to host you soon!</p>
        <hr />
        <small>This is a friendly reminder. No action needed.</small>
      </div>
    `;
}
