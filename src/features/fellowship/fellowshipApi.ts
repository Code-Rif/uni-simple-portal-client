// Admin: Update a fellowship
export async function updateFellowship(
  id: string,
  data: Partial<Fellowship>,
): Promise<Fellowship> {
  const res = await api.put(`/fellowships/${id}`, data);
  return res.data.data;
}

// Admin: Delete a fellowship
export async function deleteFellowship(id: string): Promise<void> {
  await api.delete(`/fellowships/${id}`);
}

// Admin: Update fellowship status
export async function updateFellowshipStatus(
  id: string,
  status: string,
): Promise<Fellowship> {
  const res = await api.patch(`/fellowships/${id}/status`, { status });
  return res.data.data;
}
// Withdraw a fellowship application (student)
export async function withdrawFellowshipApplication(id: string): Promise<void> {
  await api.delete(`${APPLICATION_API_BASE}/${id}/withdraw`);
}
import api from "@/lib/axios";
// Admin: Create a fellowship
export async function createFellowship(
  data: Partial<Fellowship>,
): Promise<Fellowship> {
  const res = await api.post("/fellowships", data);
  return res.data.data;
}
// Fellowship API functions matching server-side endpoints
import axios from "axios";
import {
  Fellowship,
  FellowshipApplication,
  FellowshipStatus,
  FellowshipCategory,
  FellowshipApplicationStatus,
} from "./fellowshipTypes";

const API_BASE = "/fellowships";
const APPLICATION_API_BASE = "/fellowship-applications";

// Get all fellowships (with optional filters)
export async function fetchFellowships(params?: {
  page?: number;
  limit?: number;
  category?: FellowshipCategory;
  status?: FellowshipStatus;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}): Promise<{ fellowships: Fellowship[]; pagination: any }> {
  const res = await api.get(API_BASE, { params });
  return res.data.data;
}

// Get fellowship by ID
export async function fetchFellowshipById(id: string): Promise<Fellowship> {
  const res = await api.get(`${API_BASE}/${id}`);
  return res.data.data;
}

// Get fellowships by category
export async function fetchFellowshipsByCategory(
  category: FellowshipCategory,
  params?: { page?: number; limit?: number },
): Promise<{ fellowships: Fellowship[]; pagination: any }> {
  const res = await api.get(`${API_BASE}/category/${category}`, { params });
  return res.data.data;
}

// Apply for a fellowship
export async function applyForFellowship(data: {
  fellowshipId: string;
  applicationData: FellowshipApplication["applicationData"];
  documents?: FellowshipApplication["documents"];
}): Promise<FellowshipApplication> {
  const res = await api.post(`${APPLICATION_API_BASE}/`, data);
  return res.data.data;
}

// Get user's own applications
export async function fetchMyApplications(params?: {
  page?: number;
  limit?: number;
  status?: FellowshipApplicationStatus;
}): Promise<{ applications: FellowshipApplication[]; pagination: any }> {
  const res = await api.get(`${APPLICATION_API_BASE}/my-applications`, {
    params,
  });
  return res.data.data;
}

// Get application by ID
export async function fetchApplicationById(
  id: string,
): Promise<FellowshipApplication> {
  const res = await api.get(`${APPLICATION_API_BASE}/${id}`);
  return res.data.data;
}
