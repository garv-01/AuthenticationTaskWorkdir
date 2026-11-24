# AuthSpace — Authentication & Product CRUD

A full-stack application built with React and Express. It provides user registration and login, JWT-based authentication with access and refresh tokens, and a product management dashboard.

## Features

### Authentication
- User registration and login
- Password hashing with `bcryptjs`
- JWT access tokens and refresh tokens
- Refresh token stored in an HTTP-only cookie
- Protected routes using access-token middleware
- Logout and current-user profile endpoints
- Request validation with `express-validator`

### Products
- Create, view, update, and delete products
- Product fields: name, description, price, stock, category, and image URL
- Protected product routes
- Validation for product fields and MongoDB product IDs

### Frontend
- React application built with Vite
- Login and registration forms
- Authenticated dashboard with product management
- Axios API client with credentials and token handling

## Tech stack

- **Frontend:** React, Vite, Axios, CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, HTTP-only cookies
- **Validation:** `express-validator`

## Project structure

```text
Authentication Task/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── app/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── validator/
│   ├── package.json
│   └── server.js
└── README.md
```

## Prerequisites

- Node.js and npm
- A running MongoDB instance or MongoDB Atlas connection string

## Setup and run locally

Run the frontend and backend in separate terminals.

### 1. Configure the backend

```bash
cd server
npm install
```

Create a file named `.env` inside the `server` directory. Add your own values:

```env
port=3100
mongo_URI=your_mongodb_connection_string
accessToken=your_access_token_secret
refreshToken=your_refresh_token_secret
```

Use long, unique secrets for the token keys. Keep `.env` private and never commit it.

Start the backend:

```bash
node server.js
```

The backend connects to MongoDB and listens on the configured port. The frontend's Axios client currently points to `http://localhost:3100/api`; if you change the backend port, update `client/src/services/api.js` too.

### 2. Start the frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal (typically `http://localhost:5173`).

### 3. Use the application

1. Register an account.
2. Sign in with that account.
3. Use the dashboard to create, edit, and delete products.
4. Sign out when finished.

## API reference

The backend mounts routes under `/api`. Protected endpoints require an access token in the header:

```http
Authorization: Bearer <access_token>
```

The refresh endpoint reads the refresh token from the HTTP-only cookie.

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a user |
| `POST` | `/api/auth/login` | Public | Log in and receive tokens |
| `POST` | `/api/auth/refresh-token` | Refresh cookie | Refresh tokens |
| `POST` | `/api/auth/logout` | Access token | Log out and revoke the stored refresh token |
| `GET` | `/api/auth/getMe` | Access token | Get the current user's profile |
| `GET` | `/api/auth/protected` | Access token | Example protected endpoint |

### Products

All product routes currently use access-token authentication.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/product/createProduct` | Create a product |
| `GET` | `/api/product/getAllProduct` | Get all products |
| `GET` | `/api/product/getProduct/:id` | Get a product by MongoDB ID |
| `POST` | `/api/product/updateProduct/:id` | Update a product |
| `POST` | `/api/product/deleteProduct/:id` | Delete a product |

Product create/update requests use JSON. Example:

```json
{
  "name": "Wireless Mouse",
  "description": "Wireless mouse with USB receiver",
  "price": 24.99,
  "stock": 15,
  "category": "Accessories",
  "image": "https://example.com/mouse.jpg"
}
```

## Validation and error responses

The backend validates authentication and product request fields. Authentication failures return HTTP `401`; a missing product returns HTTP `404`.

## Build the frontend

```bash
cd client
npm run build
```

The production build is generated in `client/dist/`.

## Security and configuration notes

- Do not upload `.env`, database credentials, or token secrets.
- Keep `node_modules/` and generated build output out of source control.
- The current frontend API base URL and backend CORS origin are configured for local development. Update them when deploying the frontend and backend to different hosts.
- Use HTTPS in production so secure cookies and authorization headers are protected in transit.

## License

No license has been specified for this project.
