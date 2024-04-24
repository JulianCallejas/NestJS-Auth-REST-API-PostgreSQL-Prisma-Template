import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';


const prisma = new PrismaClient();

async function main() {
    
    const bcpass = bcryptjs.hashSync('123456', 10);

    await prisma.user.deleteMany();
    
    const newUsers = await prisma.user.createMany({
        data: [
            { 
                name: 'Admin Name',
                email: 'p1@correo.com',
                password: bcpass,
                role: 'admin',
             },
            { 
                name: 'User Name',
                email: 'p2@correo.com',
                password: bcpass,
             },
        ],
    });

    console.log(newUsers);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
