import { BookingConfirmationData } from '../interfaces';

export function bookingConfirmationTemplate({
    name,
    restaurant,
    date,
    time,
}: Partial<BookingConfirmationData>) {
    return `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #4CAF50;">Booking Confirmed ✅</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your reservation at <strong>${restaurant}</strong> is confirmed.</p>
        <p><strong>Date:</strong> ${date}<br><strong>Time:</strong> ${time}</p>
        <p>We look forward to seeing you! 🍽️</p>
        <hr />
        <small>This is an automated confirmation email. Do not reply.</small>
      </div>
    `;
}
