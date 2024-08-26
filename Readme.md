# Simple TODOApi

This app is made for education purpose of myself lol. Don't judge too hard i'm learning.

## How it works
First you login, with http request post method to '/user/register'. Then you can log in with 'user/login/'. It will return a jwt token back.
This token is bound to your email, and the tasks you create will only be accessible to that token. So you can have a token but wont be able to access other user tasks. 

The password is encryped using `bryptjs` module. 

### Rest of methods
`/todo/:userID` Post method to create a task. It requires a token, the userID, the name of the task, and the descripton. You can specify filtering, and pagering with the filter, page, limit querys.


`/todo/:userID` Get method returns all tasks for the user, requires userID as a parameter and the token as the body of the request.


`/todo/:userID:id` Put method, requires the userID, the ID of the task, and the tokens as the body of the request.


`/todo/:userID/:id` Delete method, requires the userID, the ID of the task, and the tokens as the body of the request.


`/todo/:id` Get method requires the userID, the ID of the task, and the tokens as the body. Returns the task with the given ID.
