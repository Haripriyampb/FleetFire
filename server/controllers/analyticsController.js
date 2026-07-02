import * as analyticsModel from '../models/analyticsModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const metrics = await analyticsModel.getDashboardMetrics();
  res.status(200).json({ success: true, metrics });
});

export const getMonthlyDeliveries = asyncHandler(async (req, res) => {
  const { months = 12 } = req.query;
  const data = await analyticsModel.getMonthlyDeliveries(months);
  res.status(200).json({ success: true, data });
});

export const getVehicleUsage = asyncHandler(async (req, res) => {
  const data = await analyticsModel.getVehicleUsage();
  res.status(200).json({ success: true, data });
});

export const getDriverPerformance = asyncHandler(async (req, res) => {
  const data = await analyticsModel.getDriverPerformance();
  res.status(200).json({ success: true, data });
});

export const getFuelConsumption = asyncHandler(async (req, res) => {
  const { months = 12 } = req.query;
  const data = await analyticsModel.getFuelConsumption(months);
  res.status(200).json({ success: true, data });
});

export const getRevenue = asyncHandler(async (req, res) => {
  const { months = 12 } = req.query;
  const data = await analyticsModel.getRevenueAnalytics(months);
  res.status(200).json({ success: true, data });
});

export const getOrderStatistics = asyncHandler(async (req, res) => {
  const data = await analyticsModel.getOrderStatistics();
  res.status(200).json({ success: true, data });
});
