const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const DAYS_AGO = (days, hour = 10, minute = 30) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d;
};

async function main() {
  console.log('Seeding roles (users)');
  const passwordHash = await bcrypt.hash('password123', 10);

  const users = {};
  const roleUsers = [
    { key: 'customer', name: 'Alex Customer', email: 'customer@cult.com', phone: '+1234567890', role: 'CUSTOMER' },
    { key: 'manager', name: 'Sarah Manager', email: 'manager@cult.com', phone: '+1234567891', role: 'MANAGER' },
    { key: 'kitchen', name: 'Gordon Chef', email: 'kitchen@cult.com', phone: '+1234567892', role: 'KITCHEN' },
    { key: 'delivery1', name: 'Speedy Delivery', email: 'delivery@cult.com', phone: '+1234567893', role: 'DELIVERY' },
    { key: 'delivery2', name: 'Rider Rani', email: 'delivery2@cult.com', phone: '+1234567894', role: 'DELIVERY' },
  ];

  for (const u of roleUsers) {
    users[u.key] = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, phone: u.phone, role: u.role, isActive: true },
      create: {
        name: u.name,
        email: u.email,
        passwordHash,
        phone: u.phone,
        role: u.role,
      },
    });
  }

  console.log('Seeding categories');
  const cat = {};
  const categories = [
    { key: 'starters', name: 'Starters', description: 'Handcrafted appetizers to ignite your palate', image: '/assets/images/dish-1.jpg' },
    { key: 'mains', name: 'Mains', description: 'Signature flame-grilled and wood-fired delicacies', image: '/assets/images/dish-2.jpg' },
    { key: 'desserts', name: 'Desserts', description: 'Decadent sweet endings', image: '/assets/images/dish-3.jpg' },
  ];
  for (const c of categories) {
    cat[c.key] = await prisma.category.upsert({
      where: { name: c.name },
      update: { description: c.description, image: c.image },
      create: { name: c.name, description: c.description, image: c.image },
    });
  }

  console.log('Seeding menu items');
  const menu = {};
  const menuItems = [
    { key: 'wings', categoryId: cat.starters.id, name: 'Truffle Flame Wings', shortDescription: 'Crispy wings coated in dark truffle glaze', description: 'Double-fried chicken wings tossed in black truffle butter, smoked chili glaze, and garlic chips.', price: 18.5, prep: 15, image: '/assets/images/dish-1.jpg' },
    { key: 'burrata', categoryId: cat.starters.id, name: 'Charred Burrata', shortDescription: 'Wood-fired burrata with balsamic reduction', description: 'Fresh Italian burrata lightly seared, served with heirloom cherry tomatoes, roasted garlic, and sourdough.', price: 16.0, prep: 12, image: '/assets/images/dish-4.jpg' },
    { key: 'ribeye', categoryId: cat.mains.id, name: 'Cult Dry-Aged Ribeye', shortDescription: '45-day dry-aged beef with bone marrow butter', description: '14oz Prime ribeye, wood-grilled over oak charcoal, finished with bone marrow jus and sea salt.', price: 48.0, prep: 25, image: '/assets/images/hero-bg.jpg' },
    { key: 'tagliatelle', categoryId: cat.mains.id, name: 'Smoked Salmon Tagliatelle', shortDescription: 'Handmade pasta with dill cream and pink pepper', description: 'Fresh egg tagliatelle, house-smoked Atlantic salmon, capers, Meyer lemon zest, and velvety cream.', price: 28.0, prep: 20, image: '/assets/images/dish-2.jpg' },
    { key: 'lava', categoryId: cat.desserts.id, name: 'Dark Chocolate Lava Cake', shortDescription: 'Molten Valrhona chocolate with bourbon vanilla ice cream', description: 'Rich 70% dark chocolate sponge with a warm flowing center, served with house-spun bourbon ice cream.', price: 14.0, prep: 15, image: '/assets/images/dish-3.jpg' },
  ];
  for (const m of menuItems) {
    menu[m.key] = await prisma.menuItem.upsert({
      where: { id: `seed-${m.key}` },
      update: { name: m.name, categoryId: m.categoryId, price: m.price, availability: true, preparationTime: m.prep, image: m.image },
      create: {
        id: `seed-${m.key}`,
        categoryId: m.categoryId,
        name: m.name,
        shortDescription: m.shortDescription,
        description: m.description,
        price: m.price,
        availability: true,
        preparationTime: m.prep,
        image: m.image,
      },
    });
  }

  console.log('Seeding inventory');
  const inventory = [
    { name: 'Prime Ribeye Steaks', unit: 'kg', currentStock: 25, lowStockThreshold: 5 },
    { name: 'Atlantic Salmon', unit: 'kg', currentStock: 12, lowStockThreshold: 3 },
    { name: 'Truffle Oil', unit: 'liters', currentStock: 2.5, lowStockThreshold: 1 },
    { name: 'Fresh Burrata', unit: 'pieces', currentStock: 4, lowStockThreshold: 5 },
    { name: 'Heavy Cream', unit: 'liters', currentStock: 8, lowStockThreshold: 3 },
  ];
  for (const inv of inventory) {
    await prisma.inventoryItem.upsert({
      where: { id: `seed-inv-${inv.name.replace(/\s+/g, '-').toLowerCase()}` },
      update: { unit: inv.unit, currentStock: inv.currentStock, lowStockThreshold: inv.lowStockThreshold, isActive: true },
      create: { id: `seed-inv-${inv.name.replace(/\s+/g, '-').toLowerCase()}`, name: inv.name, unit: inv.unit, currentStock: inv.currentStock, lowStockThreshold: inv.lowStockThreshold },
    });
  }

  const existingOrders = await prisma.order.count();
  if (existingOrders > 0) {
    console.log(`Seed: ${existingOrders} orders already exist, skipping order seeding.`);
    return;
  }

  console.log('Seeding orders');
  const line = (key, qty, notes) => ({ menuItemId: menu[key].id, price: menu[key].price, quantity: qty, notes });

  const orderDefs = [
    {
      status: 'CONFIRMED', when: DAYS_AGO(2, 12), method: 'RAZORPAY', pay: 'PENDING',
      lines: [line('wings', 2), line('lava', 1)],
      notes: 'Extra crispy wings, please.', address: '42 Ritual Lane, Mumbai',
    },
    {
      status: 'PREPARING', when: DAYS_AGO(1, 13), method: 'COD', pay: 'PENDING',
      lines: [line('ribeye', 1), line('tagliatelle', 1)],
      notes: 'Medium rare ribeye.', address: '77 Ember Street, Mumbai',
    },
    {
      status: 'READY', when: DAYS_AGO(0, 9), method: 'RAZORPAY', pay: 'PENDING',
      lines: [line('burrata', 2)],
      notes: '', address: '10 Gold Avenue, Mumbai',
    },
    {
      status: 'ASSIGNED', when: DAYS_AGO(0, 9, 30), method: 'COD', pay: 'PENDING', partner: 'delivery1',
      lines: [line('tagliatelle', 2), line('lava', 2)],
      notes: 'No onions.', address: '5 Flame Road, Mumbai',
    },
    {
      status: 'OUT_FOR_DELIVERY', when: DAYS_AGO(0, 10), method: 'RAZORPAY', pay: 'PENDING', partner: 'delivery2',
      lines: [line('wings', 1), line('ribeye', 1)],
      notes: '', address: '22 Cinder Lane, Mumbai',
    },
    {
      status: 'DELIVERED', when: DAYS_AGO(0, 8), method: 'RAZORPAY', pay: 'PAID', partner: 'delivery1', delivered: true,
      lines: [line('burrata', 1), line('ribeye', 1), line('lava', 1)],
      notes: 'Leave at concierge.', address: '100 Charcoal Heights, Mumbai',
    },
  ];

  for (const def of orderDefs) {
    const subtotal = def.lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const deliveryFee = 30.0;
    const total = Math.round((subtotal + tax + deliveryFee) * 100) / 100;

    const order = await prisma.order.create({
      data: {
        userId: users.customer.id,
        orderNumber: `CULT-${Math.floor(100000 + Math.random() * 900000)}`,
        status: def.status,
        totalAmount: total,
        addressText: def.address,
        paymentMethod: def.method,
        paymentStatus: def.pay,
        notes: def.notes,
        createdAt: def.when,
        items: { create: def.lines.map((l) => ({ menuItemId: l.menuItemId, price: l.price, quantity: l.quantity, notes: l.notes })) },
        statusHistory: { create: { status: def.status, changedByUserId: users.customer.id } },
      },
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        method: def.method,
        amount: total,
        status: def.pay === 'PAID' ? 'PAID' : 'PENDING',
        provider: def.method === 'RAZORPAY' ? 'RAZORPAY' : null,
        transactionId: def.pay === 'PAID' ? `pay_test_${Math.random().toString(36).slice(2, 12)}` : null,
      },
    });

    if (def.delivered) {
      await prisma.invoice.create({
        data: {
          orderId: order.id,
          invoiceNumber: `INV-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
          subtotal,
          tax,
          deliveryFee,
          totalAmount: total,
        },
      });
    }

    if (def.partner) {
      const delivery = await prisma.delivery.create({
        data: {
          orderId: order.id,
          deliveryPartnerId: users[def.partner].id,
          status: def.status === 'DELIVERED' ? 'DELIVERED' : def.status,
          assignedAt: def.when,
          acceptedAt: def.status === 'DELIVERED' || def.status === 'OUT_FOR_DELIVERY' ? DAYS_AGO(0, 8, 15) : null,
          pickedUpAt: def.status === 'DELIVERED' || def.status === 'OUT_FOR_DELIVERY' ? DAYS_AGO(0, 8, 30) : null,
          outForDeliveryAt: def.status === 'DELIVERED' ? DAYS_AGO(0, 8, 45) : null,
          deliveredAt: def.delivered ? DAYS_AGO(0, 9, 15) : null,
          estimatedDistance: 3.8,
          estimatedDuration: 15,
        },
      });
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });