import { query } from '../config/database.js';

export const createVehicle = async (vehicleData) => {
  const {
    vehicleNumber,
    vehicleType,
    manufacturer,
    model,
    year,
    vin,
    fuelType,
    capacityKg,
    capacityCubicM,
    maxFuel,
  } = vehicleData;

  const result = await query(
    `INSERT INTO vehicles (
      vehicle_number, vehicle_type, manufacturer, model, year, vin,
      fuel_type, capacity_kg, capacity_cubic_m, max_fuel, current_fuel
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)
    RETURNING *`,
    [
      vehicleNumber,
      vehicleType,
      manufacturer,
      model,
      year,
      vin,
      fuelType,
      capacityKg,
      capacityCubicM,
      maxFuel,
    ]
  );

  return result.rows[0];
};

export const getAllVehicles = async (limit = 20, offset = 0) => {
  const result = await query(
    `SELECT * FROM vehicles ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

export const getVehicleById = async (id) => {
  const result = await query('SELECT * FROM vehicles WHERE id = $1', [id]);
  return result.rows[0];
};

export const updateVehicle = async (id, vehicleData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(vehicleData).forEach((key) => {
    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    fields.push(`${dbKey} = $${paramCount}`);
    values.push(vehicleData[key]);
    paramCount++;
  });

  values.push(id);

  const result = await query(
    `UPDATE vehicles SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  return result.rows[0];
};

export const deleteVehicle = async (id) => {
  const result = await query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

export const getVehiclesByStatus = async (status, limit = 20, offset = 0) => {
  const result = await query(
    'SELECT * FROM vehicles WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
    [status, limit, offset]
  );
  return result.rows;
};

export const searchVehicles = async (searchTerm, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT * FROM vehicles
     WHERE vehicle_number ILIKE $1 OR manufacturer ILIKE $1 OR model ILIKE $1
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [`%${searchTerm}%`, limit, offset]
  );
  return result.rows;
};

export const updateVehicleLocation = async (vehicleId, latitude, longitude, speed) => {
  const result = await query(
    `UPDATE vehicles
     SET current_latitude = $1, current_longitude = $2, current_speed = $3
     WHERE id = $4 RETURNING *`,
    [latitude, longitude, speed, vehicleId]
  );
  return result.rows[0];
};
