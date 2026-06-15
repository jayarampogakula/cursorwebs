import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma, hashPassword, Role, SubscriptionStatus } from "@webbing/db";
import { signSession } from "@/lib/session";
import { sendWelcomeEmail } from "@/lib/mail";
import { getSystemSettings } from "@/lib/settings";


export async function POST(req: Request) {
  try {
    const { name, email, password, tenantName, referrerCode, phone, plan } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const emailClean = email.toLowerCase().trim();
    if (!emailClean.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: emailClean },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // 2. Create or associate Tenant
    const slug = emailClean.split("@")[0].replace(/[^a-zA-Z0-9]/g, "") + "-" + Math.floor(1000 + Math.random() * 9000);
    const finalTenantName = tenantName?.trim() || `${name}'s Workspace`;

    const tenant = await prisma.tenant.create({
      data: {
        name: finalTenantName,
        slug: slug,
      },
    });

    // Generate unique affiliate code for the new user
    const affiliateCode = name.trim().split(" ")[0].replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase() + Math.floor(1000 + Math.random() * 9000);

    // Resolve referrer id if any
    let referrerId: string | undefined = undefined;
    if (referrerCode) {
      const settings = await getSystemSettings();
      if (settings.affiliateEnabled === "true") {
        const referrerUser = await prisma.user.findFirst({
          where: { affiliateCode: referrerCode.trim().toUpperCase() }
        });
        if (referrerUser) {
          const referrerSub = await prisma.subscription.findUnique({
            where: { tenantId: referrerUser.tenantId }
          });
          const isPaid = referrerSub && referrerSub.status === "ACTIVE" && referrerSub.planId !== "free-plan" && referrerSub.planId !== "starter";
          if (isPaid) {
            referrerId = referrerUser.id;
          }
        }
      }
    }

    // 3. Hash password and create User
    const passwordHash = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: emailClean,
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        passwordHash,
        role: Role.USER,
        tenantId: tenant.id,
        affiliateCode,
        referredBy: referrerId
      },
    });

    // Send welcome email asynchronously
    sendWelcomeEmail(user.email, user.name || "User").catch((err) => {
      console.error("Failed to send welcome email during signup:", err);
    });


    // 4. Create Subscription (Free or selected Paid plan)
    let creditsLimit = 10;
    let finalPlanId = "free-plan";
    let status = SubscriptionStatus.ACTIVE;
    let durationMs = 30 * 24 * 60 * 60 * 1000; // 30 days default

    if (plan) {
      try {
        const cleanPlan = plan.replace("-annual", "");
        const dbPlan = await prisma.plan.findFirst({
          where: {
            OR: [
              { id: cleanPlan },
              { name: { equals: cleanPlan, mode: "insensitive" } },
              { name: { equals: cleanPlan.replace("-plan", ""), mode: "insensitive" } }
            ]
          }
        });
        if (dbPlan) {
          creditsLimit = dbPlan.creditsLimit;
          finalPlanId = dbPlan.name.toLowerCase().replace(/\s+/g, "-");
          if (plan.endsWith("-annual")) {
            finalPlanId = `${finalPlanId}-annual`;
            durationMs = 365 * 24 * 60 * 60 * 1000; // 1 year
          }
          if (dbPlan.price > 0) {
            status = SubscriptionStatus.UNPAID; // Require purchase confirmation
          }
        }
      } catch (err) {
        console.error("Failed to fetch selected plan from DB:", err);
      }
    } else {
      // Default Free plan lookup
      try {
        const starterPlan = await prisma.plan.findFirst({
          where: {
            OR: [
              { name: { equals: "Starter", mode: "insensitive" } },
              { price: 0 }
            ]
          }
        });
        if (starterPlan) {
          creditsLimit = starterPlan.creditsLimit;
          finalPlanId = starterPlan.name.toLowerCase().replace(/\s+/g, "-");
        }
      } catch (err) {
        console.error("Failed to fetch starter plan from DB:", err);
      }
    }

    await prisma.subscription.create({
      data: {
        tenantId: tenant.id,
        planId: finalPlanId,
        status: status,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + durationMs),
        creditsLimit: creditsLimit,
        creditsUsed: 0,
      },
    });

    // 5. Generate signed session
    const sessionToken = signSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    });

    // 6. Set HttpOnly cookie
    const cookieStore = cookies();
    cookieStore.set("webbing-session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({
      success: true,
      role: user.role,
      email: user.email,
    });
  } catch (error: any) {
    console.error("Sign-up API Exception:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
