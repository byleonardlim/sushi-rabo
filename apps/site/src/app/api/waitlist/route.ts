import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = process.env.SENDER_API_TOKEN;

  if (!token) {
    return NextResponse.json({ success: false, error: "Missing SENDER_API_TOKEN" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body === "object" && body !== null && "email" in body ? (body as { email?: unknown }).email : undefined;

  if (typeof email !== "string" || email.trim().length === 0) {
    return NextResponse.json({ success: false, error: "Email is required" }, { status: 422 });
  }

  const trimmedEmail = email.trim();

  const pickSenderErrorMessage = (payload: unknown): string | null => {
    if (payload && typeof payload === "object") {
      if ("message" in payload && typeof (payload as { message?: unknown }).message === "string") {
        return (payload as { message: string }).message;
      }
      if ("errors" in payload && (payload as { errors?: unknown }).errors && typeof (payload as { errors: unknown }).errors === "object") {
        const errors = (payload as { errors: Record<string, unknown> }).errors;
        const emailErrors = errors.email;
        if (Array.isArray(emailErrors) && typeof emailErrors[0] === "string") {
          return emailErrors[0];
        }
      }
    }
    return null;
  };

  let res: Response;
  try {
    res = await fetch("https://api.sender.net/v2/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: trimmedEmail,
        groups: ["bq8g0y"],
      }),
    });
  } catch {
    return NextResponse.json({ success: false, error: "Could not reach email provider. Please try again." }, { status: 502 });
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) {
      return NextResponse.json({ success: false, error: "Email provider is not configured. Please try again later." }, { status: 500 });
    }

    if (res.status === 422) {
      const senderMsg = pickSenderErrorMessage(data);
      const msg = senderMsg ? senderMsg : "Please enter a valid email address.";
      return NextResponse.json({ success: false, error: msg }, { status: 422 });
    }

    if (res.status === 429) {
      return NextResponse.json(
        { success: false, error: "We’re getting a lot of signups right now—please try again in a minute." },
        { status: 429 },
      );
    }

    const senderMsg = pickSenderErrorMessage(data);
    if (senderMsg && /already|exists/i.test(senderMsg)) {
      return NextResponse.json({ success: false, error: "You’re already on the list." }, { status: 409 });
    }

    return NextResponse.json({ success: false, error: "We couldn’t add you right now. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
