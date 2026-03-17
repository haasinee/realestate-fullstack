# Premium Estates — Airbnb-style Real Estate Platform

A modern full-stack property platform inspired by Airbnb, built with React, Spring Boot, JWT authentication, and MySQL.

## Tech Stack
- **Frontend:** React 18, React Router v6, Axios
- **Backend:** Spring Boot 3, Java 17, Spring Data JPA, Spring Security
- **Database:** MySQL 8
- **Authentication:** JWT

## Clean Architecture (Backend)
```
backend/src/main/java/com/realestate/
├── config/
├── controller/
├── dto/
├── entity/
├── exception/
├── repository/
├── security/
└── service/
```

## Core Domain Entities
- `User`
- `Property`
- `Booking`
- `Review`
- `PropertyImage`

### Property model (main fields)
- `id`
- `propertyName`
- `description`
- `location`
- `price`
- `imageUrl`
- `latitude`
- `longitude`
- `propertyType`
- `bedrooms`
- `bathrooms`
- `area`

## Implemented APIs
- **Auth/JWT:** register + login
- **Property:** CRUD
- **Property Search:** location + min/max price + property type
- **Booking:** create booking, my bookings, admin booking management
- **Review:** create/get/delete reviews

## Frontend Pages
- Home
- Property Listing
- Property Details
- Booking Page
- Login/Register
- User Profile

Also includes:
- Sidebar navigation
- Property cards with image, name, location, price, rating
- Filters (location, price range, property type)
- Property image gallery
- Google Maps embed in property details

## Database
Schema is normalized with these tables:
- `users`
- `properties`
- `bookings`
- `reviews`
- `property_images`

Seed data includes:
- Admin + user account
- **10 sample properties**
- Sample reviews/bookings

## Run Instructions

### 1) Setup database
```bash
cd realestate
mysql -u root -p < database/schema.sql
```

### 2) Run backend
1. Update DB credentials in `backend/src/main/resources/application.properties`
2. Start backend:
```bash
cd realestate/backend
mvn spring-boot:run
```
Backend URL: `http://localhost:8080`

### 3) Run frontend
```bash
cd realestate/frontend
npm install
npm start
```
Frontend URL: `http://localhost:3000`

## Default Credentials (seed)
- **Admin:** `admin@estate.com` / `password`
- **User:** `user@estate.com` / `password`
