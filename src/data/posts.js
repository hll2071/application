export const posts = [
    {
        id: 1,
        user: {
            name: "vercel",
            avatar: "https://github.com/vercel.png",
        },
        timestamp: "2h ago",
        content: {
            type: "image",
            url: "https://assets.vercel.com/image/upload/v1664158164/front/next-conf-2022/og.png", // Placeholder image
            caption: "Next.js Conf is coming! 🚀 #nextjs #react",
        },
        likes: 1240,
        comments: 45,
    },
    {
        id: 2,
        user: {
            name: "reactjs",
            avatar: "https://github.com/reactjs.png",
        },
        timestamp: "5h ago",
        content: {
            type: "code",
            language: "javascript",
            code: `function App() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}`,
            caption: "Just a simple Hello World component. Clean and functional.",
        },
        likes: 890,
        comments: 12,
    },
    {
        id: 3,
        user: {
            name: "hsm",
            avatar: "https://github.com/github.png",
        },
        timestamp: "1d ago",
        content: {
            type: "image",
            url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            caption: "Working on a new GitHub clone project! 💻 #coding #webdev",
        },
        likes: 56,
        comments: 8,
    },
];
