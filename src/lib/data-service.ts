
import { MOCK_FEED, MOCK_REPOS, MOCK_USER, Post, Repository, User, Comment } from './mock-data';

const STORAGE_KEYS = {
    FEED: 'github_clone_feed_v2',
    USER: 'github_clone_user_v2',
    REPOS: 'github_clone_repos_v2',
    ACTIVITY: 'github_clone_activity_v2',
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockDataService {
    private getStorage<T>(key: string, initialData: T): T {
        if (typeof window === 'undefined') return initialData;

        const stored = localStorage.getItem(key);
        if (!stored) {
            localStorage.setItem(key, JSON.stringify(initialData));
            return initialData;
        }
        return JSON.parse(stored);
    }

    private setStorage<T>(key: string, data: T): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(key, JSON.stringify(data));
    }

    async getCurrentUser(): Promise<User> {
        await delay(500);
        return this.getStorage(STORAGE_KEYS.USER, MOCK_USER);
    }

    async getUserRepos(): Promise<Repository[]> {
        await delay(600);
        return this.getStorage(STORAGE_KEYS.REPOS, MOCK_REPOS);
    }

    async getFeed(): Promise<Post[]> {
        await delay(800);
        return this.getStorage(STORAGE_KEYS.FEED, MOCK_FEED);
    }

    async createPost(content: string, user: User, imageUrl?: string, codeSnippet?: string): Promise<Post> {
        await delay(1000);

        const newPost: Post = {
            id: `post-${Date.now()}`,
            content,
            image: imageUrl,
            code: codeSnippet,
            author: user,
            createdAt: new Date().toISOString(),
            likes: 0,
            comments: 0
        };

        const currentFeed = await this.getFeed();
        const updatedFeed = [newPost, ...currentFeed];
        this.setStorage(STORAGE_KEYS.FEED, updatedFeed);

        return newPost;
    }

    async likePost(postId: string): Promise<Post> {
        await delay(300);
        const currentFeed = await this.getFeed();
        let updatedPost: Post | undefined;

        const updatedFeed = currentFeed.map(post => {
            if (post.id === postId) {
                const hasLiked = !post.hasLiked;
                updatedPost = {
                    ...post,
                    hasLiked,
                    likes: hasLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
                };
                return updatedPost;
            }
            return post;
        });

        this.setStorage(STORAGE_KEYS.FEED, updatedFeed);
        if (!updatedPost) throw new Error("Post not found");
        return updatedPost;
    }

    async addComment(postId: string, text: string, user: User): Promise<Post> {
        await delay(500);
        const currentFeed = await this.getFeed();
        let updatedPost: Post | undefined;

        const updatedFeed = currentFeed.map(post => {
            if (post.id === postId) {
                const newComment: Comment = {
                    id: `comment-${Date.now()}`,
                    text,
                    author: user,
                    createdAt: new Date().toISOString()
                };
                updatedPost = {
                    ...post,
                    comments: post.comments + 1,
                    commentsList: [...(post.commentsList || []), newComment]
                };
                return updatedPost;
            }
            return post;
        });

        this.setStorage(STORAGE_KEYS.FEED, updatedFeed);
        if (!updatedPost) throw new Error("Post not found");
        return updatedPost;
    }

    async getActivities(): Promise<import('./mock-data').Activity[]> {
        await delay(200);
        return this.getStorage(STORAGE_KEYS.ACTIVITY, []);
    }

    async addToActivity(text: string, description: string): Promise<void> {
        // No artificial delay for snappier UI
        const currentActivities = this.getStorage(STORAGE_KEYS.ACTIVITY, []);
        const newActivity = {
            id: `activity-${Date.now()}`,
            text,
            description,
            timestamp: new Date().toISOString()
        };
        const updatedActivities = [newActivity, ...currentActivities].slice(0, 10); // Keep last 10
        this.setStorage(STORAGE_KEYS.ACTIVITY, updatedActivities);

        // Dispatch custom event for real-time updates
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('activity-updated'));
        }
    }

    async toggleBookmark(postId: string): Promise<boolean> {
        await delay(200);
        const currentFeed = await this.getFeed();
        let isBookmarked = false;

        const updatedFeed = currentFeed.map(post => {
            if (post.id === postId) {
                isBookmarked = !post.hasBookmarked;
                return { ...post, hasBookmarked: isBookmarked };
            }
            return post;
        });

        this.setStorage(STORAGE_KEYS.FEED, updatedFeed);
        return isBookmarked;
    }
}

export const dataService = new MockDataService();
