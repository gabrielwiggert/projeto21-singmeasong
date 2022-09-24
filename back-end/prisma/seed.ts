import { prisma } from "../src/database.js";

async function main() {

    await prisma.recommendation.createMany({
      data: [
        {
          name: "Falamansa - Xote dos Milagres",
          youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        },
        {
          name: "Rick Astley - Never Gonna Give You Up",
          youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        }
      ],
      skipDuplicates: true,
    });
  }

main().catch((e) => {
    console.log(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
