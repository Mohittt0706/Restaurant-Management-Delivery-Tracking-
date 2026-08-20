const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const { calculateTotal } = require('../src/utils/calculateTotal');
const { generateInvoiceNumber } = require('../src/utils/generateInvoice');

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cult.local' },
    update: {},
    create: {
      name: 'CULT Admin',
      email: 'admin@cult.local',
      phone: '9000000001',
      passwordHash: await bcrypt.hash('Admin@123', 12),
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@cult.local' },
    update: {},
    create: {
      name: 'Aarav Shah',
      email: 'customer@cult.local',
      phone: '9104588800',
      passwordHash: await bcrypt.hash('Customer@123', 12),
      role: 'CUSTOMER',
    },
  });

  const categoryNames = ['Starters', 'Main Course', 'Desserts', 'Beverages'];
  const categories = {};
  for (const name of categoryNames) {
    categories[name] = await prisma.menuCategory.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} at CULT` },
    });
  }

  const menuItems = [
    { name: 'Truffle Mushroom Risotto', price: 24, category: 'Starters', veg: true, spice: 1, img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=600&q=80' },
    { name: 'Crispy Calamari', price: 18, category: 'Starters', veg: false, spice: 2, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Charred Broccoli', price: 14, category: 'Starters', veg: true, spice: 0, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80' },
    { name: 'Smoked Lamb Chops', price: 32, category: 'Main Course', veg: false, spice: 3, img: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80' },
    { name: 'Pesto Pasta', price: 21, category: 'Main Course', veg: true, spice: 1, img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80' },
    { name: 'Grilled Salmon', price: 28, category: 'Main Course', veg: false, spice: 2, img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80' },
    { name: 'Molten Lava Cake', price: 12, category: 'Desserts', veg: true, spice: 0, img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=600&q=80' },
    { name: 'Basque Cheesecake', price: 11, category: 'Desserts', veg: true, spice: 0, img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80' },
    { name: 'Espresso Martini', price: 15, category: 'Beverages', veg: true, spice: 0, img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80' },
    { name: 'Cold Brew Coffee', price: 8, category: 'Beverages', veg: true, spice: 0, img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80' },
  ];

  const items = {};
  for (const m of menuItems) {
    items[m.name] = await prisma.menuItem.upsert({
      where: { id: `seed-${m.name.replace(/\s+/g, '-').toLowerCase()}` },
      update: {},
      create: {
        id: `seed-${m.name.replace(/\s+/g, '-').toLowerCase()}`,
        name: m.name,
        description: `A signature ${m.category.toLowerCase()} crafted at CULT.`,
        price: m.price,
        categoryId: categories[m.category].id,
        image: m.img,
        isAvailable: true,
        isVeg: m.veg,
        spiceLevel: m.spice,
      },
    });
  }

  const partners = [];
  for (const [name, phone, vehicle] of [
    ['Rohan Mehta', '9800012345', 'Honda Activa'],
    ['Sneha Iyer', '9800067890', 'TVS Jupiter'],
  ]) {
    partners.push(
      await prisma.deliveryPartner.upsert({
        where: { phone },
        update: {},
        create: { name, phone, vehicle },
      }),
    );
  }

  const existingOrders = await prisma.order.count();
  if (existingOrders > 0) {
    console.log('Seed: orders already exist, skipping order seeding.');
  } else {
    const now = new Date();
    const today = new Date(now.setHours(10, 30, 0, 0));
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const orderDefs = [
      {
        customer, when: yesterday, status: 'PENDING', paymentMethod: 'RAZORPAY', paymentStatus: 'PENDING',
        lines: [['Truffle Mushroom Risotto', 1], ['Cold Brew Coffee', 2]],
      },
      {
        customer, when: yesterday, status: 'PREPARING', paymentMethod: 'COD', paymentStatus: 'COD',
        lines: [['Smoked Lamb Chops', 1], ['Pesto Pasta', 1]],
      },
      {
        customer, when: today, status: 'READY', paymentMethod: 'RAZORPAY', paymentStatus: 'PENDING',
        lines: [['Crispy Calamari', 2]],
      },
      {
        customer, when: today, status: 'ASSIGNED', paymentMethod: 'COD', paymentStatus: 'COD', partner: partners[0],
        lines: [['Grilled Salmon', 1], ['Basque Cheesecake', 1]],
      },
      {
        customer, when: today, status: 'OUT_FOR_DELIVERY', paymentMethod: 'RAZORPAY', paymentStatus: 'PENDING', partner: partners[1],
        lines: [['Pesto Pasta', 2], ['Espresso Martini', 1]],
      },
      {
        customer, when: today, status: 'DELIVERED', paymentMethod: 'RAZORPAY', paymentStatus: 'PAID', partner: partners[0], delivered: true,
        lines: [['Truffle Mushroom Risotto', 2], ['Molten Lava Cake', 2], ['Cold Brew Coffee', 2]],
      },
    ];

    for (const def of orderDefs) {
      const lineSubtotal = def.lines.reduce((sum, [name, qty]) => sum + items[name].price.toNumber() * qty, 0);
      const totals = calculateTotal(lineSubtotal, { deliveryFee: 3 });

      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          customerId: def.customer.id,
          status: def.status,
          paymentStatus: def.paymentStatus,
          paymentMethod: def.paymentMethod,
          subtotal: totals.subtotal,
          tax: totals.tax,
          deliveryFee: totals.deliveryFee,
          total: totals.total,
          specialInstructions: 'No onions, please.',
          deliveryAddress: '42 Ritual Lane, Mumbai',
          createdAt: def.when,
          items: {
            create: def.lines.map(([name, qty]) => ({
              menuItemId: items[name].id,
              name,
              price: items[name].price,
              quantity: qty,
            })),
          },
        },
      });

      if (def.paymentMethod === 'RAZORPAY') {
        await prisma.payment.create({
          data: {
            orderId: order.id,
            method: 'RAZORPAY',
            status: def.paymentStatus,
            amount: totals.total,
            razorpayPaymentId: def.paymentStatus === 'PAID' ? `pay_test_${Math.random().toString(36).slice(2, 12)}` : null,
            razorpayOrderId: `order_test_${Math.random().toString(36).slice(2, 12)}`,
          },
        });
      } else {
        await prisma.payment.create({
          data: { orderId: order.id, method: 'COD', status: 'COD', amount: totals.total },
        });
      }

      if (def.status === 'DELIVERED') {
        await prisma.invoice.create({
          data: {
            invoiceNumber: generateInvoiceNumber(),
            orderId: order.id,
            customerId: def.customer.id,
            subtotal: totals.subtotal,
            tax: totals.tax,
            total: totals.total,
          },
        });
      }

      if (def.partner) {
        const assignment = await prisma.deliveryAssignment.create({
          data: {
            orderId: order.id,
            partnerId: def.partner.id,
            status: def.status === 'DELIVERED' ? 'DELIVERED' : def.status,
            deliveredAt: def.delivered ? new Date(def.when.getTime() + 45 * 60000) : null,
          },
        });
        if (def.status === 'DELIVERED') {
          await prisma.deliveryPartner.update({
            where: { id: def.partner.id },
            data: { status: 'AVAILABLE' },
          });
        } else {
          await prisma.deliveryPartner.update({
            where: { id: def.partner.id },
            data: { status: 'BUSY' },
          });
        }
      }
    }
  }

  console.log(`Seed complete. Admin: ${admin.email} (Admin@123), orders: ${existingOrders}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());