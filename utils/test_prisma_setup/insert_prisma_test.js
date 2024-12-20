// Import Prisma Client
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client');


// Instantiate Prisma Client
const prisma = new PrismaClient();

async function main() {
  // Create a new user
  const newUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'John Doe',
      posts: {
        create: {
          title: 'First Post',
          content: 'This is my first post!',
          published: true,
        },
      },
    },
  });

  console.log('Created new user: ', newUser);
}

// Call the main function
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
