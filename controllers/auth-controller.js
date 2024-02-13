const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.register = async (req, res, next) => {
  const { username, firstname, lastname, age, phone, address, email, password, confirmPassword } = req.body;
  try {
    // Validation
    if (!(username && firstname && lastname && age && phone && address && email && password && confirmPassword )) {
      throw new Error("Please fill in all fields");
    }
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Create user in the database
    const user = await prisma.user.create({
        data: {
            username,
            firstname,
            lastname,
            age,
            phone,
            address,
            email,
            password: hashedPassword,
          },
        });

    res.json({ msg: 'Registration successful' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // validation
    if (!(email && password)) {
      throw new Error('Email and password must be provided');
    }

    // find user in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      throw new Error('User not found');
    }

    // check password
    const pwOk = await bcrypt.compare(password, user.password);
    if (!pwOk) {
      throw new Error('Invalid login credentials');
    }

    // issue jwt token
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};
exports.getme = async(req, res, next) => {
    try {
        const userId = req.user.id;
        console.log('userId22', userId);
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        console.log('user11', user);
        delete user.password;
        console.log('user22', user);
        if (!user) {
            throw new Error('User not found');
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
  };