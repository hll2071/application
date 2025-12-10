
import { MOCK_FEED, MOCK_REPOS, MOCK_USER, Post, Repository, User } from './mock-data';

const STORAGE_KEYS = {
    FEED: 'github_clone_feed',
    USER: 'github_clone_user',
    REPOS: 'github_clone_repos',
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

    async likePost(postId: string): Promise<void> {
        await delay(300);
        const currentFeed = await this.getFeed();
        const updatedFeed = currentFeed.map(post =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
        );
        this.setStorage(STORAGE_KEYS.FEED, updatedFeed);
    }
}

export const dataService = new MockDataService();
