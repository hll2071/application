import "./globals.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Provider from "../components/Provider";
import styles from "./layout.module.css";

export const metadata = {
  title: "GitHub Clone",
  description: "A GitHub clone with an Instagram-like feed",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <Header />
          <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
              {children}
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
