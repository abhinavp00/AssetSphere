import axios from "axios";
import { BASE_URL } from "./config";

// Axios instance for DRF backend
const api = axios.create({
  baseURL: BASE_URL,
});

// --------- Asset Endpoints ---------
export const getAssets = () => api.get("/asset/");
export const createAsset = (data) => api.post("/asset/", data);
export const updateAsset = (id, data) => api.put(`/asset/${id}/`, data);
export const deleteAsset = (id) => api.delete(`/asset/${id}/`);

// --------- Inventory Endpoints ---------
export const getInventory = () => api.get("/inventory/");
export const createInventory = (data) => api.post("/inventory/", data);
export const updateInventory = (id, data) => api.put(`/inventory/${id}/`, data);
export const deleteInventory = (id) => api.delete(`/inventory/${id}/`);

// --------- Assignment Endpoints ---------
export const getAssignments = () => api.get("/assignment/");
export const createAssignment = (data) => api.post("/assignment/", data);
export const updateAssignment = (id, data) => api.put(`/assignment/${id}/`, data);
export const deleteAssignment = (id) => api.delete(`/assignment/${id}/`);

// --------- Tickets Endpoints ---------
export const getTickets = () => api.get("/tickets/");
export const createTicket = (data) => api.post("/tickets/", data);
export const updateTicket = (id, data) => api.put(`/tickets/${id}/`, data);
export const deleteTicket = (id) => api.delete(`/tickets/${id}/`);

// --------- Users Endpoints ---------
export const getUsers = () => api.get("/users/");
export const createUser = (data) => api.post("/users/", data);
export const updateUser = (id, data) => api.put(`/users/${id}/`, data);
export const deleteUser = (id) => api.delete(`/users/${id}/`);
