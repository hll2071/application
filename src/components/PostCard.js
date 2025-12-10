import styles from './PostCard.module.css';
import { HeartIcon, CommentIcon, ShareIcon, BookmarkIcon, KebabHorizontalIcon } from '@primer/octicons-react';

export default function PostCard({ post }) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.userInfo}>
                    <img src={post.user.avatar} alt={post.user.name} className={styles.avatar} />
                    <div className={styles.userMeta}>
                        <span className={styles.username}>{post.user.name}</span>
                        <span className={styles.timestamp}>{post.timestamp}</span>
                    </div>
                </div>
                <button className={styles.moreButton}>
                    <KebabHorizontalIcon size={16} />
                </button>
            </div>

            <div className={styles.content}>
                {post.content.type === 'image' ? (
                    <div className={styles.imageContainer}>
                        <img src={post.content.url} alt="Post content" className={styles.postImage} />
                    </div>
                ) : (
                    <div className={styles.codeBlock}>
                        <pre><code>{post.content.code}</code></pre>
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                <div className={styles.actionButtons}>
                    <button className={styles.actionButton}>
                        <HeartIcon size={24} />
                    </button>
                    <button className={styles.actionButton}>
                        <CommentIcon size={24} />
                    </button>
                    <button className={styles.actionButton}>
                        <ShareIcon size={24} />
                    </button>
                </div>
                <button className={styles.actionButton}>
                    <BookmarkIcon size={24} />
                </button>
            </div>

            <div className={styles.footer}>
                <div className={styles.likes}>{post.likes.toLocaleString()} likes</div>
                <div className={styles.caption}>
                    <span className={styles.captionUsername}>{post.user.name}</span> {post.content.caption}
                </div>
                <button className={styles.viewComments}>View all {post.comments} comments</button>
                <div className={styles.addComment}>
                    <input type="text" placeholder="Add a comment..." className={styles.commentInput} />
                    <button className={styles.postButton}>Post</button>
                </div>
            </div>
        </div>
    );
}
