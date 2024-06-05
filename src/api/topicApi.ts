import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { API_URL } from '../config';
import User from '../interfaces/User';
import { Topic } from '../interfaces/Topic';

export const fetchTopics = async (): Promise<Topic[]> => {
  const response = await fetch(`${API_URL}/topics`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
};

export const createTopic = (title: string, body: string, author: User) => fetch(`${API_URL}/topic/add`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ title, body, author }),
});

export const addCommentToTopic = (topicId: number, author: User, body: string) => fetch(`${API_URL}/topic/${topicId}/comment/add`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ author, body }),
});

export const addCommentToComment = (
  topicId: number,
  commentId: string,
  author: string,
  body: string,
) => fetch(`${API_URL}/topic/${topicId}/comment/${commentId}/add`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    author, body,
  }),
});

export const deleteComment = (topicId: number, commentId: number) => fetch(`${API_URL}/topic/${topicId}/comment/${commentId}`, {
  method: 'DELETE',
});

export const useTopics = () => useQuery<Topic[]>({ queryKey: ['topics'], queryFn: () => fetchTopics() });

export const useCreateTopic = (queryClient: QueryClient) => useMutation({
  mutationFn: ({ title, body, author }) => createTopic(title, body, author),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['topics'] }),
});

export const useAddCommentToTopic = (topicId: number, queryClient: QueryClient) => useMutation({
  mutationFn: ({ author, body }: { author: User; body: string }) => addCommentToTopic(topicId, author, body),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['topics'] }),
});

export const useAddCommentToComment = (
  topicId: number,
  queryClient: QueryClient,
) => useMutation({
  mutationFn: ({ commentId, author, body }: {
    commentId: number,
    author: User,
    body: string }) => addCommentToComment(topicId, commentId, author, body),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['topics'] }),
});

export const useDeleteComment = (queryClient: QueryClient) => useMutation({
  mutationFn: ({ topicId, commentId }) => deleteComment(topicId, commentId),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['topics'] }),
});
