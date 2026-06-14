export function isValidLicenseKey(key: string): boolean {
  return true;
}

export function generateCustomLicenseKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const part = (length: number) => {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  return `WEBBING-${part(4)}-${part(4)}-${part(4)}-${part(4)}`;
}

export async function verifyLicenseOnline(key: string, domain: string): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

export async function checkSetupAndLicense(host?: string): Promise<{ setupRequired: boolean; licenseValid: boolean }> {
  try {
    let resolvedHost = host;
    if (!resolvedHost) {
      try {
        const { headers } = await import("next/headers");
        const headersList = headers();
        resolvedHost = headersList.get("x-forwarded-host") || headersList.get("host") || "";
      } catch (e) {
        // Ignore if headers() is called outside request context
      }
    }
    const cleanHost = resolvedHost ? resolvedHost.toLowerCase().replace("www.", "").split(":")[0] : "";
    
    // Fallback: Check if environment variables point to the master platforms
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "";
    const cleanAppHost = appUrl.startsWith("http") 
      ? new URL(appUrl).hostname.toLowerCase() 
      : appUrl.toLowerCase().split(":")[0];

    const isPrimaryCentralServer = 
      cleanHost.endsWith("webbing.in") || 
      cleanHost.endsWith("webbing.io") ||
      cleanHost.endsWith("cursorwebs.com") ||
      cleanHost.endsWith("cursonwebs.com") ||
      cleanAppHost.endsWith("webbing.in") ||
      cleanAppHost.endsWith("webbing.io") ||
      cleanAppHost.endsWith("cursorwebs.com") ||
      cleanAppHost.endsWith("cursonwebs.com");

    // Bypasses all setup/license constraints on master platform domains
    if (isPrimaryCentralServer) {
      return {
        setupRequired: false,
        licenseValid: true
      };
    }

    const { prisma } = await import("@webbing/db");

    // 1. Check if there are any ADMIN role users configured in the DB
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" }
    });

    if (adminCount === 0) {
      return { setupRequired: true, licenseValid: true };
    }

    // Check default credentials
    const defaultAdmin = await prisma.user.findUnique({
      where: { email: "admin@cursorwebs.com" }
    });
    if (defaultAdmin && defaultAdmin.passwordHash) {
      const { verifyPassword } = await import("@webbing/db");
      const isDefaultPassword = verifyPassword("Admin123", defaultAdmin.passwordHash);
      if (isDefaultPassword) {
        return { setupRequired: true, licenseValid: true };
      }
    }

    return {
      setupRequired: false,
      licenseValid: true
    };
  } catch (err) {
    console.error("checkSetupAndLicense error:", err);
    return { setupRequired: true, licenseValid: false };
  }
}


