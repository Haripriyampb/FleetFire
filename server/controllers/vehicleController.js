import * as vehicleModel from '../models/vehicleModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleModel.createVehicle(req.body);
  res.status(201).json({ success: true, message: 'Vehicle created', vehicle });
});

export const getAllVehicles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const vehicles = await vehicleModel.getAllVehicles(limit, offset);
  res.status(200).json({ success: true, vehicles });
});

export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await vehicleModel.getVehicleById(req.params.id);
  if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
  res.status(200).json({ success: true, vehicle });
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleModel.updateVehicle(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Vehicle updated', vehicle });
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleModel.deleteVehicle(req.params.id);
  res.status(200).json({ success: true, message: 'Vehicle deleted', vehicle });
});

export const searchVehicles = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const vehicles = await vehicleModel.searchVehicles(q, limit, offset);
  res.status(200).json({ success: true, vehicles });
});

export const getVehiclesByStatus = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const vehicles = await vehicleModel.getVehiclesByStatus(status, limit, offset);
  res.status(200).json({ success: true, vehicles });
});
