// Import Prisma Client
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client');


// Instantiate Prisma Client
const prisma = new PrismaClient();

async function main() {
  // Fetch all posts
  const allPosts = await prisma.post.findMany({
    include: {
      author: true, // Include related author data
    },
  });

  console.log('All posts: ', allPosts);
}

// Call the main function
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
