
export interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    username: string;
    bio?: string;
    followers: number;
    following: number;
}

export interface Repository {
    id: number;
    name: string;
    description: string;
    language: string;
    stargazers_count: number;
    updated_at: string;
    html_url: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

export interface Comment {
    id: string;
    text: string;
    author: User;
    createdAt: string;
}

export interface Post {
    id: string;
    content: string;
    author: User;
    createdAt: string;
    likes: number;
    hasLiked?: boolean;
    comments: number;
    commentsList?: Comment[];
    image?: string;
    code?: string;
}

export const MOCK_USER: User = {
    id: "mock-user-1",
    name: "Gildong Hong",
    email: "gildong@example.com",
    image: "https://avatars.githubusercontent.com/u/1?v=4",
    username: "gildong-hong",
    bio: "Frontend Developer | Open Source Enthusiast",
    followers: 124,
    following: 89
};

export const MOCK_REPOS: Repository[] = [
    {
        id: 1,
        name: "react-awesome-component",
        description: "A very awesome react component library",
        language: "TypeScript",
        stargazers_count: 1240,
        updated_at: "2024-03-15T10:00:00Z",
        html_url: "https://github.com/example/react-awesome-component",
        owner: {
            login: "gildong-hong",
            avatar_url: MOCK_USER.image
        }
    },
    {
        id: 2,
        name: "nextjs-boilerplate",
        description: "My personal Next.js starter template",
        language: "JavaScript",
        stargazers_count: 56,
        updated_at: "2024-02-28T14:30:00Z",
        html_url: "https://github.com/example/nextjs-boilerplate",
        owner: {
            login: "gildong-hong",
            avatar_url: MOCK_USER.image
        }
    },
    {
        id: 3,
        name: "algorithm-study",
        description: "Daily algorithm problem solving",
        language: "Python",
        stargazers_count: 12,
        updated_at: "2024-03-20T09:15:00Z",
        html_url: "https://github.com/example/algorithm-study",
        owner: {
            login: "gildong-hong",
            avatar_url: MOCK_USER.image
        }
    }
];

export const MOCK_FEED: Post[] = [];
