import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Comment from '../interfaces/Comment';
import styles from './TopicComments.module.css';
import { useStore, StoreState } from '../store/store';
import { useAddCommentToComment, useAddCommentToTopic, useDeleteComment } from '../api/topicApi';
import User from '../interfaces/User';
import CommentInput from './CommentInput';

export default function TopicComments({
  comments,
  author,
  topicId,
  isSubComments = false,
} : { comments: Comment[], author: User, topicId: number, isSubComments: boolean }) {
  const currentCommentToReplyToId = useStore((state: StoreState) => state.currentCommentToReplyToId);
  const setCurrentCommentToReplyToId = useStore((state) => state.setCurrentCommentToReplyToId);
  const [commentValue, setCommentValue] = useState<string>('');
  const queryClient = useQueryClient();
  const addCommentToTopic = useAddCommentToTopic(topicId, queryClient);
  const addCommentToComment = useAddCommentToComment(topicId, queryClient);
  const deleteComment = useDeleteComment(queryClient);

  const addComment = async (commentId: number | null) => {
    if (!commentValue) {
      return;
    }
    try {
      if (commentId) {
        await addCommentToComment.mutate({ commentId, author, body: commentValue });
      } else {
        await addCommentToTopic.mutate({ author, body: commentValue });
      }
      setCommentValue('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDelete = async (e, commentId: number) => {
    e.stopPropagation();
    await deleteComment.mutate({ topicId, commentId });
  };

  return (
    <div className={styles.comments}>
      {!isSubComments ? <h4 className={styles['comments-title']}>Comments</h4> : null }
      <ul>
        {comments.filter((comment) => !comment.removed).map((comment: Comment) => (
          <li key={comment.id}>
            <div
              className={styles.comment}
              onClick={() => setCurrentCommentToReplyToId(
                currentCommentToReplyToId === `${comment.id}${comment.author.name}` ? '' : `${comment.id}${comment.author.name}`,
              )}
              role="presentation"
            >
              <span className={styles['comment-author']}>{comment.author.name}</span>
              <span>{comment.body}</span>
              <span className={styles['comment-delete']} onClick={(e) => handleDelete(e, comment.id)} role="presentation">X</span>
            </div>
            {currentCommentToReplyToId === `${comment.id}${comment.author.name}`
              ? (
                <CommentInput
                  commentValue={commentValue}
                  setCommentValue={setCommentValue}
                  addComment={addComment}
                  commentId={comment.id}
                />
              ) : null }
            {comment.comments
              ? (
                <TopicComments
                  comments={comment.comments}
                  topicId={topicId}
                  isSubComments
                  className={styles['comment-subcomments']}
                />
              ) : null}
          </li>
        ))}
      </ul>
      {!isSubComments && !currentCommentToReplyToId ? (
        <CommentInput
          commentValue={commentValue}
          setCommentValue={setCommentValue}
          addComment={addComment}
          commentId={null}
        />
      ) : null }
    </div>
  );
}
