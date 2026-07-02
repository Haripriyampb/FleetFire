import { query } from '../config/database.js';

export const createDriver = async (driverData) => {
  const {
    userId,
    licenseNumber,
    licenseExpiry,
    phone,
    email,
    address,
    dateOfBirth,
  } = driverData;

  const result = await query(
    `INSERT INTO drivers (
      user_id, license_number, license_expiry, phone, email,
      address, date_of_birth
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [userId, licenseNumber, licenseExpiry, phone, email, address, dateOfBirth]
  );

  return result.rows[0];
};

export const getAllDrivers = async (limit = 20, offset = 0) => {
  const result = await query(
    `SELECT d.*, u.full_name, u.email as user_email
     FROM drivers d
     LEFT JOIN users u ON d.user_id = u.id
     ORDER BY d.created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

export const getDriverById = async (id) => {
  const result = await query(
    `SELECT d.*, u.full_name, u.email as user_email
     FROM drivers d
     LEFT JOIN users u ON d.user_id = u.id
     WHERE d.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const updateDriver = async (id, driverData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(driverData).forEach((key) => {
    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    fields.push(`${dbKey} = $${paramCount}`);
    values.push(driverData[key]);
    paramCount++;
  });

  values.push(id);

  const result = await query(
    `UPDATE drivers SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  return result.rows[0];
};

export const deleteDriver = async (id) => {
  const result = await query('DELETE FROM drivers WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

export const assignVehicleToDriver = async (driverId, vehicleId) => {
  // Update vehicle to assign driver
  await query(
    'UPDATE vehicles SET current_driver_id = $1 WHERE id = $2',
    [driverId, vehicleId]
  );

  // Update driver to set current vehicle
  const result = await query(
    'UPDATE drivers SET current_vehicle_id = $1 WHERE id = $2 RETURNING *',
    [vehicleId, driverId]
  );

  return result.rows[0];
};

export const getDriversByStatus = async (status, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT * FROM drivers WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [status, limit, offset]
  );
  return result.rows;
};

export const getDriverPerformance = async (driverId) => {
  const result = await query(
    `SELECT
      d.id,
      d.completed_deliveries,
      d.total_distance,
      d.rating,
      d.performance_score,
      COUNT(de.id) as total_deliveries,
      AVG(de.delivery_rating) as avg_rating
     FROM drivers d
     LEFT JOIN deliveries de ON d.id = de.driver_id
     WHERE d.id = $1
     GROUP BY d.id`,
    [driverId]
  );
  return result.rows[0];
};
