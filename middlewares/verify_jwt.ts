import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma';

const verifyToken = async (req: any, res: Response, next: NextFunction) => {
  try{ 
    const token: any | null = req.body.token;
    const user: any = await prisma.user.findFirst({where: {id: req.params.userID}})
    if(!token) {
      return res.status(401).json("Invalid token");
    }
    
    const tokenDatabase: any = await prisma.tokenApiKey.findFirst({where: {token: token}})
    
    if(tokenDatabase == null) {
      return res.status(401).json("Token invalid");
    }
    
    jwt.verify(token, 'secret', async (err: any, decoded: any) => {
      if (err) {
        res.status(401).json("Invalid token")
      }
      req.user = decoded;
      if (tokenDatabase.amount <= 0) {
        await prisma.tokenApiKey.delete({where: {token: token}})
      }
      if (req.user.email !== user.email) {
        res.status(401).json("Access forbidden");
      }
      tokenDatabase.amount--;
      await prisma.tokenApiKey.update({where: {token: token}, data: tokenDatabase})
      next();
    })
  }catch (error) {
    res.status(400).json("Bad request")
  }
}

export default verifyToken;