import api from "@/lib/axios";

export const updateProfile = async (data: any) => {
  // Only allow name and password to be updated
  const payload: any = {};
  if (data.name) payload.name = data.name;
  if (data.password) payload.password = data.password;
  // Email is not allowed to be updated
  const res = await api.put("/auth/profile", payload);
  return res.data;
};

export const changePassword = async ({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) => {
  const res = await api.put("/auth/change-password", {
    oldPassword,
    newPassword,
  });
  return res.data;
};
