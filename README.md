# AirHotel - Online Hotel Booking Platform

A full-stack hotel booking web application built with the MERN stack (MongoDB, Express, React, Node.js). Users can browse listings, search by location, book accommodations, and manage their own property listings -- similar to Airbnb.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Screenshots](#screenshots)
- [License](#license)

## Features

### Core Functionality
- **User Authentication** -- Register, login, and logout with JWT cookie-based sessions
- **Property Listings** -- Create, edit, and manage accommodation listings with photos, descriptions, perks, and pricing
- **Booking System** -- Book places with date selection, guest count, and price calculation; cancel bookings with ownership validation
- **Search** -- Search listings by location, title, or description with 500ms debounced input
- **Photo Upload** -- Upload images directly or import by URL
- **Reviews** -- Rate and review places you've visited

### Security
- Passwords hashed with bcrypt
- JWT secret stored in environment variables
- `requireAuth` middleware with ownership validation on protected routes
- Rate limiting on login and registration endpoints (20 requests / 15 minutes)
- Server-side input validation on all routes with proper HTTP status codes (400, 401, 403, 404, 422, 500)
- Global error handler middleware

### UX & Error Handling
- Toast notification system (success, error, info) replacing all native alerts
- Loading spinners on all data-fetching pages
- Empty state messages with icons (no bookings, no listings, no search results)
- Real-time password validation on registration (length, uppercase, number, special character)
- Inline duplicate email error handling
- Custom 404 page with catch-all route
- Fully responsive design -- mobile-first layouts across all pages

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.1 | UI library |
| Vite | 6.3 | Build tool and dev server |
| Tailwind CSS | 3.4 | Utility-first styling |
| React Router | 7.6 | Client-side routing |
| Axios | 1.9 | HTTP client |
| date-fns | 4.1 | Date formatting |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | -- | Runtime |
| Express | 5.1 | Web framework |
| MongoDB | -- | Database |
| Mongoose | 8.15 | ODM |
| JSON Web Token | 9.0 | Authentication |
| bcryptjs | 3.0 | Password hashing |
| express-rate-limit | 8.2 | Rate limiting |
| Multer | 2.0 | File uploads |

## Project Structure

```
├── api/                          # Backend
│   ├── index.js                  # Express server, routes, middleware
│   ├── models/
│   │   ├── user.js               # User schema (name, email, password)
│   │   ├── place.js              # Place schema (title, address, photos, price, etc.)
│   │   ├── booking.js            # Booking schema (place, user, dates, price)
│   │   └── review.js             # Review schema (place, user, rating, text)
│   ├── routes/
│   │   └── reviewRoutes.js       # Review CRUD endpoints
│   ├── uploads/                  # Uploaded images
│   ├── .env.example              # Environment variable template
│   └── package.json
│
├── client/                       # Frontend
│   ├── src/
│   │   ├── App.jsx               # Route definitions
│   │   ├── Layout.jsx            # Page layout (Header + Outlet + Footer)
│   │   ├── Header.jsx            # Navigation bar with search
│   │   ├── footer.jsx            # Footer component
│   │   ├── UserContext.jsx       # Auth state context provider
│   │   ├── Toast.jsx             # Toast notification system
│   │   ├── Spinner.jsx           # Loading spinner component
│   │   ├── BookingWidget.jsx     # Booking form with validation
│   │   ├── PhotosUploader.jsx    # Photo upload (file + URL)
│   │   ├── PlaceGallery.jsx      # Responsive photo gallery with fullscreen modal
│   │   ├── ReviewSystem.jsx      # Review display and submission
│   │   ├── pages/
│   │   │   ├── IndexPage.jsx     # Home -- browse and search listings
│   │   │   ├── LoginPage.jsx     # Login form
│   │   │   ├── RegisterPage.jsx  # Registration with password validation
│   │   │   ├── ProfilePage.jsx   # User profile and logout
│   │   │   ├── PlacesPage.jsx    # User's listed properties
│   │   │   ├── PlacesFormPage.jsx# Create/edit property form
│   │   │   ├── PlacePage.jsx     # Single property detail page
│   │   │   ├── BookingsPage.jsx  # User's bookings list
│   │   │   ├── BookingPlace.jsx  # Single booking detail
│   │   │   └── NotFoundPage.jsx  # 404 page
│   │   └── index.css             # Global styles and animations
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── .gitignore
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/airhotel.git
   cd airhotel
   ```

2. **Set up the backend**
   ```bash
   cd api
   cp .env.example .env
   # Edit .env with your MongoDB connection string and a JWT secret
   npm install
   ```

3. **Set up the frontend**
   ```bash
   cd client
   npm install
   ```

### Running the Application

Start the backend and frontend in separate terminals:

```bash
# Terminal 1 -- Backend (runs on port 4000)
cd api
node index.js

# Terminal 2 -- Frontend (runs on port 5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

Create a `.env` file in the `api/` directory using `.env.example` as a template:

| Variable | Description | Example |
|---|---|---|
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for signing JWT tokens | Any long random string |

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | No | Register a new user |
| `POST` | `/login` | No | Login and receive JWT cookie |
| `GET` | `/profile` | Yes | Get current user profile |
| `POST` | `/logout` | No | Clear auth cookie |

### Places

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/places` | No | List all places (supports `?search=` query) |
| `GET` | `/places/:id` | No | Get single place details |
| `POST` | `/places` | Yes | Create a new listing |
| `PUT` | `/places` | Yes | Update a listing (owner only) |
| `GET` | `/user-places` | Yes | Get current user's listings |

### Bookings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/bookings` | Yes | Create a booking |
| `GET` | `/bookings` | Yes | Get current user's bookings |
| `DELETE` | `/bookings/:id` | Yes | Cancel a booking (owner only) |

### Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/reviews/:placeId` | No | Get reviews for a place |
| `POST` | `/api/reviews` | No | Submit a review |
| `DELETE` | `/api/reviews/:id` | No | Delete a review |

### Uploads

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/upload-by-link` | Yes | Download and save image from URL |
| `POST` | `/upload` | Yes | Upload image files (multipart) |

## Screenshots

> Add screenshots of your application here.
>
> **Tip:** Place screenshots in a `/screenshots` folder and reference them like:
> ```markdown
> ![Home Page](./screenshots/home.png)
> ```

## License

This project is open source and available under the [MIT License](LICENSE).
=======
# AirHotel - Online Hotel Booking Platform

A full-stack hotel booking web application built with the MERN stack (MongoDB, Express, React, Node.js). Users can browse listings, search by location, book accommodations, and manage their own property listings -- similar to Airbnb.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Screenshots](#screenshots)
- [License](#license)

## Features

### Core Functionality
- **User Authentication** -- Register, login, and logout with JWT cookie-based sessions
- **Property Listings** -- Create, edit, and manage accommodation listings with photos, descriptions, perks, and pricing
- **Booking System** -- Book places with date selection, guest count, and price calculation; cancel bookings with ownership validation
- **Search** -- Search listings by location, title, or description with 500ms debounced input
- **Photo Upload** -- Upload images directly or import by URL
- **Reviews** -- Rate and review places you've visited

### Security
- Passwords hashed with bcrypt
- JWT secret stored in environment variables
- `requireAuth` middleware with ownership validation on protected routes
- Rate limiting on login and registration endpoints (20 requests / 15 minutes)
- Server-side input validation on all routes with proper HTTP status codes (400, 401, 403, 404, 422, 500)
- Global error handler middleware

### UX & Error Handling
- Toast notification system (success, error, info) replacing all native alerts
- Loading spinners on all data-fetching pages
- Empty state messages with icons (no bookings, no listings, no search results)
- Real-time password validation on registration (length, uppercase, number, special character)
- Inline duplicate email error handling
- Custom 404 page with catch-all route
- Fully responsive design -- mobile-first layouts across all pages

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.1 | UI library |
| Vite | 6.3 | Build tool and dev server |
| Tailwind CSS | 3.4 | Utility-first styling |
| React Router | 7.6 | Client-side routing |
| Axios | 1.9 | HTTP client |
| date-fns | 4.1 | Date formatting |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | -- | Runtime |
| Express | 5.1 | Web framework |
| MongoDB | -- | Database |
| Mongoose | 8.15 | ODM |
| JSON Web Token | 9.0 | Authentication |
| bcryptjs | 3.0 | Password hashing |
| express-rate-limit | 8.2 | Rate limiting |
| Multer | 2.0 | File uploads |

## Project Structure

```
├── api/                          # Backend
│   ├── index.js                  # Express server, routes, middleware
│   ├── models/
│   │   ├── user.js               # User schema (name, email, password)
│   │   ├── place.js              # Place schema (title, address, photos, price, etc.)
│   │   ├── booking.js            # Booking schema (place, user, dates, price)
│   │   └── review.js             # Review schema (place, user, rating, text)
│   ├── routes/
│   │   └── reviewRoutes.js       # Review CRUD endpoints
│   ├── uploads/                  # Uploaded images
│   ├── .env.example              # Environment variable template
│   └── package.json
│
├── client/                       # Frontend
│   ├── src/
│   │   ├── App.jsx               # Route definitions
│   │   ├── Layout.jsx            # Page layout (Header + Outlet + Footer)
│   │   ├── Header.jsx            # Navigation bar with search
│   │   ├── footer.jsx            # Footer component
│   │   ├── UserContext.jsx       # Auth state context provider
│   │   ├── Toast.jsx             # Toast notification system
│   │   ├── Spinner.jsx           # Loading spinner component
│   │   ├── BookingWidget.jsx     # Booking form with validation
│   │   ├── PhotosUploader.jsx    # Photo upload (file + URL)
│   │   ├── PlaceGallery.jsx      # Responsive photo gallery with fullscreen modal
│   │   ├── ReviewSystem.jsx      # Review display and submission
│   │   ├── pages/
│   │   │   ├── IndexPage.jsx     # Home -- browse and search listings
│   │   │   ├── LoginPage.jsx     # Login form
│   │   │   ├── RegisterPage.jsx  # Registration with password validation
│   │   │   ├── ProfilePage.jsx   # User profile and logout
│   │   │   ├── PlacesPage.jsx    # User's listed properties
│   │   │   ├── PlacesFormPage.jsx# Create/edit property form
│   │   │   ├── PlacePage.jsx     # Single property detail page
│   │   │   ├── BookingsPage.jsx  # User's bookings list
│   │   │   ├── BookingPlace.jsx  # Single booking detail
│   │   │   └── NotFoundPage.jsx  # 404 page
│   │   └── index.css             # Global styles and animations
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── .gitignore
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/airhotel.git
   cd airhotel
   ```

2. **Set up the backend**
   ```bash
   cd api
   cp .env.example .env
   # Edit .env with your MongoDB connection string and a JWT secret
   npm install
   ```

3. **Set up the frontend**
   ```bash
   cd client
   npm install
   ```

### Running the Application

Start the backend and frontend in separate terminals:

```bash
# Terminal 1 -- Backend (runs on port 4000)
cd api
nodemon api

# Terminal 2 -- Frontend (runs on port 5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

Create a `.env` file in the `api/` directory using `.env.example` as a template:

| Variable | Description | Example |
|---|---|---|
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for signing JWT tokens | Any long random string |

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | No | Register a new user |
| `POST` | `/login` | No | Login and receive JWT cookie |
| `GET` | `/profile` | Yes | Get current user profile |
| `POST` | `/logout` | No | Clear auth cookie |

### Places

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/places` | No | List all places (supports `?search=` query) |
| `GET` | `/places/:id` | No | Get single place details |
| `POST` | `/places` | Yes | Create a new listing |
| `PUT` | `/places` | Yes | Update a listing (owner only) |
| `GET` | `/user-places` | Yes | Get current user's listings |

### Bookings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/bookings` | Yes | Create a booking |
| `GET` | `/bookings` | Yes | Get current user's bookings |
| `DELETE` | `/bookings/:id` | Yes | Cancel a booking (owner only) |

### Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/reviews/:placeId` | No | Get reviews for a place |
| `POST` | `/api/reviews` | No | Submit a review |
| `DELETE` | `/api/reviews/:id` | No | Delete a review |

### Uploads

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/upload-by-link` | Yes | Download and save image from URL |
| `POST` | `/upload` | Yes | Upload image files (multipart) |

