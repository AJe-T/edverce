const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Frontend Development" },
        { name: "Backend Development" },
        { name: "Fullstack Development" },
        { name: "Mobile Development" },
        { name: "UI/UX Design" },
        { name: "Data Science" },
        { name: "MERN Stack Development" },
      ]
    });

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();