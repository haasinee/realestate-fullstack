# Premium Estates — Full Stack Real Estate Portal

A complete Real Estate Property Management System built with React, Spring Boot, and MySQL.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, React Router v6, Axios  |
| Backend    | Spring Boot 3.2, Spring Security  |
| Database   | MySQL 8.0                         |
| Auth       | JWT (JSON Web Token)              |
| Styling    | Custom CSS (no frameworks)        |

---

## Project Structure

```
realestate/
├── database/
│   └── schema.sql              ← Run this first
├── backend/                    ← Spring Boot Maven project
│   ├── pom.xml
│   └── src/main/java/com/realestate/
│       ├── RealEstateApplication.java
│       ├── config/             ← SecurityConfig, WebConfig
│       ├── controller/         ← Auth, Property, Review, Booking
│       ├── dto/                ← Request/Response DTOs
│       ├── entity/             ← JPA Entities
│       ├── repository/         ← Spring Data repositories
│       ├── security/           ← JWT filter, UserDetailsService
│       └── service/            ← Business logic
└── frontend/                   ← React app
    ├── package.json
    └── src/
        ├── App.js
        ├── context/AuthContext.js
        ├── services/api.js
        ├── styles/global.css
        ├── components/         ← Navbar, PropertyCard, Toast, etc.
        └── pages/              ← Home, PropertyDetail, MyBookings, Admin
```

---

## Setup Instructions

### 1. Database Setup

```sql
-- Open MySQL and run:
source database/schema.sql
```

This creates the database, all tables, and seed data including:
- Admin user: `admin@estate.com` / `password` (BCrypt hashed in DB)
- Regular user: `user@estate.com` / `password`
- 6 sample properties with reviews and bookings

> **Note:** The seed data uses a BCrypt hash for the password `password`. Change this for production.

---

### 2. Backend Setup

**Prerequisites:** Java 17+, Maven 3.8+, MySQL 8

1. Open `backend/src/main/resources/application.properties`
2. Update your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/realestate_db
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   ```
3. Run the application:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
4. Backend starts at `http://localhost:8080`

---

### 3. Frontend Setup

**Prerequisites:** Node.js 18+, npm

```bash
cd frontend
npm install
npm start
```

Frontend starts at `http://localhost:3000` and proxies API calls to `:8080`.

---

## REST API Endpoints

### Authentication
| Method | Endpoint            | Access | Description         |
|--------|---------------------|--------|---------------------|
| POST   | /api/auth/login     | Public | Login, returns JWT  |
| POST   | /api/auth/register  | Public | Register new user   |
| GET    | /api/users/profile  | User   | Logged-in user profile with bookings/reviews |

### Properties
| Method | Endpoint                     | Access | Description             |
|--------|------------------------------|--------|-------------------------|
| GET    | /api/properties              | Public | All active properties   |
| GET    | /api/properties/{id}         | Public | Property details        |
| GET    | /api/properties/featured     | Public | Featured listings       |
| GET    | /api/properties/search       | Public | Filter by city/type/price |
| GET    | /api/properties/keyword?q=   | Public | Keyword search          |
| POST   | /api/properties              | Admin  | Create new property     |
| PUT    | /api/properties/{id}         | Admin  | Update property         |
| DELETE | /api/properties/{id}         | Admin  | Delete property         |
| POST   | /api/properties/{id}/images  | Admin  | Upload property image   |
| GET    | /api/properties/stats        | Admin  | Dashboard stats         |

### Reviews
| Method | Endpoint                        | Access | Description      |
|--------|---------------------------------|--------|------------------|
| GET    | /api/reviews/property/{propId}  | Public | Get reviews      |
| POST   | /api/reviews                    | User   | Submit review    |
| DELETE | /api/reviews/{id}               | Admin  | Delete review    |

### Bookings
| Method | Endpoint                    | Access | Description              |
|--------|-----------------------------|--------|--------------------------|
| POST   | /api/bookings               | User   | Book property visit      |
| GET    | /api/bookings/my            | User   | My bookings              |
| GET    | /api/bookings               | Admin  | All bookings             |
| PUT    | /api/bookings/{id}/status   | Admin  | Update booking status    |
| PUT    | /api/bookings/{id}/cancel   | User   | Cancel my booking        |

---

## Features

### User Features
- Browse all active property listings
- Search by keyword, location, price range
- Filter by property type (Apartment, Villa, Penthouse, Commercial)
- Sort by price (asc/desc) and rating
- View detailed property information with specs & amenities
- Google Maps embed on property details
- Sidebar navigation with quick links
- User profile page showing bookings and reviews
- Book property visits with date/time selection
- View and cancel personal bookings
- Submit star ratings and written reviews
- Secure JWT-based login and registration

### Admin Features
- Admin dashboard with property and booking stats
- Full property CRUD (Create, Read, Update, Delete)
- Image upload for property listings
- View and manage all customer bookings
- Update booking status (Confirm / Complete / Cancel)
- Featured property management

---

## Default Login Credentials (from seed data)

| Role  | Email              | Password |
|-------|--------------------|----------|
| Admin | admin@estate.com   | password |
| User  | user@estate.com    | password |

---

## Environment Variables (Production)

For production, externalize these in environment variables or a secrets manager:

```properties
jwt.secret=<your-256-bit-secret>
spring.datasource.password=<db-password>
cors.allowed.origins=https://your-frontend-domain.com
```

---

## Building for Production

```bash
# Frontend build
cd frontend && npm run build

# Backend JAR
cd backend && mvn clean package
java -jar target/realestate-backend-1.0.0.jar
```

Serve the React `build/` folder via Nginx or embed it in Spring Boot's `static/` resources.
