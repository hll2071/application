import styles from './PostCard.module.css';
import { HeartIcon, HeartFillIcon, CommentIcon, BookmarkIcon, KebabHorizontalIcon } from '@primer/octicons-react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { dataService } from '@/lib/data-service';

export default function PostCard({ post }) {
    const { data: session } = useSession();
    const [likes, setLikes] = useState(post.likes);
    const [hasLiked, setHasLiked] = useState(post.hasLiked || false);
    const [comments, setComments] = useState(post.commentsList || []);
    const [commentCount, setCommentCount] = useState(post.comments);
    const [showComments, setShowComments] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(post.hasBookmarked || false);

    const handleBookmark = async () => {
        const newBookmarked = !isBookmarked;
        setIsBookmarked(newBookmarked);

        try {
            await dataService.toggleBookmark(post.id);
            if (newBookmarked) {
                // Add to recent activity
                await dataService.addToActivity(
                    `Bookmarked: ${post.content}`,
                    `You bookmarked a post by ${post.author?.name || post.user?.name}`
                );
            }
        } catch (error) {
            console.error("Failed to bookmark", error);
            setIsBookmarked(!newBookmarked);
        }
    };

    // ... inside return ...



    const handleLike = async () => {
        // Optimistic update
        const newHasLiked = !hasLiked;
        setHasLiked(newHasLiked);
        setLikes(prev => newHasLiked ? prev + 1 : Math.max(0, prev - 1));

        try {
            await dataService.likePost(post.id);
        } catch (error) {
            console.error("Failed to like post", error);
            // Revert on error
            setHasLiked(!newHasLiked);
            setLikes(prev => !newHasLiked ? prev + 1 : Math.max(0, prev - 1));
        }
    };

    const handleComment = async () => {
        if (!commentText.trim() || !session?.user) return;

        setIsSubmitting(true);
        try {
            // Use real user or fallback
            const user = {
                ...session.user,
                id: session.user.email || 'unknown',
                username: session.user.name || 'Anonymous',
                followers: 0,
                following: 0
            };

            const updatedPost = await dataService.addComment(post.id, commentText, user);

            setComments(updatedPost.commentsList || []);
            setCommentCount(updatedPost.comments);
            setCommentText("");
            setShowComments(true); // Auto open comments
        } catch (error) {
            console.error("Failed to add comment", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.userInfo}>
                    <img src={post.author?.image || post.user?.avatar} alt={post.author?.name || post.user?.name} className={styles.avatar} />
                    <div className={styles.userMeta}>
                        <span className={styles.username}>{post.author?.name || post.user?.name}</span>
                        <span className={styles.timestamp}>{new Date(post.createdAt || post.timestamp).toLocaleDateString()}</span>
                    </div>
                </div>
                <button className={styles.moreButton}>
                    <KebabHorizontalIcon size={16} />
                </button>
            </div>

            <div className={styles.content}>
                {post.image ? (
                    <div className={styles.imageContainer}>
                        <img src={post.image} alt="Post content" className={styles.postImage} />
                    </div>
                ) : post.code ? (
                    <div className={styles.codeBlock}>
                        <pre style={{ backgroundColor: '#f6f8fa', padding: '16px', borderRadius: '6px', overflow: 'auto' }}>
                            <code>{post.code}</code>
                        </pre>
                    </div>
                ) : (
                    <div className={styles.textContent}>
                        <p>{post.content}</p>
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                <div className={styles.actionButtons}>
                    <button className={styles.actionButton} onClick={handleLike}>
                        {hasLiked ? (
                            <HeartFillIcon size={24} fill="#fa4549" />
                        ) : (
                            <HeartIcon size={24} />
                        )}
                    </button>
                    <button className={styles.actionButton} onClick={() => setShowComments(!showComments)}>
                        <CommentIcon size={24} />
                    </button>
                    {/* Share button removed */}
                </div>
                <button className={styles.actionButton} onClick={handleBookmark}>
                    {isBookmarked ? <BookmarkIcon size={24} fill="currentColor" /> : <BookmarkIcon size={24} />}
                </button>
            </div>

            <div className={styles.footer}>
                <div className={styles.likes}>{likes.toLocaleString()} likes</div>
                <div className={styles.caption}>
                    <span className={styles.captionUsername}>{post.author?.name}</span> {post.content}
                </div>

                {commentCount > 0 && (
                    <button className={styles.viewComments} onClick={() => setShowComments(!showComments)}>
                        {showComments ? "Hide comments" : `View all ${commentCount} comments`}
                    </button>
                )}

                {showComments && (
                    <div className={styles.commentsList} style={{ marginTop: '10px', fontSize: '14px' }}>
                        {comments.map(comment => (
                            <div key={comment.id} style={{ marginBottom: '4px' }}>
                                <span style={{ fontWeight: '600', marginRight: '5px' }}>{comment.author.name}</span>
                                <span>{comment.text}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.addComment}>
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        className={styles.commentInput}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                        disabled={isSubmitting}
                    />
                    <button
                        className={styles.postButton}
                        onClick={handleComment}
                        disabled={!commentText.trim() || isSubmitting}
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}
