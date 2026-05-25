import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/security';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  // Rate limit: 5 requests per minute per IP
  const ip = getClientIP(request);
  const rateLimitResult = checkRateLimit(ip, 'subscribe', 5, 60000);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmedEmail) || trimmedEmail.length > 320) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // TODO: Integrate with email service (Resend, Mailchimp, Brevo)
    // TODO: Store in database instead of logging
    // For now, log the subscription (server-side only)
    console.log(`[Newsletter] New subscription: ${trimmedEmail.substring(0, 3)}***@${trimmedEmail.split('@')[1]}`);

    return NextResponse.json({
      success: true,
      message: 'Thanks for subscribing! You\'ll receive updates soon.'
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
