import bcrypt from "bcryptjs";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create 5 users with hashed passwords
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "alice@example.com",
        name: "Alice",
        password: await bcrypt.hash("password123", 10),
      },
    }),
    prisma.user.create({
      data: {
        email: "bob@example.com",
        name: "Bob",
        password: await bcrypt.hash("password123", 10),
      },
    }),
    prisma.user.create({
      data: {
        email: "charlie@example.com",
        name: "Charlie",
        password: await bcrypt.hash("password123", 10),
      },
    }),
    prisma.user.create({
      data: {
        email: "diana@example.com",
        name: "Diana",
        password: await bcrypt.hash("password123", 10),
      },
    }),
    prisma.user.create({
      data: {
        email: "edward@example.com",
        name: "Edward",
        password: await bcrypt.hash("password123", 10),
      },
    }),
  ]);

  const userIdMapping = {
    alice: users[0].id,
    bob: users[1].id,
    charlie: users[2].id,
    diana: users[3].id,
    edward: users[4].id,
  };

  // Create 15 posts distributed among users
  await prisma.post.createMany({
    data: [
      // Alice's posts
      {
        title: "Getting Started with TypeScript and Prisma",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id erat a lorem tincidunt ultricies. Vivamus porta bibendum nulla vel accumsan.",
        published: true,
        authorId: userIdMapping.alice,
      },
      {
        title: "How ORMs Simplify Complex Queries",
        content:
          "Duis sagittis urna ut sapien tristique convallis. Aenean vel ligula felis. Phasellus bibendum sem at elit dictum volutpat.",
        published: false,
        authorId: userIdMapping.alice,
      },

      // Bob's posts
      {
        title: "Mastering Prisma: Efficient Database Migrations",
        content:
          "Ut ullamcorper nec erat id auctor. Nullam nec ligula in ex feugiat tincidunt. Cras accumsan vehicula tortor ut eleifend.",
        published: true,
        authorId: userIdMapping.bob,
      },
      {
        title: "Best Practices for Type Safety in ORMs",
        content:
          "Aliquam erat volutpat. Suspendisse potenti. Maecenas fringilla elit vel eros laoreet, et tempor sapien vulputate.",
        published: true,
        authorId: userIdMapping.bob,
      },
      {
        title: "TypeScript Utility Types for Database Models",
        content:
          "Donec ac magna facilisis, vestibulum ligula at, elementum nisl. Morbi volutpat eget velit eu egestas.",
        published: false,
        authorId: userIdMapping.bob,
      },

      // Charlie's posts (no posts for Charlie)

      // Diana's posts
      {
        title: "Exploring Database Indexes and Their Performance Impact",
        content:
          "Vivamus ac velit tincidunt, sollicitudin erat quis, fringilla enim. Aenean posuere est a risus placerat suscipit.",
        published: true,
        authorId: userIdMapping.diana,
      },
      {
        title: "Choosing the Right Database for Your TypeScript Project",
        content:
          "Sed vel suscipit lorem. Duis et arcu consequat, sagittis justo quis, pellentesque risus. Curabitur sed consequat est.",
        published: false,
        authorId: userIdMapping.diana,
      },
      {
        title: "Designing Scalable Schemas with Prisma",
        content:
          "Phasellus ut erat nec elit ultricies egestas. Vestibulum rhoncus urna eget magna varius pharetra.",
        published: true,
        authorId: userIdMapping.diana,
      },
      {
        title: "Handling Relations Between Models in ORMs",
        content:
          "Integer luctus ac augue at tristique. Curabitur varius nisl vitae mi fringilla, vel tincidunt nunc dictum.",
        published: false,
        authorId: userIdMapping.diana,
      },

      // Edward's posts
      {
        title: "Why TypeORM Still Has Its Place in 2025",
        content:
          "Morbi non arcu nec velit cursus feugiat sit amet sit amet mi. Etiam porttitor ligula id sem molestie, in tempor arcu bibendum.",
        published: true,
        authorId: userIdMapping.edward,
      },
      {
        title: "NoSQL vs SQL: The Definitive Guide for Developers",
        content:
          "Suspendisse a ligula sit amet risus ullamcorper tincidunt. Curabitur tincidunt, sapien id fringilla auctor, risus libero gravida odio, nec volutpat libero orci nec lorem.",
        published: true,
        authorId: userIdMapping.edward,
      },
      {
        title: "Optimizing Queries with Prisma's Select and Include",
        content:
          "Proin vel diam vel nisi facilisis malesuada. Sed vitae diam nec magna mollis commodo a vitae nunc.",
        published: false,
        authorId: userIdMapping.edward,
      },
      {
        title: "PostgreSQL Optimizations Every Developer Should Know",
        content:
          "Nullam mollis quam sit amet lacus interdum, at suscipit libero pellentesque. Suspendisse in mi vitae magna finibus pretium.",
        published: true,
        authorId: userIdMapping.edward,
      },
      {
        title: "Scaling Applications with Partitioned Tables in PostgreSQL",
        content:
          "Cras vitae tortor in mauris tristique elementum non id ipsum. Nunc vitae pulvinar purus.",
        published: true,
        authorId: userIdMapping.edward,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
