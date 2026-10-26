import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb } from '@/lib/db/mongodb';
import { forgotPasswordSchema } from '@/lib/validations/auth';
import { sendEmail } from '@/lib/services/email.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Please provide a valid email' }, { status: 400 });
    }

    const { email } = result.data;
    const db = await getDb();
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });

    // Consistent response prevents user enumeration
    const genericResponse = {
      success: true,
      message: 'If an account exists with this email, you will receive password reset instructions shortly.',
    };

    if (!user) {
      return NextResponse.json(genericResponse);
    }

    // Generate secure random token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiry

    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          resetTokenHash: tokenHash,
          resetTokenExpires: expiresAt,
        },
      }
    );

    // Send email with reset token link
    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${rawToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Reset Your Second Story Password',
      html: `
        <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password for your Second Story account.</p>
          <p style="margin: 24px 0;">
            <a href="${resetUrl}" style="background: #3D4A3C; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p style="font-size: 12px; color: #777;">This link will expire in 1 hour. If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json(genericResponse);
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
