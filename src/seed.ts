import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('\n🌱 Starting database seed...');
  console.log('Creating test users and sample data...\n');

  const ownerPassword = await bcrypt.hash('owner123', 10);
  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      username: 'owner',
      email: 'owner@example.com',
      password: ownerPassword,
      role: 'OWNER',
      bio: 'I am the owner of this platform'
    }
  });
  console.log('✅ Created owner:', owner.username);

  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
      bio: 'I am an administrator'
    }
  });
  console.log('✅ Created admin:', admin.username);

  const userPassword = await bcrypt.hash('user123', 10);
  
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      username: 'alice',
      email: 'alice@example.com',
      password: userPassword,
      bio: 'Hello! I love coding and technology'
    }
  });
  console.log('✅ Created user:', alice.username);

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      username: 'bob',
      email: 'bob@example.com',
      password: userPassword,
      bio: 'Software developer and coffee enthusiast'
    }
  });
  console.log('✅ Created user:', bob.username);

  const charlie = await prisma.user.upsert({
    where: { email: 'charlie@example.com' },
    update: {},
    create: {
      username: 'charlie',
      email: 'charlie@example.com',
      password: userPassword,
      bio: 'Learning new things every day'
    }
  });
  console.log('✅ Created user:', charlie.username);

  const post1 = await prisma.post.create({
    data: {
      content: 'Just joined this amazing platform! Looking forward to connecting with everyone.',
      userId: alice.id
    }
  });

  const post2 = await prisma.post.create({
    data: {
      content: 'Working on a new TypeScript project. Any tips for best practices?',
      userId: bob.id
    }
  });

  const post3 = await prisma.post.create({
    data: {
      content: 'Beautiful day for coding! ☀️',
      userId: charlie.id
    }
  });

  console.log('✅ Created 3 posts');

  await prisma.activity.createMany({
    data: [
      {
        type: 'POST_CREATED',
        actorId: alice.id,
        postId: post1.id
      },
      {
        type: 'POST_CREATED',
        actorId: bob.id,
        postId: post2.id
      },
      {
        type: 'POST_CREATED',
        actorId: charlie.id,
        postId: post3.id
      }
    ]
  });

  await prisma.follow.create({
    data: {
      followerId: alice.id,
      followingId: bob.id
    }
  });

  await prisma.follow.create({
    data: {
      followerId: bob.id,
      followingId: charlie.id
    }
  });

  await prisma.follow.create({
    data: {
      followerId: charlie.id,
      followingId: alice.id
    }
  });

  console.log('✅ Created follow relationships');

  const like1 = await prisma.like.create({
    data: {
      userId: bob.id,
      postId: post1.id
    }
  });

  const like2 = await prisma.like.create({
    data: {
      userId: charlie.id,
      postId: post1.id
    }
  });

  const like3 = await prisma.like.create({
    data: {
      userId: alice.id,
      postId: post2.id
    }
  });

  console.log('✅ Created likes');

  await prisma.activity.createMany({
    data: [
      {
        type: 'POST_LIKED',
        actorId: bob.id,
        postId: post1.id,
        likeId: like1.id,
        metadata: { postAuthor: 'alice' }
      },
      {
        type: 'POST_LIKED',
        actorId: charlie.id,
        postId: post1.id,
        likeId: like2.id,
        metadata: { postAuthor: 'alice' }
      },
      {
        type: 'POST_LIKED',
        actorId: alice.id,
        postId: post2.id,
        likeId: like3.id,
        metadata: { postAuthor: 'bob' }
      }
    ]
  });

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('📋 Test Accounts:');
  console.log('─────────────────────────────────────');
  console.log('OWNER:');
  console.log('  Email: owner@example.com');
  console.log('  Password: owner123');
  console.log('\nADMIN:');
  console.log('  Email: admin@example.com');
  console.log('  Password: admin123');
  console.log('\nREGULAR USERS:');
  console.log('  Email: alice@example.com | Password: user123');
  console.log('  Email: bob@example.com | Password: user123');
  console.log('  Email: charlie@example.com | Password: user123');
  console.log('─────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    (process as any).exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
