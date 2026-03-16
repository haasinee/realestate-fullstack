-- ============================================
-- Real Estate Property Management System
-- MySQL Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS realestate_db;
USE realestate_db;

-- USERS TABLE
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- PROPERTIES TABLE
CREATE TABLE properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    property_type ENUM('APARTMENT','VILLA','PENTHOUSE','COMMERCIAL') NOT NULL,
    status ENUM('ACTIVE','SOLD','PENDING') DEFAULT 'ACTIVE',
    price DECIMAL(15,2) NOT NULL,
    area_sqft INT,
    bedrooms INT DEFAULT 0,
    bathrooms INT DEFAULT 0,
    floor_number INT,
    year_built INT,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    amenities TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    agent_name VARCHAR(100),
    agent_phone VARCHAR(20),
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- PROPERTY IMAGES TABLE
CREATE TABLE property_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- REVIEWS TABLE
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (property_id, user_id)
);

-- BOOKINGS TABLE
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    visit_date DATE NOT NULL,
    visit_time TIME NOT NULL,
    visitor_name VARCHAR(100) NOT NULL,
    visitor_phone VARCHAR(20) NOT NULL,
    status ENUM('PENDING','CONFIRMED','CANCELLED','COMPLETED') DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- SEED DATA
-- ============================================

-- Admin user (password: admin123)
INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES
('Admin', 'User', 'admin@estate.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '+91 99999 00000', 'ADMIN'),
('John', 'Doe', 'user@estate.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '+91 98765 43210', 'USER');

-- Sample properties
INSERT INTO properties (title, description, property_type, price, area_sqft, bedrooms, bathrooms, floor_number, year_built, address, city, state, pincode, amenities, is_featured, agent_name, agent_phone, created_by) VALUES
('Skyline Penthouse', 'An unparalleled living experience perched atop one of Hyderabad''s most prestigious towers with sweeping views of the city skyline.', 'PENTHOUSE', 42000000, 4200, 4, 4, 32, 2022, 'Banjara Hills Road No. 12', 'Hyderabad', 'Telangana', '500034', 'Pool,Gym,Concierge,Parking,Terrace,Smart Home', TRUE, 'Arjun Sharma', '+91 98765 43210', 1),
('The Greenfield Villa', 'A magnificent private villa set within beautifully landscaped grounds offering the ultimate in luxury family living.', 'VILLA', 28500000, 5800, 5, 4, 2, 2021, 'Road No. 36, Jubilee Hills', 'Hyderabad', 'Telangana', '500033', 'Garden,Pool,Home Theatre,Servant Quarters,3-Car Garage', TRUE, 'Priya Reddy', '+91 87654 32109', 1),
('Marina Heights 802', 'Sophisticated urban living in the heart of Hyderabad''s tech corridor with contemporary interiors.', 'APARTMENT', 14500000, 2100, 3, 2, 8, 2023, 'Madhapur Main Road', 'Hyderabad', 'Telangana', '500081', 'Gym,Clubhouse,Security,Power Backup,Swimming Pool', FALSE, 'Rahul Mehta', '+91 76543 21098', 1),
('Serene Valley Retreat', 'A truly exceptional countryside estate offering absolute privacy and tranquility.', 'VILLA', 36000000, 7200, 6, 5, 2, 2020, 'Shamirpet Road', 'Hyderabad', 'Telangana', '500078', '5 Acres Land,Organic Farm,Guest Cottage,Tennis Court', TRUE, 'Kavitha Singh', '+91 65432 10987', 1),
('The Diplomat Suite', 'Residence of the highest calibre in Hyderabad''s premier address, a duplex penthouse with panoramic views.', 'PENTHOUSE', 51000000, 3600, 3, 3, 40, 2023, 'HITEC City Main Road', 'Hyderabad', 'Telangana', '500081', 'Butler Service,Sky Lounge,Wine Cellar,Private Elevator', TRUE, 'Vikram Nair', '+91 54321 09876', 1),
('Prestige Office Space', 'Premium Grade A commercial space in the most sought-after business district.', 'COMMERCIAL', 89000000, 12000, 0, 8, 15, 2022, 'HITEC City, Cyberabad', 'Hyderabad', 'Telangana', '500081', 'Grade A Office,24/7 Security,Conference Rooms,Cafeteria', FALSE, 'Deepa Iyer', '+91 43210 98765', 1);

-- Sample reviews
INSERT INTO reviews (property_id, user_id, rating, comment) VALUES
(1, 2, 5, 'The views are absolutely breathtaking. The property management team has been exceptional.'),
(2, 2, 4, 'Spacious and beautifully designed. The pool area is a real highlight for entertaining.'),
(3, 2, 5, 'Fantastic location in the tech corridor. Building amenities are top notch.');

-- Sample booking
INSERT INTO bookings (property_id, user_id, visit_date, visit_time, visitor_name, visitor_phone, status) VALUES
(1, 2, '2025-04-15', '10:00:00', 'John Doe', '+91 98765 43210', 'CONFIRMED'),
(3, 2, '2025-04-18', '14:00:00', 'John Doe', '+91 98765 43210', 'PENDING');
