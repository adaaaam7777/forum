import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import styles from './RoleChooser.module.css';
import User from '../interfaces/User';
import { Role } from '../interfaces/Role';
import { useUpdateUserRole } from '../api/adminApi';
import UserOrderBy from '../enums/user-order-by.enum';
import RoleChooserOrderActions from './RoleChooserOrderActions';

export default function RoleChooser({ users, selectedRole }: ({ users: User[], selectedRole: Role })) {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userWithRoleOrderBy, setUserWithRoleOrderBy] = useState<UserOrderBy>(UserOrderBy.NONE);
  const [restUsersOrderBy, setRestUsersOrderBy] = useState<UserOrderBy>(UserOrderBy.NONE);
  const queryClient = useQueryClient();
  const updateUserRole = useUpdateUserRole(queryClient);
  const handleRemoveFromRole = async () => {
    await updateUserRole.mutate({ userId: selectedUserId, roleId: 1 });
  };

  const handleAddToRole = async () => {
    await updateUserRole.mutate({ userId: selectedUserId, roleId: selectedRole.id });
  };

  const handleUserDrop = async (userId: number, roleId: number) => {
    if (roleId === selectedRole.id) {
      await updateUserRole.mutate({ userId: selectedUserId, roleId: selectedRole.id });
    } else {
      await updateUserRole.mutate({ userId: selectedUserId, roleId: 1 });
    }
  };

  const handleDragStart = (event: React.DragEvent, userId: number) => {
    event.dataTransfer.setData('userId', userId.toString());
  };

  const handleDrop = async (event: React.DragEvent, newRoleId: number) => {
    const userId = parseInt(event.dataTransfer.getData('userId'), 10);
    handleUserDrop(userId, newRoleId);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const sortUsers = (userA: User, userB: User, orderBy: UserOrderBy): number => {
    switch (orderBy) {
      case UserOrderBy.NONE:
        return 0;
      case UserOrderBy.NAME:
        return userA.name.localeCompare(userB.name);
      case UserOrderBy.ID:
        return userA.id - userB.id;
      default:
        throw new Error(`Invalid UserOrderBy value: ${orderBy}`);
    }
  };

  return (
    <div className={styles['role-chooser-container']}>
      <div className={styles['role-chooser-user-with-role']}>
        <RoleChooserOrderActions setUserOrderBy={setUserWithRoleOrderBy} />
        <ul
          className={styles['role-chooser-user-with-role-list']}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, selectedRole.id)}
        >
          {users
            .filter((user) => user.role === selectedRole.id)
            .sort((a, b) => sortUsers(a, b, userWithRoleOrderBy))
            .map((user) => (
              <li
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                role="presentation"
                className={selectedUserId === user.id ? styles['role-chooser-selected-user'] : ''}
                draggable
                onDragStart={(e) => handleDragStart(e, user.id)}
              >
                {user.name}
              </li>
            ))}
        </ul>
      </div>
      <div className={styles['role-chooser-interchange']}>
        <button
          type="button"
          onClick={handleRemoveFromRole}
          className={`${styles['role-modify']} button-general`}
          disabled={users.find((user) => user.id === selectedUserId)?.role !== selectedRole.id}
        >
          Remove from role
        </button>
        <button
          type="button"
          onClick={handleAddToRole}
          className={`${styles['role-modify']} button-general`}
          disabled={users.find((user) => user.id === selectedUserId)?.role === selectedRole.id}
        >
          Add to Role
        </button>
      </div>
      <div className={styles['role-chooser-all-users']}>
        <RoleChooserOrderActions setUserOrderBy={setRestUsersOrderBy} />
        <ul
          className={styles['role-chooser-all-users-list']}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 1)}
        >
          {users
            .filter((user) => user.role !== selectedRole.id)
            .sort((a, b) => sortUsers(a, b, restUsersOrderBy))
            .map((user) => (
              <li
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                role="presentation"
                className={selectedUserId === user.id ? styles['role-chooser-selected-user'] : ''}
                draggable
                onDragStart={(e) => handleDragStart(e, user.id)}
              >
                {user.name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
