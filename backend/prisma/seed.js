const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Password123", 10);

  const users = [
    {
      name: "Super Admin",
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin@test.com",
      passwordHash: password,
      role: "SUPER_ADMIN",
    },
    {
      name: "Campaign Manager",
      firstName: "Campaign",
      lastName: "Manager",
      email: "manager@test.com",
      passwordHash: password,
      role: "CAMPAIGN_MANAGER",
    },
    {
      name: "Viewer",
      firstName: "Demo",
      lastName: "Viewer",
      email: "viewer@test.com",
      passwordHash: password,
      role: "CLIENT_SUBSCRIBER",
    },
  ];

  for (const user of users) {
    const existing = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!existing) {
      await prisma.user.create({
        data: user,
      });
    }
  }

  console.log("Demo users seeded");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });