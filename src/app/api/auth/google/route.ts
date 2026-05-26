import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import { classifyEmail, AUTH_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/hash";
import { randomBytes } from "crypto";
import { OAuth2Client } from "google-auth-library";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const oauthClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

export async function POST(req: NextRequest) {
  try {
    const { credential, email, name, avatar } = await req.json();

    let verifiedEmail = "";
    let verifiedName = "";
    let verifiedAvatar = "";

    // 1. Google ID Token Verification
    if (credential) {
      if (!oauthClient) {
        return NextResponse.json({ error: "Google Client ID is not configured on the server." }, { status: 500 });
      }
      try {
        const ticket = await oauthClient.verifyIdToken({
          idToken: credential,
          audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
          return NextResponse.json({ error: "Invalid ID Token payload." }, { status: 400 });
        }
        verifiedEmail = payload.email.trim().toLowerCase();
        verifiedName = payload.name || verifiedEmail.split("@")[0];
        verifiedAvatar = payload.picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150";
      } catch (err: any) {
        console.error("Google ID Token verification failed:", err);
        return NextResponse.json({ error: `Google Auth Error: ${err.message || err}` }, { status: 400 });
      }
    } else {
      // Sandbox Developer Fallback Mode
      if (!email) {
        return NextResponse.json({ error: "Email or credential token is required" }, { status: 400 });
      }
      verifiedEmail = email.trim().toLowerCase();
      verifiedName = name || verifiedEmail.split("@")[0];
      verifiedAvatar = avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150";
    }

    // 2. Look up user in database
    let dbUser = await db.user.findUnique({
      where: { email: verifiedEmail }
    });

    // 3. Auto-Signup for Google users if they don't exist
    if (!dbUser) {
      const classification = classifyEmail(verifiedEmail);
      
      const randomPassword = randomBytes(32).toString("hex");
      const encryptedPassword = hashPassword(randomPassword);

      dbUser = await db.user.create({
        data: {
          email: verifiedEmail,
          name: verifiedName || classification.name,
          role: classification.role,
          password: encryptedPassword,
          avatar: verifiedAvatar
        }
      });
      console.log(`[AVENIX] Auto-registered Google user account: ${verifiedEmail} with role ${classification.role}`);
    }

    const payload = {
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role as any,
      avatar: dbUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
    };

    const token = signToken(payload);

    const response = NextResponse.json({ user: payload });
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error("Google Auth API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
