import * as deliveryModel from '../models/deliveryModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createDelivery = asyncHandler(async (req, res) => {
  const delivery = await deliveryModel.createDelivery(req.body);
  res.status(201).json({ success: true, message: 'Delivery created', delivery });
});

export const getAllDeliveries = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const deliveries = await deliveryModel.getAllDeliveries(limit, offset);
  res.status(200).json({ success: true, deliveries });
});

export const getDeliveryById = asyncHandler(async (req, res) => {
  const delivery = await deliveryModel.getDeliveryById(req.params.id);
  if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
  res.status(200).json({ success: true, delivery });
});

export const updateDelivery = asyncHandler(async (req, res) => {
  const delivery = await deliveryModel.updateDelivery(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Delivery updated', delivery });
});

export const completeDelivery = asyncHandler(async (req, res) => {
  const delivery = await deliveryModel.completeDelivery(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Delivery completed', delivery });
});

export const getDeliveriesByDriver = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const deliveries = await deliveryModel.getDeliveriesByDriver(req.params.driverId, limit, offset);
  res.status(200).json({ success: true, deliveries });
});
