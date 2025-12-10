"use client";

import styles from './Header.module.css';
import { MarkGithubIcon, BellIcon, PlusIcon, SignInIcon, SignOutIcon } from '@primer/octicons-react';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuButton}>
          <svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
            <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"></path>
          </svg>
        </button>
        <a href="/" className={styles.logo}>
          <MarkGithubIcon size={32} fill="white" />
        </a>
        <div className={styles.searchContainer}>
          <input type="text" placeholder="Search or jump to..." className={styles.searchInput} />
          <span className={styles.searchSlash}>/</span>
        </div>
        <nav className={styles.nav}>
          <a href="#">Pull requests</a>
          <a href="#">Issues</a>
          <a href="#">Codespaces</a>
          <a href="#">Marketplace</a>
          <a href="#">Explore</a>
        </nav>
      </div>
      <div className={styles.right}>
        {session ? (
          <>
            <button className={styles.iconButton}>
              <BellIcon size={16} />
            </button>
            <div className={styles.dropdown}>
              <button className={styles.iconButton}>
                <PlusIcon size={16} /> <span className={styles.dropdownArrow}>▼</span>
              </button>
            </div>
            <button className={styles.avatarButton} onClick={() => signOut()}>
              <img src={session.user.image} alt={session.user.name} className={styles.avatar} />
              <span className={styles.dropdownArrow}>▼</span>
            </button>
          </>
        ) : (
          <button className={styles.loginButton} onClick={() => signIn('github')}>
            <SignInIcon size={16} /> Sign in
          </button>
        )}
      </div>
    </header>
  );
}
