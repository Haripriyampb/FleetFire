import * as customerModel from '../models/customerModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await customerModel.createCustomer(req.body);
  res.status(201).json({ success: true, message: 'Customer created', customer });
});

export const getAllCustomers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const customers = await customerModel.getAllCustomers(limit, offset);
  res.status(200).json({ success: true, customers });
});

export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await customerModel.getCustomerById(req.params.id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.status(200).json({ success: true, customer });
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await customerModel.updateCustomer(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Customer updated', customer });
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await customerModel.deleteCustomer(req.params.id);
  res.status(200).json({ success: true, message: 'Customer deleted', customer });
});

export const searchCustomers = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const customers = await customerModel.searchCustomers(q, limit, offset);
  res.status(200).json({ success: true, customers });
});

export const getDeliveryHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const deliveries = await customerModel.getCustomerDeliveryHistory(req.params.id, limit, offset);
  res.status(200).json({ success: true, deliveries });
});
