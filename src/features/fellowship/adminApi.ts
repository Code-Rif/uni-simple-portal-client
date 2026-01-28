import api from "@/lib/axios";

export async function fetchAdminStats() {
  const res = await api.get("/admin/stats");
  return res.data.data;
}

// Fetch all users (admin)
export async function fetchAllUsers() {
  const res = await api.get("/admin/users?limit=100");
  return res.data.data;
}

// Toggle user active status (admin)
export async function toggleUserStatus(id: string) {
  const res = await api.patch(`/admin/users/${id}/toggle-status`);
  return res.data.data;
}

// Delete user (admin)
export async function deleteUser(id: string) {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data.data;
}
