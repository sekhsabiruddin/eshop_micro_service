import { prisma } from "@packages/libs/prisma";
import cron from "node-cron";

cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Delete products where `deletedAt` is older than 24 hours
    await prisma.products.deleteMany({
      where: {
        isDeleted: true,
        deletedAt: {
          lte: threshold,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
});
