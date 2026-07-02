-- FleetFire Database Schema

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'user');
CREATE TYPE vehicle_status AS ENUM ('active', 'inactive', 'maintenance', 'offline');
CREATE TYPE fuel_type AS ENUM ('petrol', 'diesel', 'electric', 'hybrid');
CREATE TYPE driver_status AS ENUM ('available', 'on_delivery', 'unavailable', 'offline');
CREATE TYPE order_status AS ENUM ('pending', 'assigned', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE delivery_status AS ENUM ('pending', 'in_progress', 'completed', 'failed', 'cancelled');

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'user',
  phone VARCHAR(20),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Drivers Table
CREATE TABLE drivers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  license_expiry DATE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT,
  date_of_birth DATE,
  status driver_status DEFAULT 'available',
  current_vehicle_id INTEGER,
  completed_deliveries INTEGER DEFAULT 0,
  total_distance DECIMAL(10, 2) DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 5,
  performance_score INTEGER DEFAULT 100,
  documents_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_drivers_phone ON drivers(phone);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_license ON drivers(license_number);

-- Vehicles Table
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  vehicle_number VARCHAR(50) UNIQUE NOT NULL,
  vehicle_type VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER,
  vin VARCHAR(50) UNIQUE,
  fuel_type fuel_type,
  capacity_kg INTEGER,
  capacity_cubic_m DECIMAL(10, 2),
  current_fuel DECIMAL(10, 2),
  max_fuel DECIMAL(10, 2),
  status vehicle_status DEFAULT 'active',
  current_driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  current_speed DECIMAL(5, 2) DEFAULT 0,
  total_distance DECIMAL(15, 2) DEFAULT 0,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  insurance_expiry DATE,
  registration_expiry DATE,
  health_status VARCHAR(50) DEFAULT 'good',
  vehicle_image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicles_number ON vehicles(vehicle_number);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_driver ON vehicles(current_driver_id);
CREATE INDEX idx_vehicles_location ON vehicles(current_latitude, current_longitude);

-- Customers Table
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  company_name VARCHAR(255),
  customer_type VARCHAR(50),
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(15, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  customer_image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_city ON customers(city);

-- Orders Table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  pickup_location TEXT NOT NULL,
  pickup_latitude DECIMAL(10, 8),
  pickup_longitude DECIMAL(11, 8),
  destination_location TEXT NOT NULL,
  destination_latitude DECIMAL(10, 8),
  destination_longitude DECIMAL(11, 8),
  assigned_driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
  assigned_vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
  status order_status DEFAULT 'pending',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  scheduled_delivery_date DATE,
  estimated_distance DECIMAL(10, 2),
  estimated_time_minutes INTEGER,
  cargo_description TEXT,
  cargo_weight DECIMAL(10, 2),
  cargo_volume DECIMAL(10, 2),
  special_instructions TEXT,
  priority VARCHAR(50) DEFAULT 'normal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_driver ON orders(assigned_driver_id);
CREATE INDEX idx_orders_vehicle ON orders(assigned_vehicle_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date);

-- Deliveries Table
CREATE TABLE deliveries (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE RESTRICT,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  status delivery_status DEFAULT 'pending',
  actual_pickup_time TIMESTAMP,
  actual_delivery_time TIMESTAMP,
  actual_distance DECIMAL(10, 2),
  actual_time_minutes INTEGER,
  delivery_proof_image_url TEXT,
  recipient_name VARCHAR(255),
  recipient_phone VARCHAR(20),
  delivery_notes TEXT,
  delivery_rating INTEGER,
  delivery_feedback TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deliveries_order ON deliveries(order_id);
CREATE INDEX idx_deliveries_driver ON deliveries(driver_id);
CREATE INDEX idx_deliveries_vehicle ON deliveries(vehicle_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_deliveries_date ON deliveries(created_at);

-- Locations Table (for tracking location history)
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
  delivery_id INTEGER REFERENCES deliveries(id) ON DELETE SET NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed DECIMAL(5, 2),
  heading DECIMAL(5, 2),
  accuracy DECIMAL(5, 2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_locations_vehicle ON locations(vehicle_id);
CREATE INDEX idx_locations_driver ON locations(driver_id);
CREATE INDEX idx_locations_delivery ON locations(delivery_id);
CREATE INDEX idx_locations_timestamp ON locations(timestamp);

-- Routes Table (for optimized routes)
CREATE TABLE routes (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  delivery_id INTEGER REFERENCES deliveries(id) ON DELETE SET NULL,
  route_data JSONB,
  waypoints JSONB,
  total_distance DECIMAL(10, 2),
  estimated_duration_minutes INTEGER,
  optimized BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_routes_order ON routes(order_id);
CREATE INDEX idx_routes_delivery ON routes(delivery_id);

-- Notifications Table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50),
  related_entity VARCHAR(50),
  related_entity_id INTEGER,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_date ON notifications(created_at);

-- Analytics Table
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  total_orders INTEGER DEFAULT 0,
  completed_deliveries INTEGER DEFAULT 0,
  total_distance DECIMAL(15, 2) DEFAULT 0,
  total_fuel_consumed DECIMAL(10, 2) DEFAULT 0,
  total_revenue DECIMAL(15, 2) DEFAULT 0,
  active_vehicles INTEGER DEFAULT 0,
  active_drivers INTEGER DEFAULT 0,
  average_delivery_time DECIMAL(5, 2),
  on_time_delivery_rate DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_date ON analytics(date);

-- Maintenance Records Table
CREATE TABLE maintenance_records (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  maintenance_type VARCHAR(100),
  description TEXT,
  maintenance_date DATE NOT NULL,
  completion_date DATE,
  cost DECIMAL(10, 2),
  performed_by VARCHAR(255),
  notes TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_maintenance_vehicle ON maintenance_records(vehicle_id);
CREATE INDEX idx_maintenance_date ON maintenance_records(maintenance_date);

-- Add foreign key constraint for vehicles.current_driver_id after drivers table is created
ALTER TABLE vehicles 
ADD CONSTRAINT fk_vehicles_driver 
FOREIGN KEY (current_driver_id) REFERENCES drivers(id) ON DELETE SET NULL;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_updated_at BEFORE UPDATE ON analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, full_name, role, is_active)
VALUES (
  'admin',
  'admin@fleetfire.com',
  '$2a$10$j4ZLPxTQ7KLPKKKKKKKKKOx7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c',
  'Admin User',
  'admin',
  true
);
