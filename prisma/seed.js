const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const hashedPassword = bcrypt.hashSync('123456', 10); // ใช้ bcrypt เพื่อ hash รหัสผ่าน

const userData = [
  { 
    username: 'AndySmith', 
    firstname: 'Andy', 
    lastname: 'Smith', 
    age: 30, 
    phone: '0970687203', 
    address: '123 Main Street, City', 
    email: 'andy@ggg.mail', 
    password: hashedPassword 
  },
  { 
    username: 'BobbyJohnson', 
    firstname: 'Bobby', 
    lastname: 'Johnson', 
    age: 25, 
    phone: '0649129673', 
    address: '456 Elm Street, Town', 
    email: 'bobby@ggg.mail', 
    password: hashedPassword 
  },
  { 
    username: 'CandyWilliams', 
    firstname: 'Candy', 
    lastname: 'Williams', 
    age: 35, 
    phone: '0611214879', 
    address: '789 Oak Street, Village', 
    email: 'candy@ggg.mail', 
    password: hashedPassword 
  },
];

const run = async () => {
  await prisma.user.createMany({
    data : userData
  })
}

run()
