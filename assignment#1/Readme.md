# Assignment 1

# NODE_ENV=staging environment
http - port	: 13000
https - port	: 13001

# NODE_ENV=production environment
http - port	: 15000
https - port	: 15001

Endpoint	:/hello
QueryString	:name=<your name>

Response	: application/json
{
  "message": "Hello World!",
  "welcome": "Welcome <your name> to NodeJS World"
}

