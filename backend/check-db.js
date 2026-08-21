const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tables = await prisma.$queryRawUnsafe(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
  );
  console.log('Existing tables:');
  tables.forEach(t => console.log(' -', t.table_name));

  const enums = await prisma.$queryRawUnsafe(
    "SELECT t.typname AS enum_name FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid GROUP BY t.typname"
  );
  console.log('\nExisting enums:');
  enums.forEach(e => console.log(' -', e.enum_name));

  const columns = await prisma.$queryRawUnsafe(
    "SELECT table_name, column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position"
  );
  console.log('\nExisting columns:');
  columns.forEach(c => console.log(` - ${c.table_name}.${c.column_name} (${c.data_type}, nullable=${c.is_nullable})`));
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); return prisma.$disconnect(); });
