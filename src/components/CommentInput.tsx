export default function CommentInput({
  commentValue,
  setCommentValue,
  addComment,
  commentId,
}: ({ commentValue: string, setCommentValue: (value) => void, addComment: (comment) => void, commentId: number | null })) {
  return (
    <>
      <input
        type="text"
        id="title"
        value={commentValue}
        onChange={(e) => setCommentValue(e.target.value)}
      />
      <button type="button" onClick={() => addComment(commentId)}>Add Comment</button>
    </>
  );
}
