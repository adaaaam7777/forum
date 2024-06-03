import User from './User';

export default interface Comment {
  id: number;
  body: string;
  comments: Comment[];
  author: User;
  removed?: boolean;
}
