import server from "./app";
import config from "./config";
import prisma from "./prisma/client";
// import seed from "./seed/seed"

async function startServer() {
  // Connect prisma database
  await prisma.$connect();
  console.log("✅ Database connected successfully");

  // Seed data
  // seed()

  server.listen(config.port, () => {
    console.log(`🚀 Server is running on port: ${config.port}`);
  });
}

startServer();
