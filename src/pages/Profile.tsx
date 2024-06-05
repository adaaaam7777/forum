import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useRoles, useUpdatePassword, useUpdateUser, useUser,
} from '../api/adminApi';
import permissions from '../constants/permissions';
import styles from './Profile.module.css';
import { useTopics } from '../api/topicApi';
import { Topic } from '../interfaces/Topic';
import { Role } from '../interfaces/Role';
import User from '../interfaces/User';

export default function Profile() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState({});
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useUser<User>(2);
  const { data: roles, isLoading: isRoleLoading, isError: isRoleError } = useRoles<Role[]>();
  const { data: topics, isLoading: isTopicsLoading, isError: isTopicsError } = useTopics<Topic[]>();
  const queryClient = useQueryClient();
  const updateUser = useUpdateUser();
  const updatePassword = useUpdatePassword(queryClient);

  if (isUserLoading || isRoleLoading || isTopicsLoading) return <div>Loading...</div>;
  if (isUserError || isRoleError || isTopicsError) return <div>Error: Unable to fetch</div>;

  const userPermissions = permissions
    .filter((permission) => (roles.data.find((role) => role.id === user.data.role).rights
    & permission.value) === permission.value)
    .map((permission) => permission.value);

  const getNumberOfCommentsPerUser = (): number => {
    let count = 0;

    const getComments = (comments: Comment[]) => {
      for (const comment of comments) {
        if (comment.author.id === user.data.id) {
          count += 1;
        }
        if (comment.comments.length) {
          getComments(comment.comments);
        }
      }
    };

    for (const topic of topics.data) {
      if (topic.comments.length) {
        getComments(topic.comments);
      }
    }

    return count;
  };

  const validateForm = () => {
    const formErrors = {};

    if (name.length < 5) {
      formErrors.name = 'Name must be at least 5 characters long.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formErrors.email = 'Please enter a valid email address.';
    }

    const passwordPattern = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);
    if (password && !passwordPattern.test(password)) {
      formErrors.password = 'Password must be at least 8 characters long,'
          + 'contain at least one uppercase letter, one lowercase letter, and one digit.';
    }

    if (password !== confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await updateUser.mutateAsync({ userId: user.data.id, name, email });
        await updatePassword.mutateAsync({ userId: user.data.id, password1: password, password2: confirmPassword });
        await queryClient.invalidateQueries({ queryKey: ['user', user.data.id] });

        console.log('User data and password updated successfully');
      } catch (error) {
        setErrors({ api: error.message });
      }
    }
  };

  return (
    <div className="page">
      <h2>{user.data.name}</h2>
      <div>
        <span>Role: </span>
        <span>{roles.data.find((role) => role.id === user.data.role).name}</span>
      </div>
      <div className={styles['profile-permissions']}>
        <div>Permissions: </div>
        <div className={styles['profile-permissions-list']}>
          {permissions.map((permission) => (
            <span
              key={permission.value}
              className={userPermissions.includes(permission.value)
                ? styles['profile-permission-has']
                : styles['profile-permission-has-not']}
            >
              {permission.name}
            </span>
          ))}
        </div>
      </div>
      <div className={styles['profile-summary']}>
        <span>Topics:</span>
        <span>{topics.data.reduce((acc, next) => (next.author.id === user.data.id ? acc + 1 : acc), 0)}</span>
        <span>Comments:</span>
        <span>{getNumberOfCommentsPerUser()}</span>
      </div>
      <form id="userForm" onSubmit={handleSubmit} className={styles['profile-form']}>
        <div className={styles['profile-form-field']}>
          <label htmlFor="name">
            Name:
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>
        <div className={styles['profile-form-field']}>
          <label htmlFor="email">
            Email:
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
        <div className={styles['profile-form-field']}>
          <label htmlFor="password">
            Password:
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>
        <div className={styles['profile-form-field']}>
          <label htmlFor="confirmPassword">
            Confirm Password:
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
        </div>
        <div>
          <button type="submit" className="button-general">Modify</button>
        </div>
      </form>
    </div>
  );
}
