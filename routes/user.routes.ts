import { Router } from 'express';
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import verifyToken from '../middlewares/verify_jwt';
import prisma from '../db/prisma';
import { randomUUID, UUID } from 'crypto';

const user = Router();

async function checkUserExists(emailToBeChecked: string ) {
  const doesUserExist = await prisma.user.findFirst({where: {email: emailToBeChecked}})
  return doesUserExist ? true : false;
}


user.post('/register', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!await checkUserExists(req.body.email)) {
    const encryptedPassword = await bcryptjs.hash(password, 10)
    await prisma.user.create({data: {id: randomUUID(), password: encryptedPassword, email: req.body.email}})
    return res.status(200).json("User created successfully")
  }
  return res.status(400).json("Email already exists")
})

user.post('/login', async (req, res) => {
  if (await checkUserExists(req.body.email)) {
    const token = jwt.sign({email: req.body.email, exp: Math.floor(Date.now() / 1000) + (300 * 10)}, 'secret')
    await prisma.tokenApiKey.create({data: {token: token, amount: 100}})
    return res.status(200).json(token);
  }
  return res.status(401).json("Invalid account");
})


export default user;