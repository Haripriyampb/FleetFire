import * as orderModel from '../models/orderModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderModel.createOrder(req.body);
  res.status(201).json({ success: true, message: 'Order created', order });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const orders = await orderModel.getAllOrders(limit, offset);
  res.status(200).json({ success: true, orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderModel.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.status(200).json({ success: true, order });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const order = await orderModel.updateOrder(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Order updated', order });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await orderModel.deleteOrder(req.params.id);
  res.status(200).json({ success: true, message: 'Order deleted', order });
});

export const assignDriver = asyncHandler(async (req, res) => {
  const { driverId } = req.body;
  const order = await orderModel.assignDriverToOrder(req.params.id, driverId);
  res.status(200).json({ success: true, message: 'Driver assigned', order });
});

export const assignVehicle = asyncHandler(async (req, res) => {
  const { vehicleId } = req.body;
  const order = await orderModel.assignVehicleToOrder(req.params.id, vehicleId);
  res.status(200).json({ success: true, message: 'Vehicle assigned', order });
});

export const searchOrders = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const orders = await orderModel.searchOrders(q, limit, offset);
  res.status(200).json({ success: true, orders });
});

export const getOrdersByStatus = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const orders = await orderModel.getOrdersByStatus(status, limit, offset);
  res.status(200).json({ success: true, orders });
});
