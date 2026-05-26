import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import { classifyEmail, AUTH_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/hash";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Look up user in database
    let dbUser = await db.user.findUnique({
      where: { email: cleanEmail }
    });

    // 2. Auto-Signup for new Customer accounts
    if (!dbUser) {
      const classification = classifyEmail(cleanEmail);
      if (classification.role !== "customer") {
        return NextResponse.json({ error: "Access denied. Administrative profiles must be pre-provisioned by system administrator." }, { status: 403 });
      }

      const encryptedPassword = hashPassword(password);
      dbUser = await db.user.create({
        data: {
          email: cleanEmail,
          name: classification.name,
          role: "customer",
          password: encryptedPassword,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
        }
      });
      console.log(`[AVENIX] Auto-registered new customer account: ${cleanEmail}`);
    } else {
      // 3. Verify credentials for existing accounts
      const isMatch = verifyPassword(password, dbUser.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Invalid credentials. Check your email and password/PIN." }, { status: 401 });
      }
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
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
