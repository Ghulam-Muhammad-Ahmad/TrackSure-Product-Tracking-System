// const { PrismaClient } = require('../src/generated/prisma');
// const prisma = new PrismaClient();

// async function main() {
//   // Create Tenant "admin" if not exists
//   let adminTenant = await prisma.tenants.findFirst({
//     where: { tenant_name: 'admin' },
//   });

//   if (!adminTenant) {
//     adminTenant = await prisma.tenants.create({
//       data: {
//         tenant_name: 'admin',
//       },
//     });
//   }

//   // Create Admin Role if not exists
//   let adminRole = await prisma.roles.findFirst({
//     where: { role_name: 'Admin' },
//   });

//   if (!adminRole) {
//     adminRole = await prisma.roles.create({
//       data: {
//         role_name: 'Admin',
//         permissions: [
//           'PRODUCT_CREATE',
//           'PRODUCT_READ',
//           'PRODUCT_UPDATE',
//           'PRODUCT_DELETE',
        
//           'PRODUCT_STATUS_CREATE',
//           'PRODUCT_STATUS_READ',
//           'PRODUCT_STATUS_UPDATE',
//           'PRODUCT_STATUS_DELETE',
        
//           'CATEGORY_CREATE',
//           'CATEGORY_READ',
//           'CATEGORY_UPDATE',
//           'CATEGORY_DELETE',
        
//           'ROLE_CREATE',
//           'ROLE_READ',
//           'ROLE_UPDATE',
//           'ROLE_DELETE',
        
//           'USER_CREATE',
//           'USER_READ',
//           'USER_UPDATE',
//           'USER_DELETE',
//         ],        
//       },
//     });
//   }

//   // Create Admin User (using upsert because username is unique) and link to admin tenant
//   await prisma.users.upsert({
//     where: { username: 'admin' },
//     update: {},
//     create: {
//       username: 'admin',
//       password_hash: 'password', // Replace with a hashed password in production!
//       email: 'admin@example.com',
//       location: 'Admin Location',
//       role_id: adminRole.role_id,
//       tenant_id: adminTenant.tenant_id, // Link to admin tenant
//       created_by: null,
//       first_name: 'Admin',
//       last_name: 'User',
//       phone_number: '1234567890',
//     },
//   });

//   console.log('Seeding done.');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
