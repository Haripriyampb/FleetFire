import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const createDelivery = async (deliveryData) => {
  const {
    orderId,
    driverId,
    vehicleId,
  } = deliveryData;

  const result = await query(
    `INSERT INTO deliveries (order_id, driver_id, vehicle_id, status)
    VALUES ($1, $2, $3, 'pending')
    RETURNING *`,
    [orderId, driverId, vehicleId]
  );

  return result.rows[0];
};

export const getAllDeliveries = async (limit = 20, offset = 0) => {
  const result = await query(
    `SELECT d.*, o.order_number, c.customer_name, dr.full_name as driver_name, v.vehicle_number
     FROM deliveries d
     JOIN orders o ON d.order_id = o.id
     JOIN customers c ON o.customer_id = c.id
     JOIN users dr ON d.driver_id = dr.id
     JOIN vehicles v ON d.vehicle_id = v.id
     ORDER BY d.created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

export const getDeliveryById = async (id) => {
  const result = await query(
    `SELECT d.*, o.order_number, c.customer_name, dr.full_name as driver_name, v.vehicle_number
     FROM deliveries d
     JOIN orders o ON d.order_id = o.id
     JOIN customers c ON o.customer_id = c.id
     JOIN users dr ON d.driver_id = dr.id
     JOIN vehicles v ON d.vehicle_id = v.id
     WHERE d.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const updateDelivery = async (id, deliveryData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(deliveryData).forEach((key) => {
    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    fields.push(`${dbKey} = $${paramCount}`);
    values.push(deliveryData[key]);
    paramCount++;
  });

  values.push(id);

  const result = await query(
    `UPDATE deliveries SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  return result.rows[0];
};

export const completeDelivery = async (id, deliveryData) => {
  const result = await query(
    `UPDATE deliveries
     SET status = 'completed', is_completed = true, actual_delivery_time = CURRENT_TIMESTAMP,
         delivery_rating = $1, delivery_feedback = $2
     WHERE id = $3 RETURNING *`,
    [deliveryData.rating, deliveryData.feedback, id]
  );

  return result.rows[0];
};

export const getDeliveriesByDriver = async (driverId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT d.*, o.order_number, c.customer_name, v.vehicle_number
     FROM deliveries d
     JOIN orders o ON d.order_id = o.id
     JOIN customers c ON o.customer_id = c.id
     JOIN vehicles v ON d.vehicle_id = v.id
     WHERE d.driver_id = $1
     ORDER BY d.created_at DESC LIMIT $2 OFFSET $3`,
    [driverId, limit, offset]
  );
  return result.rows;
};

export const getDeliveriesByStatus = async (status, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT * FROM deliveries WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [status, limit, offset]
  );
  return result.rows;
};
