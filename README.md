<h1 align="center" > NestJS Auth REST API Template </h1>

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
</p>

## Description

**`NestJS Auth REST API Template`** with JWT Authentication.

This **`NestJS Auth REST API Template`** is designed to jumpstart your development process with a robust user authentication system and protected routes. Built using Nest.js, Prisma, and Postgres, this template provides essential features such as user registration, login, JWT authentication, and a CRUD API for managing users. The API is also fully documented using Swagger for easy integration and understanding.

## Key Features

- User Registration: Allow users to create new accounts securely.

- Login and Authentication: Authenticate users using JWT tokens for secure access to protected routes.

- Protected Routes: Implement role-based access control to ensure that only authorized users can access specific endpoints.

- User CRUD Operations: Simplify user management with CRUD operations for creating, reading, updating, and deleting user data.

- Swagger Documentation: Comprehensive documentation with Swagger UI for easy API exploration and integration.

## Technologies Used

- Nest.js: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

- Prisma: Modern database toolkit for Node.js and TypeScript, providing type-safe database access and migrations.

- Postgres: Powerful open-source relational database system for storing and managing data securely.

- JWT: JSON Web Tokens for secure authentication and authorization.


## Getting Started

### 1. Clone the repository
### 2. Install dependencies
```bash
npm install
```
### 3. Update the .env file
See the `.env.template` file for more information

### 4. Start the DB container
Docker desktop must be open
```bash
docker compose up -d
```
### 5. Create DB tables
```bash
npx prisma migrate dev --name "Initial Schema"
```
### 6. Fill DB tables
Two users will be created. The first one as admin `p1@correo.com` and the second one as user `p2@correo.com`, same password for both `123456`.
```bash
npm run seed
```

### 7. Run the development server:

```bash
npm run dev
```

## Documentation

### Swagger

The API documentation is generated using Swagger, a powerful yet easy-to-use suite of API developer tools for teams and individuals, enabling development across the entire API lifecycle, from design and documentation, to test and deployment.
You can access a demo version of the Swagger documentation for this APY at the following link: [**`NestJS Auth REST API Template Swagger Documentation`**](https://juliancallejas.github.io/NestJS-Auth-REST-API-Template-SwaggerDoc/)

You can also access the Swagger documentation With the REST API running locally by visiting <a href="http://localhost:3000/api" >http://localhost:3000/api</a>.

### Postman

In addition to the Swagger documentation, we also provide a comprehensive Postman documentation for the **`NestJS Auth REST API`**.

Postman documentation collection is available at [**`NestJS Auth REST API Template Postman Documentation`**](https://www.postman.com/jc-develop/workspace/nest-auth-rest-apis/documentation/22997111-3a008800-dea9-4b27-b1bc-2a3ac5be1e33)

Please note that you'll need to have Postman installed on your machine to import and use the collection.

Our Postman documentation includes a collection of about **160 tests** that cover all the API endpoints. These tests serve as a valuable resource for understanding the expected request and response patterns and for validating the functionality of the API. This is the report for the last test run with 3 iterations: [**`NestJS Auth REST API Template PostgreSQL Prisma Tests`**](https://juliancallejas.github.io/NestJS-Auth-REST-API-Template-Postgres-Prisma-Test/)

You can access to the test collection at [**`NestJS Auth REST API Template Postman Test Collection`**](https://www.postman.com/jc-develop/workspace/nest-auth-rest-apis/documentation/22997111-7ae8198b-97f8-4e01-9830-77dd1e10088b)

## Contribution
Contributions are welcome! Feel free to fork this repository, make improvements, and submit pull requests to enhance the functionality or add new features.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For any issues or questions related to this API template, please open an issue on GitHub.

#### 🌟 You’re the superstar of our show! Thanks for lighting up our repository with your presence. We hope you enjoy exploring our code as much as we enjoyed writing it.