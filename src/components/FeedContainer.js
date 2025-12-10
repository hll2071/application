"use client";

import styles from './FeedContainer.module.css';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { dataService } from '@/lib/data-service';

export default function FeedContainer() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const feedData = await dataService.getFeed();
            setPosts(feedData);
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
