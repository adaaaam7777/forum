import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateRole, useRoles, useUsers } from '../api/adminApi';
import styles from './Admin.module.css';
import { Role } from '../interfaces/Role';
import { Permission } from '../interfaces/Permission';
import RoleChooser from '../components/RoleChooser';
import User from '../interfaces/User';

export default function Admin() {
  const [selectedRole, setSelectedRole] = useState(null);
  const { data: roles, isLoading, isError } = useRoles();
  const { data: users } = useUsers<User[]>();
  const queryClient = useQueryClient();
  const updateRole = useUpdateRole(queryClient);

  const permissionsList: Permission[] = [
    { id: 1, name: 'Read comments', value: 1 },
    { id: 2, name: 'Add/delete comments', value: 2 },
    { id: 3, name: 'Add/delete topics', value: 4 },
    { id: 4, name: 'Delete others\' comments/topics', value: 8 },
  ];

  useEffect(() => {
    if (roles) {
      setSelectedRole(roles.data[0]);
    }
  }, [roles]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: Unable to fetch topics</div>;

  const handleRoleUpdate = async () => {
    await updateRole.mutate({ roleId: selectedRole.id, roleName: selectedRole.name, rights: selectedRole.rights });
  };

  const handlePermissionChange = (permissionValue: number) => {
    setSelectedRole((prevState) => ({ ...prevState, rights: prevState.rights ^ permissionValue }));
  };

  return (
    <div className="page">
      <label htmlFor="role-select">
        <span className={styles['role-label']}>Selected Role</span>
        <select
          id="role-select"
          onChange={(e) => setSelectedRole(roles.data.find((role) => role.id.toString() === e.target.value))}
          className={styles['role-select']}
        >
          {roles.data.map((role: Role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </label>
      <div>
        <h3>
          Edit Name:
        </h3>
        <input
          type="text"
          value={selectedRole ? selectedRole.name : ''}
          onChange={(e) => setSelectedRole((prevState) => ({ ...prevState, name: e.target.value }))}
        />
        <div className={styles['role-permissions']}>
          <h3>Permissions</h3>
          {permissionsList.map((permission) => (
            <label key={permission.id} htmlFor={permission.name}>
              <input
                name={permission.name}
                type="checkbox"
                checked={(selectedRole && selectedRole.rights & permission.value) !== 0}
                onChange={() => handlePermissionChange(permission.value)}
              />
              {permission.name}
            </label>
          ))}
        </div>
      </div>
      <button type="button" onClick={handleRoleUpdate} className={`${styles['role-modify']} button-general`}>Modify Role</button>
      <hr />
      { users && selectedRole ? <RoleChooser users={users.data} selectedRole={selectedRole} /> : null }
    </div>
  );
}
