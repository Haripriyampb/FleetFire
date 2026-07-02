import { query } from '../config/database.js';

export const createNotification = async (notificationData) => {
  const {
    userId,
    title,
    message,
    type,
    relatedEntity,
    relatedEntityId,
    actionUrl,
  } = notificationData;

  const result = await query(
    `INSERT INTO notifications (user_id, title, message, type, related_entity, related_entity_id, action_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [userId, title, message, type, relatedEntity, relatedEntityId, actionUrl]
  );

  return result.rows[0];
};

export const getUserNotifications = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
};

export const markAsRead = async (notificationId) => {
  const result = await query(
    'UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *',
    [notificationId]
  );
  return result.rows[0];
};

export const markAllAsRead = async (userId) => {
  const result = await query(
    'UPDATE notifications SET is_read = true WHERE user_id = $1 RETURNING *',
    [userId]
  );
  return result.rows;
};

export const deleteNotification = async (notificationId) => {
  const result = await query(
    'DELETE FROM notifications WHERE id = $1 RETURNING *',
    [notificationId]
  );
  return result.rows[0];
};
