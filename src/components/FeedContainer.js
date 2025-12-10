"use client";

import styles from './FeedContainer.module.css';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

// Fallback mock data for demonstration if API fails
import { posts as mockPosts } from '../data/posts';

export default function FeedContainer() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            // In a real app, this would be your backend URL
            // const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/posts');
            // For now, we'll simulate an API call or use the mock data if the API isn't ready

            // Simulating API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // If we had a real backend:
            /*
            const res = await fetch('/api/posts');
            if (res.ok) {
              const data = await res.json();
              setPosts(data);
            }
            */

            // Using mock data for now to keep the UI working
            setPosts(mockPosts);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.stories}>
                <h2 className={styles.feedTitle}>Feed</h2>
            </div>
            {session && <CreatePost onPostCreated={fetchPosts} />}
            <div className={styles.feed}>
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>Loading feed...</p>
                ) : (
                    posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                )}
            </div>
        </div>
    );
}
