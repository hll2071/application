"use client";

import styles from './CreatePost.module.css';
import { FileMediaIcon, CodeIcon } from '@primer/octicons-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function CreatePost({ onPostCreated }) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!session) return null;

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      // API call to create post
      /*
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + session.accessToken
        },
        body: JSON.stringify({
          caption: content,
          type: 'text',
        }),
      });
      
      if (res.ok) {
        setContent("");
        if (onPostCreated) onPostCreated();
      }
      */

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Post created:", content);
      setContent("");
      alert("Post created! (Simulated)");

    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        <img src={session.user.image} alt={session.user.name} className={styles.avatar} />
        <input
          type="text"
          placeholder="What's on your mind?"
          className={styles.input}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div className={styles.actions}>
        <div className={styles.mediaButtons}>
          <button className={styles.mediaButton}>
            <FileMediaIcon size={16} /> Photo/Video
          </button>
          <button className={styles.mediaButton}>
            <CodeIcon size={16} /> Code Snippet
          </button>
        </div>
        <button
          className={styles.postButton}
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
          style={{ opacity: (isSubmitting || !content.trim()) ? 0.5 : 1 }}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
}
