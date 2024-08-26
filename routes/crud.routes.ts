import {Router} from 'express';
import verifyToken from '../middlewares/verify_jwt';
import prisma from '../db/prisma';
import { randomUUID } from 'crypto';
import { Todo } from '@prisma/client';
import { connect } from 'http2';
import user from './user.routes';
import { todo } from 'node:test';
import { parse } from 'path';



const crud = Router();



crud.get('/:userID', verifyToken, async (req, res) => {
  let pages: number = parseInt(req.query.limit as string) | 1;
  let limit: number = parseInt(req.query.limit as string) | 10;
  let filteringOption: string = (req.query.filter as string);
  let termsSearch = {where: {userID: req.params.userID}, skip: (pages - 1) * limit, take: limit }
  let optionsForFiltering: Array<string> = ['done', 'not-started', 'on-progress']
  

  if ( optionsForFiltering.includes(filteringOption) ) {
    const updatedOptions = {...termsSearch.where, status: filteringOption};
    termsSearch.where = updatedOptions;
  } 
  
  const todos: Array<Object> | [] = await prisma.todo.findMany(termsSearch);
  
  res.json({ 
    todos,
    "page": pages,
    "limit": limit,
    "total": todos.length,
  });
})

crud.get('/:userID/:id', verifyToken, async (req, res) => {
  const userID = req.body.userID;
  const todo: Object | null = await prisma.todo.findFirst({where: {id: req.params.id, userID: userID}});
  if (todo != null) {
    return res.status(200).json(todo);
  }
  return res.status(401).json("Not found");
})

crud.delete('/:userID/:id', verifyToken, async (req, res) => {
  try {
    await prisma.todo.delete({where: {id: req.params.id, userID: req.params.userID}});
    return res.status(200).json("succesfully deleted");
  } catch (error) {
    return res.status(401).json("Not found");
  }
})

crud.put('/:userID/:id', verifyToken, async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const status = req.body.status;
    const todo = await prisma.todo.findFirst({where: {id: req.params.id, userID: req.params.userID}});
    if (todo !==null) {
      if (name === null && description === null) {
        todo.status = status;
      } else if (name === null && status === null) {
        todo.description = description;
      } else if (description === null && status === null) {
        todo.name = name;
      } else {
        todo.name = name;
        todo.status = status;
        todo.description = description;
      }
      await prisma.todo.update({where: {id: req.params.id}, data: todo});
      res.status(200).json("Update completed successfully");
    }else {
      return res.status(401).json("Todo does not exist");
    }
  } catch (error) {
    res.status(500).json(error);
  }
})

crud.post('/:userID', verifyToken, async (req, res) => {
  if (req.body === null) {
    return res.status(401).json("Bad Request");
  }
  const name: string = req.body.name;
  const description: string = req.body.description;
  const userID: string = req.params.userID;
  let status: string = "not-started";

  try {
    await prisma.todo.create({data: {
      id: randomUUID(),
      name: name,
      description: description,
      status: status,
      user: {
        connect: {id: String(userID)}
      }
    }})
  } catch (error) {
    
  }
  
  return res.status(201).json("Todo created");
})  



export default crud;