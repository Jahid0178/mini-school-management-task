import bcrypt from "bcryptjs";
import prisma from "../prisma/client";
import { Role } from "../typescript/interface";

async function seed() {
  try {
    console.log("Seeding database...");

    await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@school.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
      },
    });

    await prisma.user.create({
      data: {
        name: "Teacher User",
        email: "teacher@school.com",
        password: await bcrypt.hash("teacher123", 10),
        role: "teacher",
      },
    });

    const class1 = await prisma.class.create({
      data: {
        name: "Mathematics",
        section: "A",
      },
    });

    const class2 = await prisma.class.create({
      data: {
        name: "Science",
        section: "B",
      },
    });

    const students = [
      { name: "Alice Johnson", age: 15, classId: class1.id },
      { name: "Bob Smith", age: 16, classId: class1.id },
      { name: "Charlie Brown", age: 15, classId: class2.id },
      { name: "Diana Prince", age: 17, classId: class2.id },
    ];

    for (const student of students) {
      const user = await prisma.user.create({
        data: {
          name: student.name,
          email: `${student.name.toLowerCase().replace(/\s+/g, ".")}@school.edu`,
          password: await bcrypt.hash("student123", 10),
          role: Role.student,
        },
      });

      await prisma.student.create({
        data: {
          name: student.name,
          age: student.age,
          classId: student.classId,
          userId: user.id,
        },
      });
    }

    console.log("✅ Seed completed successfully!");
    console.log("👤 Admin: admin@school.com / admin123");
    console.log("👨‍🏫 Teacher: teacher@school.com / teacher123");
    console.log("👨‍🎓 Students: *.@school.edu / student123");
  } catch (error: any) {
    console.error("❌ Seed failed:", error.message);
  }
}

export default seed;
