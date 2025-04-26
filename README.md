# NestJS Restaurant Table Booking

A **NestJS-based application** designed to manage restaurant table booking efficiently. This project provides a scalable and modular backend implementation for managing restaurant tables, booking slots, and related operations.

## ✨ Features

- **Table Management**: Add, remove, and manage restaurant tables.
- **Booking System**: Book tables for specific time slots.
- **User Authentication**: JWT-based authentication using the Passport strategy.
- **API Documentation**: Well-documented APIs for integration with frontend systems.
- **Scalability**: Built with NestJS for modularity and scalability.

## 🚀 Technology Stack

- **Backend Framework**: NestJS
- **Programming Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT-based authentication with Passport
- **ORM**: Prisma

## ⚙️ Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/md-asharaf/nestjs-restaurant-table-booking.git
   cd nestjs-restaurant-table-booking
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   - Refer to the `.env.sample` file in the root directory for the required environment variables.
   - Create a `.env` file in the root directory and populate it with your configurations.

   ```bash
   cp .env.sample .env
   ```

4. **Run database migrations:**

   - Ensure your PostgreSQL database is set up and the connection details are properly configured in the `.env` file.

   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**

   ```bash
   npm run start:dev
   ```

## 🚩 Usage

- When running locally, API endpoints are available at: `http://localhost:3000` (default configuration).
- Swagger API documentation is available at: `http://localhost:3000/api/docs`
- Use tools like **Postman** or **cURL** to test the APIs.
- Authentication is handled via **JWT**. Ensure you include the appropriate `Authorization` header when making requests to secured endpoints.

## 🌐 Deployment

- Deployed URL: `https://restaurant-table-booking-jq1q.onrender.com` *(replace with your actual deployed link if different)*
- API Documentation in production: `https://restaurant-table-booking-jq1q.onrender.com/api/docs`

## 📑 Scripts

- `npm run start` - Start the production server.
- `npm run start:dev` - Start the development server.
- `npm run test` - Run tests.
- `npm run lint` - Lint the codebase.
- `npx prisma migrate dev` - Run database migrations.

## 🙌 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.

2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add your message"
   ```

4. Push to the branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Submit a pull request.

## 📄 License

This project is licensed under the **MIT License**.

## 👏 Acknowledgements

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- Inspiration from modular and scalable backend architectures.

