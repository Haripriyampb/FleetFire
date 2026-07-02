export const VEHICLE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
  OFFLINE: 'offline',
};

export const DRIVER_STATUS = {
  AVAILABLE: 'available',
  ON_DELIVERY: 'on_delivery',
  UNAVAILABLE: 'unavailable',
  OFFLINE: 'offline',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const DELIVERY_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

export const USER_ROLE = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
};

export const FUEL_TYPE = {
  PETROL: 'petrol',
  DIESEL: 'diesel',
  ELECTRIC: 'electric',
  HYBRID: 'hybrid',
};

export const NOTIFICATION_TYPE = {
  DELIVERY_COMPLETED: 'delivery_completed',
  DRIVER_ASSIGNED: 'driver_assigned',
  VEHICLE_OFFLINE: 'vehicle_offline',
  ORDER_DELAYED: 'order_delayed',
  NEW_CUSTOMER: 'new_customer',
  MAINTENANCE_DUE: 'maintenance_due',
};

export const API_MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'An error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Internal server error',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};
