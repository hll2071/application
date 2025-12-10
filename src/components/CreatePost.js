"use client";

import styles from './CreatePost.module.css';
import { FileMediaIcon, CodeIcon } from '@primer/octicons-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { dataService } from '@/lib/data-service';

export default function CreatePost({ onPostCreated }) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!session) return null;

  const handleImageClick = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      setImageUrl(url);
      setCodeSnippet(""); // mutually exclusive for simplicity
    }
  };

  const handleCodeClick = () => {
    const code = window.prompt("Enter code snippet:");
    if (code) {
      setCodeSnippet(code);
      setImageUrl(""); // mutually exclusive for simplicity
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl && !codeSnippet) return;

    setIsSubmitting(true);
    try {
      // Use the real session user, adapting it to the expected User interface if needed
      const user = {
        ...session.user,
        id: session.user.email || 'unknown', // Fallback ID
        username: session.user.name || 'Anonymous', // Fallback username
        followers: 0,
        following: 0
      };
      await dataService.createPost(content, user, imageUrl, codeSnippet);

      setContent("");
      setImageUrl("");
      setCodeSnippet("");
      if (onPostCreated) onPostCreated();

    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post");
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
      {(imageUrl || codeSnippet) && (
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666', padding: '0 10px' }}>
          {imageUrl && <span>📷 Image attached</span>}
          {codeSnippet && <span>💻 Code attached</span>}
          <button onClick={() => { setImageUrl(""); setCodeSnippet(""); }} style={{ marginLeft: '10px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
        </div>
      )}
      <div className={styles.actions}>
        <div className={styles.mediaButtons}>
          <button className={styles.mediaButton} onClick={handleImageClick}>
            <FileMediaIcon size={16} /> Photo/Video
          </button>
          <button className={styles.mediaButton} onClick={handleCodeClick}>
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
