import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateTopic, useTopics } from '../api/topicApi';
import styles from './Home.module.css';
import TopicComments from '../components/TopicComments';

export default function Home() {
  const { data: topics, isLoading, isError } = useTopics();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [expandedTopicId, setExpandedTopicId] = useState<number | null>(null);
  const [newTopicError, setNewTopicError] = useState('');
  const queryClient = useQueryClient();
  const createTopic = useCreateTopic(title, body, queryClient);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: Unable to fetch topics</div>;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!event.target[0].value || !event.target[1].value) {
      setNewTopicError('Input cannot be empty');
      return;
    }
    if (newTopicError) {
      setNewTopicError('');
    }

    try {
      await createTopic.mutate();
      setTitle('');
      setBody('');
    } catch (error) {
      console.error('Error creating forum post:', error);
    }
  };

  const toggleComments = (postId: number) => {
    setExpandedTopicId((prevId) => (prevId === postId ? null : postId));
  };

  return (
    <div className={styles['forum-posts']}>
      <h1>Forum Posts</h1>
      <ul>
        {topics.data.map((topic: any) => (
          <li key={topic.id}>
            <h2 onClick={() => toggleComments(topic.id)} style={{ cursor: 'pointer' }} role="presentation">{topic.title}</h2>
            <p>{topic.body}</p>
            {expandedTopicId === topic.id ? <TopicComments topicId={topic.id} comments={topic.comments} /> : null }
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className={styles['add-topic-form']}>
        <h2>Add New Topic</h2>
        <div>
          <label htmlFor="title">
            Title:
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
        </div>
        <div>
          <label htmlFor="body">
            Body
            <textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} />
          </label>
        </div>
        { newTopicError && <p className={styles['new-topic-error']}>{newTopicError}</p> }
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
