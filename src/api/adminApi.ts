import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { API_URL } from '../config';

export const fetchRoles = async () => {
  const response = await fetch(`${API_URL}/roles`);
  if (!response.ok) {
    throw new Error('Failed to fetch roles');
  }
  return response.json();
};

export const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch roles');
  }
  return response.json();
};

export const fetchUser = async (userId) => {
  const response = await fetch(`${API_URL}/user/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch roles');
  }
  return response.json();
};

export const updateUser = (userId: number, name: string, email: string) => fetch(`${API_URL}/user/${userId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name, email }),
});

export const updateUserRole = (userId: number, roleId: number) => fetch(`${API_URL}/user/${userId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ role: roleId }),
});

export const updatePassword = (userId: number, password1: string, password2: string) => fetch(`${API_URL}/user/${userId}/password`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ password1, password2 }),
});

export const updateRole = (roleId: number, roleName: string, rights: number) => fetch(`${API_URL}/role/${roleId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: roleName, rights }),
});

export const useUpdateRole = (queryClient: QueryClient) => useMutation({
  mutationFn: ({ roleId, roleName, rights }: {
    roleId: number,
    roleName: string,
    rights: number
  }) => updateRole(roleId, roleName, rights),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
});

export const useUpdateUserRole = (queryClient: QueryClient) => useMutation({
  mutationFn: ({ userId, roleId }: { userId: number, roleId: number, }) => updateUserRole(userId, roleId),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
});

export const useRoles = () => useQuery({ queryKey: ['roles'], queryFn: () => fetchRoles() });
export const useUsers = () => useQuery({ queryKey: ['users'], queryFn: () => fetchUsers() });
export const useUser = (userId) => useQuery({ queryKey: ['user', userId], queryFn: () => fetchUser(userId) });

export const useUpdateUser = () => useMutation({
  mutationFn: ({ userId, name, email }: {
    userId: number,
    name: string,
    email: string
  }) => updateUser(userId, name, email),
});

export const useUpdatePassword = (queryClient: QueryClient) => useMutation({
  mutationFn: ({ userId, password1, password2 }: {
    userId: number,
    password1: string,
    password2: string
  }) => updatePassword(userId, password1, password2),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
});
