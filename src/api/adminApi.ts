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

export const updateUserRole = (userId: number, roleId: number) => fetch(`${API_URL}/user/${userId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ role: roleId }),
});

export const updateRole = (roleId: number, roleName: string, rights: number) => fetch(`${API_URL}/role/${roleId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: roleName, rights }),
});

export const useUpdateRole = (queryClient: QueryClient) => useMutation({
  mutationFn: ({
    roleId,
    roleName,
    rights,
  }: {
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
