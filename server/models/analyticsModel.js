import { query } from '../config/database.js';

export const getDashboardMetrics = async () => {
  const result = await query(`
    SELECT
      (SELECT COUNT(*) FROM vehicles WHERE status = 'active') as active_vehicles,
      (SELECT COUNT(*) FROM vehicles) as total_vehicles,
      (SELECT COUNT(*) FROM drivers WHERE status = 'available') as available_drivers,
      (SELECT COUNT(*) FROM drivers) as total_drivers,
      (SELECT COUNT(*) FROM customers) as total_customers,
      (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
      (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE) as todays_orders,
      (SELECT COUNT(*) FROM deliveries WHERE status = 'completed' AND DATE(created_at) = CURRENT_DATE) as todays_completed_deliveries,
      (SELECT COUNT(*) FROM deliveries WHERE status = 'pending' OR status = 'in_progress') as pending_deliveries,
      (SELECT COALESCE(SUM(total_distance), 0) FROM vehicles) as total_distance_traveled,
      (SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (actual_delivery_time - actual_pickup_time))/60), 0) FROM deliveries WHERE is_completed = true) as avg_delivery_time
  `);

  return result.rows[0];
};

export const getMonthlyDeliveries = async (months = 12) => {
  const result = await query(`
    SELECT
      DATE_TRUNC('month', created_at)::date as month,
      COUNT(*) as total_deliveries,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_deliveries
    FROM deliveries
    WHERE created_at >= CURRENT_DATE - INTERVAL '${months} months'
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY DATE_TRUNC('month', created_at)
  `);

  return result.rows;
};

export const getVehicleUsage = async () => {
  const result = await query(`
    SELECT
      v.id,
      v.vehicle_number,
      v.vehicle_type,
      COUNT(d.id) as total_deliveries,
      SUM(v.total_distance) as total_distance,
      AVG(v.current_fuel) as avg_fuel_level
    FROM vehicles v
    LEFT JOIN deliveries d ON v.id = d.vehicle_id
    GROUP BY v.id, v.vehicle_number, v.vehicle_type
    ORDER BY total_deliveries DESC
  `);

  return result.rows;
};

export const getDriverPerformance = async () => {
  const result = await query(`
    SELECT
      d.id,
      u.full_name,
      COUNT(de.id) as total_deliveries,
      SUM(CASE WHEN de.status = 'completed' THEN 1 ELSE 0 END) as completed_deliveries,
      AVG(de.delivery_rating) as avg_rating,
      d.performance_score,
      SUM(v.total_distance) as total_distance
    FROM drivers d
    JOIN users u ON d.user_id = u.id
    LEFT JOIN deliveries de ON d.id = de.driver_id
    LEFT JOIN vehicles v ON d.current_vehicle_id = v.id
    GROUP BY d.id, u.full_name, d.performance_score
    ORDER BY avg_rating DESC
  `);

  return result.rows;
};

export const getFuelConsumption = async (months = 12) => {
  const result = await query(`
    SELECT
      DATE_TRUNC('month', created_at)::date as month,
      SUM(max_fuel - current_fuel) as fuel_consumed
    FROM vehicles
    WHERE updated_at >= CURRENT_DATE - INTERVAL '${months} months'
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY DATE_TRUNC('month', created_at)
  `);

  return result.rows;
};

export const getRevenueAnalytics = async (months = 12) => {
  const result = await query(`
    SELECT
      DATE_TRUNC('month', o.created_at)::date as month,
      COUNT(d.id) as total_deliveries,
      COALESCE(SUM(c.total_spent), 0) as revenue
    FROM orders o
    LEFT JOIN deliveries d ON o.id = d.order_id
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE o.created_at >= CURRENT_DATE - INTERVAL '${months} months'
    GROUP BY DATE_TRUNC('month', o.created_at)
    ORDER BY DATE_TRUNC('month', o.created_at)
  `);

  return result.rows;
};

export const getOrderStatistics = async () => {
  const result = await query(`
    SELECT
      status,
      COUNT(*) as count
    FROM orders
    GROUP BY status
  `);

  return result.rows;
};
