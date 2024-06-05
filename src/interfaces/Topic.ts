import User from './User';

export interface Topic {
  id: number;
  author: User;
  title: string;
  body: string;
  comments: Comment[]
}
