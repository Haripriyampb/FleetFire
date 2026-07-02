import * as driverModel from '../models/driverModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createDriver = asyncHandler(async (req, res) => {
  const driver = await driverModel.createDriver(req.body);
  res.status(201).json({ success: true, message: 'Driver created', driver });
});

export const getAllDrivers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const drivers = await driverModel.getAllDrivers(limit, offset);
  res.status(200).json({ success: true, drivers });
});

export const getDriverById = asyncHandler(async (req, res) => {
  const driver = await driverModel.getDriverById(req.params.id);
  if (!driver) return res.status(404).json({ message: 'Driver not found' });
  res.status(200).json({ success: true, driver });
});

export const updateDriver = asyncHandler(async (req, res) => {
  const driver = await driverModel.updateDriver(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Driver updated', driver });
});

export const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await driverModel.deleteDriver(req.params.id);
  res.status(200).json({ success: true, message: 'Driver deleted', driver });
});

export const assignVehicle = asyncHandler(async (req, res) => {
  const { vehicleId } = req.body;
  const driver = await driverModel.assignVehicleToDriver(req.params.id, vehicleId);
  res.status(200).json({ success: true, message: 'Vehicle assigned', driver });
});

export const getDriverPerformance = asyncHandler(async (req, res) => {
  const performance = await driverModel.getDriverPerformance(req.params.id);
  res.status(200).json({ success: true, performance });
});
