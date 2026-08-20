const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding roles (users)...');
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

  console.log('Cleaning up legacy menu & category items...');
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.category.deleteMany({});

  console.log('Seeding Punjabi Cuisine categories...');
  const cat = {};
  const categories = [
    { key: 'starters', name: 'Starters & Tandoor', description: 'Clay-oven charcoal roasted delicacies and authentic Punjabi appetizers', image: '/assets/images/punjabi-paneer-tikka.jpg' },
    { key: 'mains', name: 'Royal Punjabi Mains', description: 'Rich, slow-cooked gravies infused with white butter and aromatic spices', image: '/assets/images/punjabi-butter-chicken.jpg' },
    { key: 'breads', name: 'Tandoori Breads & Rice', description: 'Crispy tandoori kulchas, flaky parathas, garlic naans and aromatic rice', image: '/assets/images/amritsari-kulcha.jpg' },
    { key: 'sweets', name: 'Desserts & Lassi', description: 'Traditional Punjabi sweets, saffron phirni, and thick churned lassi', image: '/assets/images/punjabi-gulab-jamun.jpg' },
  ];

  for (const c of categories) {
    cat[c.key] = await prisma.category.create({
      data: { name: c.name, description: c.description, image: c.image },
    });
  }

  console.log('Seeding Punjabi menu items...');
  const menuItems = [
    {
      id: 'seed-paneer-tikka',
      categoryId: cat.starters.id,
      name: 'Amritsari Paneer Tikka',
      shortDescription: 'Tandoor charred cottage cheese with yellow chili marinade',
      description: 'Fresh malai paneer cubes marinated in hung curd, yellow chili, carom seeds, and mustard oil, roasted golden over charcoal.',
      price: 340.0,
      prep: 15,
      image: '/assets/images/punjabi-paneer-tikka.jpg',
    },
    {
      id: 'seed-tandoori-murgh',
      categoryId: cat.starters.id,
      name: 'Tandoori Murgh (Charcoal Roasted)',
      shortDescription: 'Classic spicy marinated roasted chicken',
      description: 'Whole chicken marinated overnight in Kashmiri chili, mustard oil, and ground spices, charred over open charcoal bhatti.',
      price: 420.0,
      prep: 20,
      image: '/assets/images/dish-1.jpg',
    },
    {
      id: 'seed-dahi-kebab',
      categoryId: cat.starters.id,
      name: 'Dahi Ke Kebab',
      shortDescription: 'Pan-fried velvety hung curd patties with cardamom',
      description: 'Silky hung yogurt patties stuffed with green chilies, coriander, and subtle spices, shallow fried crisp.',
      price: 310.0,
      prep: 12,
      image: '/assets/images/punjabi-dahi-ke-kebab.jpg',
    },
    {
      id: 'seed-butter-chicken',
      categoryId: cat.mains.id,
      name: 'Murgh Makhani (Butter Chicken)',
      shortDescription: 'Tender chicken in velvety tomato, butter & cream gravy',
      description: 'Charcoal-grilled chicken tikka simmered in a silky tomato, cashew, and white butter gravy finished with kasuri methi.',
      price: 480.0,
      prep: 20,
      image: '/assets/images/punjabi-butter-chicken.jpg',
    },
    {
      id: 'seed-dal-makhani',
      categoryId: cat.mains.id,
      name: 'Dal Makhani (Slow-Cooked Overnight)',
      shortDescription: 'Overnight slow-cooked black lentils with white butter',
      description: 'Black lentils and red kidney beans slow-simmered for 16 hours with cream, white butter, and aromatic spices.',
      price: 360.0,
      prep: 25,
      image: '/assets/images/punjabi-dal-makhani.jpg',
    },
    {
      id: 'seed-paneer-butter-masala',
      categoryId: cat.mains.id,
      name: 'Paneer Butter Masala',
      shortDescription: 'Cottage cheese in rich sweet tomato gravy',
      description: 'Soft cottage cheese cubes cooked in a rich, mildly sweet tomato cashew gravy topped with fresh cream.',
      price: 390.0,
      prep: 15,
      image: '/assets/images/punjabi-paneer-butter-masala.jpg',
    },
    {
      id: 'seed-pindi-chole',
      categoryId: cat.mains.id,
      name: 'Authentic Pindi Chole',
      shortDescription: 'Rawalpindi style dark spiced chickpea curry',
      description: 'Chickpeas cooked with dark roasted spices, dried pomegranate seeds, amla, and slit green chilies.',
      price: 320.0,
      prep: 18,
      image: '/assets/images/amritsari-kulcha.jpg',
    },
    {
      id: 'seed-rarha-gosht',
      categoryId: cat.mains.id,
      name: 'Punjabi Rarha Mutton Curry',
      shortDescription: 'Mutton pieces & minced lamb in rich onion-tomato gravy',
      description: 'Succulent mutton pieces cooked together with spiced minced lamb in a thick, roasted onion bhuna masala gravy.',
      price: 560.0,
      prep: 25,
      image: '/assets/images/punjabi-rarha-mutton.jpg',
    },
    {
      id: 'seed-amritsari-kulcha',
      categoryId: cat.breads.id,
      name: 'Amritsari Stuffed Kulcha',
      shortDescription: 'Wood-fired stuffed crispy naan with white butter',
      description: 'Stuffed potato and paneer leavened bread baked crisp in tandoor, topped with melting white butter and served with chole.',
      price: 180.0,
      prep: 12,
      image: '/assets/images/amritsari-kulcha.jpg',
    },
    {
      id: 'seed-butter-naan',
      categoryId: cat.breads.id,
      name: 'Butter Garlic Naan',
      shortDescription: 'Fluffy tandoori naan brushed with garlic butter',
      description: 'Soft tandoori leavened flatbread brushed with roasted garlic butter and chopped fresh coriander.',
      price: 90.0,
      prep: 8,
      image: '/assets/images/punjabi-butter-garlic-naan.jpg',
    },
    {
      id: 'seed-lachha-paratha',
      categoryId: cat.breads.id,
      name: 'Lachha Paratha',
      shortDescription: 'Multi-layered flaky tandoori paratha with ghee',
      description: 'Multi-layered whole-wheat bread baked crisp in clay oven and brushed with desi ghee.',
      price: 80.0,
      prep: 8,
      image: '/assets/images/punjabi-butter-garlic-naan.jpg',
    },
    {
      id: 'seed-mango-lassi',
      categoryId: cat.sweets.id,
      name: 'Amritsari Sweet Mango Lassi',
      shortDescription: 'Thick churned curd blended with mango and malai',
      description: 'Rich churned yogurt blended with sweet Alphonso mango pulp, topped with fresh malai and crushed pistachios.',
      price: 140.0,
      prep: 5,
      image: '/assets/images/punjabi-mango-lassi.jpg',
    },
    {
      id: 'seed-gulab-jamun',
      categoryId: cat.sweets.id,
      name: 'Gulab Jamun with Shahi Rabri',
      shortDescription: 'Warm khoya dumplings served with chilled rabri',
      description: 'Soft milk-solid dumplings soaked in cardamom rose syrup, served warm alongside thickened chilled saffron rabri.',
      price: 180.0,
      prep: 5,
      image: '/assets/images/punjabi-gulab-jamun.jpg',
    },
  ];

  for (const m of menuItems) {
    await prisma.menuItem.create({
      data: {
        id: m.id,
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

  console.log('Seeding Punjabi inventory items...');
  const inventory = [
    { name: 'Paneer (Cottage Cheese)', unit: 'kg', currentStock: 35, lowStockThreshold: 8 },
    { name: 'Fresh Chicken', unit: 'kg', currentStock: 40, lowStockThreshold: 10 },
    { name: 'Mutton & Lamb Mince', unit: 'kg', currentStock: 20, lowStockThreshold: 5 },
    { name: 'Desi Ghee & White Butter', unit: 'kg', currentStock: 25, lowStockThreshold: 5 },
    { name: 'Black Lentils & Kidney Beans', unit: 'kg', currentStock: 50, lowStockThreshold: 10 },
    { name: 'Heavy Cream', unit: 'liters', currentStock: 15, lowStockThreshold: 4 },
  ];
  for (const inv of inventory) {
    await prisma.inventoryItem.upsert({
      where: { id: `seed-inv-${inv.name.replace(/\s+/g, '-').toLowerCase()}` },
      update: { unit: inv.unit, currentStock: inv.currentStock, lowStockThreshold: inv.lowStockThreshold, isActive: true },
      create: { id: `seed-inv-${inv.name.replace(/\s+/g, '-').toLowerCase()}`, name: inv.name, unit: inv.unit, currentStock: inv.currentStock, lowStockThreshold: inv.lowStockThreshold },
    });
  }

  console.log('🎉 Punjabi Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });