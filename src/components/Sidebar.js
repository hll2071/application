"use client";

import styles from './Sidebar.module.css';
import { RepoIcon, BookIcon } from '@primer/octicons-react';
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';

const mockRepos = [
    { name: 'hsm/github-clone', private: false },
    { name: 'hsm/awesome-project', private: true },
    { name: 'facebook/react', private: false },
    { name: 'vercel/next.js', private: false },
    { name: 'hsm/portfolio', private: false },
    { name: 'google/gemini', private: true },
    { name: 'hsm/notes', private: true },
];

export default function Sidebar() {
    const { data: session } = useSession();
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchRepos() {
            if (session?.accessToken) {
                setLoading(true);
                try {
                    const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=7', {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setRepos(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch repos", error);
                } finally {
                    setLoading(false);
                }
            }
        }

        if (session) {
            fetchRepos();
        }
    }, [session]);

    const displayRepos = session ? repos : mockRepos;

    return (
        <aside className={styles.sidebar}>
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        {session ? "Your Repositories" : "Top Repositories"}
                    </h2>
                    <button className={styles.newButton}>
                        <RepoIcon size={16} /> New
                    </button>
                </div>
                <div className={styles.repoInputContainer}>
                    <input type="text" placeholder="Find a repository..." className={styles.repoInput} />
                </div>
                <ul className={styles.repoList}>
                    {loading ? (
                        <li className={styles.loading}>Loading...</li>
                    ) : (
                        displayRepos.map((repo) => (
                            <li key={repo.id || repo.name} className={styles.repoItem}>
                                <div className={styles.repoIcon}>
                                    {repo.private ? <BookIcon size={16} /> : <RepoIcon size={16} />}
                                </div>
                                <a href={repo.html_url || "#"} className={styles.repoName}>
                                    {session ? repo.full_name : repo.name}
                                </a>
                            </li>
                        ))
                    )}
                </ul>
                <button className={styles.showMore}>Show more</button>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Recent activity</h2>
                <div className={styles.activityBox}>
                    <p className={styles.activityText}>When you have activity, we'll show it here.</p>
                </div>
            </div>

            <div className={styles.footer}>
                <p>© 2025 GitHub, Inc.</p>
                <div className={styles.footerLinks}>
                    <a href="#">Blog</a>
                    <a href="#">About</a>
                    <a href="#">Shop</a>
                    <a href="#">Contact GitHub</a>
                    <a href="#">Pricing</a>
                    <a href="#">API</a>
                    <a href="#">Training</a>
                    <a href="#">Status</a>
                    <a href="#">Security</a>
                    <a href="#">Terms</a>
                    <a href="#">Privacy</a>
                    <a href="#">Docs</a>
                </div>
            </div>
        </aside>
    );
}
