"use client";

import styles from './Sidebar.module.css';
import { RepoIcon, BookIcon } from '@primer/octicons-react';
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { dataService } from '@/lib/data-service';



export default function Sidebar() {
    const { data: session } = useSession();
    const [repos, setRepos] = useState([]);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        async function fetchActivities() {
            const data = await dataService.getActivities();
            setActivities(data);
        }

        fetchActivities();

        const handleActivityUpdate = () => {
            fetchActivities();
        };

        window.addEventListener('activity-updated', handleActivityUpdate);
        return () => window.removeEventListener('activity-updated', handleActivityUpdate);
    }, []);

    return (
        <aside className={styles.sidebar}>
            {/* ... repo section ... */}

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Recent activity</h2>
                {activities.length === 0 ? (
                    <div className={styles.activityBox}>
                        <p className={styles.activityText}>When you have activity, we'll show it here.</p>
                    </div>
                ) : (
                    <ul className={styles.activityList}>
                        {activities.map(activity => (
                            <li key={activity.id} className={styles.activityItem} style={{ marginBottom: '10px', fontSize: '13px' }}>
                                <div style={{ fontWeight: '600', marginBottom: '2px' }}>{activity.description}</div>
                                <div style={{ color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activity.text}</div>
                                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{new Date(activity.timestamp).toLocaleTimeString()}</div>
                            </li>
                        ))}
                    </ul>
                )}
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
