const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const { PrismaClient, Role, SubscriptionStatus } = require("@prisma/client");
const { hashPassword } = require("../dist/auth");

const prisma = new PrismaClient();

async function main() {
  console.log("Checking and initializing default accounts via upsert...");

  const userCount = await prisma.user.count();
  if (userCount === 0) {
    console.log("No users found in database. Initializing default accounts...");

    // 1. Create or get Admin Tenant
    const adminTenant = await prisma.tenant.upsert({
      where: { slug: "admin" },
      update: {},
      create: {
        name: "Admin Team",
        slug: "admin",
      },
    });

    // 2. Create or update Admin User
    const adminPasswordHash = hashPassword("Admin123");
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@cursorwebs.com" },
      update: {},
      create: {
        email: "admin@cursorwebs.com",
        name: "SaaS Admin Manager",
        passwordHash: adminPasswordHash,
        role: Role.ADMIN,
        tenantId: adminTenant.id,
      },
    });

    // 3. Create or update Admin Subscription
    await prisma.subscription.upsert({
      where: { tenantId: adminTenant.id },
      update: {},
      create: {
        tenantId: adminTenant.id,
        planId: "agency-plan",
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        creditsLimit: 500,
        creditsUsed: 0,
        withLlm: true,
        hostingType: "BOTH",
        domainType: "CUSTOM",
      },
    });

    console.log(`Ensured Admin User: ${adminUser.email} (Password: Admin123)`);

    // 4. Create or get Standard User Tenant
    const standardTenant = await prisma.tenant.upsert({
      where: { slug: "user" },
      update: {},
      create: {
        name: "User Workspace",
        slug: "user",
      },
    });

    // 5. Create or update Standard User
    const userPasswordHash = hashPassword("User123");
    const standardUser = await prisma.user.upsert({
      where: { email: "user@cursorwebs.com" },
      update: {},
      create: {
        email: "user@cursorwebs.com",
        name: "John Doe User",
        passwordHash: userPasswordHash,
        role: Role.USER,
        tenantId: standardTenant.id,
      },
    });

    // 6. Create or update Standard User Subscription
    await prisma.subscription.upsert({
      where: { tenantId: standardTenant.id },
      update: {},
      create: {
        tenantId: standardTenant.id,
        planId: "pro-plan",
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        creditsLimit: 100,
        creditsUsed: 0,
        withLlm: true,
        hostingType: "OURS",
        domainType: "SUBDOMAIN",
      },
    });

    console.log(`Ensured Standard User: ${standardUser.email} (Password: User123)`);
  } else {
    console.log(`Database already has ${userCount} users. Skipping default user accounts creation.`);
  }

  // 7. Seed Default Plans
  console.log("Seeding default plans...");
  const defaultPlans = [
    { name: "Starter", price: 0, creditsLimit: 1000, features: "Free Forever, 1 Website (Download Only), 1,000 Free Credits, No hosting included" },
    { name: "Individual Plan", price: 199, creditsLimit: 2000, features: "3 Published Subdomains, Custom Domain Support, 2,000 Credits/month" },
    { name: "Pro Plan", price: 799, creditsLimit: 10000, features: "15 Published Websites, Custom Domain Support, Create Ecommerce Sites, Logins for each site, Priority Support, 10,000 Credits/month" },
    { name: "Agency", price: 2999, creditsLimit: 50000, features: "Unlimited Websites, Custom Domain Support, Create Ecommerce Sites, Logins for each site, Bring Your Own Key Option, Priority Support, White Label Support, 50,000 Credits/month" }
  ];
  for (const plan of defaultPlans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: {
        price: plan.price,
        creditsLimit: plan.creditsLimit,
        features: plan.features
      },
      create: {
        name: plan.name,
        price: plan.price,
        creditsLimit: plan.creditsLimit,
        features: plan.features
      }
    });
  }

  // 8. Seed Default UPI ID setting
  console.log("Seeding default UPI ID...");
  await prisma.systemSetting.upsert({
    where: { key: "upiId" },
    update: {},
    create: {
      key: "upiId",
      value: "pogakula@ybl"
    }
  });

  console.log("Database seeding/upsert completed successfully! 🎉");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
