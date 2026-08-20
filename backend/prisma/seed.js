const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Users for all 4 roles...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const customer = await prisma.user.create({
    data: {
      name: 'Alex Customer',
      email: 'customer@cult.com',
      passwordHash,
      phone: '+1234567890',
      role: 'CUSTOMER',
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: 'Sarah Manager',
      email: 'manager@cult.com',
      passwordHash,
      phone: '+1234567891',
      role: 'MANAGER',
    },
  });

  const kitchen = await prisma.user.create({
    data: {
      name: 'Gordon Chef',
      email: 'kitchen@cult.com',
      passwordHash,
      phone: '+1234567892',
      role: 'KITCHEN',
    },
  });

  const delivery = await prisma.user.create({
    data: {
      name: 'Speedy Delivery',
      email: 'delivery@cult.com',
      passwordHash,
      phone: '+1234567893',
      role: 'DELIVERY',
    },
  });

  console.log('Seeding Categories...');
  const starers = await prisma.category.create({
    data: {
      name: 'Starters',
      description: 'Handcrafted appetizers to ignite your palate',
      image: '/assets/images/dish-1.jpg',
    },
  });

  const mains = await prisma.category.create({
    data: {
      name: 'Mains',
      description: 'Signature flame-grilled and wood-fired delicacies',
      image: '/assets/images/dish-2.jpg',
    },
  });

  const desserts = await prisma.category.create({
    data: {
      name: 'Desserts',
      description: 'Decadent sweet endings',
      image: '/assets/images/dish-3.jpg',
    },
  });

  console.log('Seeding Menu Items...');
  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: starers.id,
        name: 'Truffle Flame Wings',
        shortDescription: 'Crispy wings coated in dark truffle glaze',
        description: 'Double-fried chicken wings tossed in black truffle butter, smoked chili glaze, and garlic chips.',
        price: 18.5,
        availability: true,
        preparationTime: 15,
        image: '/assets/images/dish-1.jpg',
      },
      {
        categoryId: starers.id,
        name: 'Charred Burrata',
        shortDescription: 'Wood-fired burrata with balsamic reduction',
        description: 'Fresh Italian burrata lightly seared, served with heirloom cherry tomatoes, roasted garlic, and sourdough.',
        price: 16.0,
        availability: true,
        preparationTime: 12,
        image: '/assets/images/dish-4.jpg',
      },
      {
        categoryId: mains.id,
        name: 'Cult Dry-Aged Ribeye',
        shortDescription: '45-day dry-aged beef with bone marrow butter',
        description: '14oz Prime ribeye, wood-grilled over oak charcoal, finished with bone marrow jus and sea salt.',
        price: 48.0,
        availability: true,
        preparationTime: 25,
        image: '/assets/images/hero-bg.jpg',
      },
      {
        categoryId: mains.id,
        name: 'Smoked Salmon Tagliatelle',
        shortDescription: 'Handmade pasta with dill cream and pink pepper',
        description: 'Fresh egg tagliatelle, house-smoked Atlantic salmon, capers, Meyer lemon zest, and velvety cream.',
        price: 28.0,
        availability: true,
        preparationTime: 20,
        image: '/assets/images/dish-2.jpg',
      },
      {
        categoryId: desserts.id,
        name: 'Dark Chocolate Lava Cake',
        shortDescription: 'Molten Valrhona chocolate with bourbon vanilla ice cream',
        description: 'Rich 70% dark chocolate sponge with a warm flowing center, served with house-spun bourbon ice cream.',
        price: 14.0,
        availability: true,
        preparationTime: 15,
        image: '/assets/images/dish-3.jpg',
      },
    ],
  });

  console.log('Seeding Inventory Items...');
  await prisma.inventoryItem.createMany({
    data: [
      { name: 'Prime Ribeye Steaks', unit: 'kg', currentStock: 25, lowStockThreshold: 5 },
      { name: 'Atlantic Salmon', unit: 'kg', currentStock: 12, lowStockThreshold: 3 },
      { name: 'Truffle Oil', unit: 'liters', currentStock: 2.5, lowStockThreshold: 1 },
      { name: 'Fresh Burrata', unit: 'pieces', currentStock: 4, lowStockThreshold: 5 }, // Low stock sample
      { name: 'Heavy Cream', unit: 'liters', currentStock: 15, lowStockThreshold: 4 },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
