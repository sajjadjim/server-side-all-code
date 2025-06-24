# b11a11-server-side-sajjadjim

This is the server-side codebase for your project. It provides backend APIs and handles data management for the application.

## Features

- RESTful API endpoints
- User authentication and authorization
- Database integration
- Environment variable support

## Installed Packages

- **express**: Web framework for Node.js
- **cors**: Enable Cross-Origin Resource Sharing
- **dotenv**: Load environment variables
- **mongodb**: MongoDB driver for Node.js
- **jsonwebtoken**: For handling JWT authentication
- **bcryptjs**: Password hashing
- **nodemon** (dev): Auto-restart server on changes

## Getting Started

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/b11a11-server-side-sajjadjim.git
    cd b11a11-server-side-sajjadjim
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file and add your environment variables:
    ```
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. Start the server:
    ```bash
    npm run dev
    ```

## Folder Structure

```
/ (root)
├── index.js
├── package.json
├── .env
├── /routes
├── /controllers
└── /models
```

## API Endpoints

- `POST /login` - User login
- `POST /register` - User registration
- `GET /items` - Get all items
- `POST /items` - Add new item

## License

MIT
