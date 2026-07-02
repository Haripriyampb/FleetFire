import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const createOrder = async (orderData) => {
  const {
    customerId,
    pickupLocation,
    pickupLatitude,
    pickupLongitude,
    destinationLocation,
    destinationLatitude,
    destinationLongitude,
    scheduledDeliveryDate,
    cargoDescription,
    cargoWeight,
    cargoVolume,
    specialInstructions,
    priority,
  } = orderData;

  const orderNumber = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;

  const result = await query(
    `INSERT INTO orders (
      order_number, customer_id, pickup_location, pickup_latitude,
      pickup_longitude, destination_location, destination_latitude,
      destination_longitude, scheduled_delivery_date, cargo_description,
      cargo_weight, cargo_volume, special_instructions, priority
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *`,
    [
      orderNumber,
      customerId,
      pickupLocation,
      pickupLatitude,
      pickupLongitude,
      destinationLocation,
      destinationLatitude,
      destinationLongitude,
      scheduledDeliveryDate,
      cargoDescription,
      cargoWeight,
      cargoVolume,
      specialInstructions,
      priority,
    ]
  );

  return result.rows[0];
};

export const getAllOrders = async (limit = 20, offset = 0) => {
  const result = await query(
    `SELECT o.*, c.customer_name, d.full_name as driver_name, v.vehicle_number
     FROM orders o
     LEFT JOIN customers c ON o.customer_id = c.id
     LEFT JOIN users d ON o.assigned_driver_id = d.id
     LEFT JOIN vehicles v ON o.assigned_vehicle_id = v.id
     ORDER BY o.created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

export const getOrderById = async (id) => {
  const result = await query(
    `SELECT o.*, c.customer_name, c.phone as customer_phone, d.full_name as driver_name, v.vehicle_number
     FROM orders o
     LEFT JOIN customers c ON o.customer_id = c.id
     LEFT JOIN users d ON o.assigned_driver_id = d.id
     LEFT JOIN vehicles v ON o.assigned_vehicle_id = v.id
     WHERE o.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const updateOrder = async (id, orderData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(orderData).forEach((key) => {
    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    fields.push(`${dbKey} = $${paramCount}`);
    values.push(orderData[key]);
    paramCount++;
  });

  values.push(id);

  const result = await query(
    `UPDATE orders SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  return result.rows[0];
};

export const deleteOrder = async (id) => {
  const result = await query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

export const assignDriverToOrder = async (orderId, driverId) => {
  const result = await query(
    'UPDATE orders SET assigned_driver_id = $1, status = $2 WHERE id = $3 RETURNING *',
    [driverId, 'assigned', orderId]
  );
  return result.rows[0];
};

export const assignVehicleToOrder = async (orderId, vehicleId) => {
  const result = await query(
    'UPDATE orders SET assigned_vehicle_id = $1 WHERE id = $2 RETURNING *',
    [vehicleId, orderId]
  );
  return result.rows[0];
};

export const getOrdersByStatus = async (status, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [status, limit, offset]
  );
  return result.rows;
};

export const searchOrders = async (searchTerm, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT * FROM orders
     WHERE order_number ILIKE $1 OR pickup_location ILIKE $1 OR destination_location ILIKE $1
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [`%${searchTerm}%`, limit, offset]
  );
  return result.rows;
};
