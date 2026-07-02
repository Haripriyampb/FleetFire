import { query } from '../config/database.js';

export const createCustomer = async (customerData) => {
  const {
    customerName,
    email,
    phone,
    address,
    city,
    state,
    postalCode,
    country,
    companyName,
    customerType,
  } = customerData;

  const result = await query(
    `INSERT INTO customers (
      customer_name, email, phone, address, city, state,
      postal_code, country, company_name, customer_type
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      customerName,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
      companyName,
      customerType,
    ]
  );

  return result.rows[0];
};

export const getAllCustomers = async (limit = 20, offset = 0) => {
  const result = await query(
    `SELECT * FROM customers ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

export const getCustomerById = async (id) => {
  const result = await query('SELECT * FROM customers WHERE id = $1', [id]);
  return result.rows[0];
};

export const updateCustomer = async (id, customerData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(customerData).forEach((key) => {
    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    fields.push(`${dbKey} = $${paramCount}`);
    values.push(customerData[key]);
    paramCount++;
  });

  values.push(id);

  const result = await query(
    `UPDATE customers SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  return result.rows[0];
};

export const deleteCustomer = async (id) => {
  const result = await query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

export const searchCustomers = async (searchTerm, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT * FROM customers
     WHERE customer_name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [`%${searchTerm}%`, limit, offset]
  );
  return result.rows;
};

export const getCustomerDeliveryHistory = async (customerId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT d.*, o.order_number, o.pickup_location, o.destination_location
     FROM deliveries d
     JOIN orders o ON d.order_id = o.id
     WHERE o.customer_id = $1
     ORDER BY d.created_at DESC LIMIT $2 OFFSET $3`,
    [customerId, limit, offset]
  );
  return result.rows;
};
