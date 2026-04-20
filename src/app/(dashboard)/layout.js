
import styles from "../styles/DashboardLayout.module.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";



export default function DashboardLayout({ children }) {
  return (
    <html>
      <body>
            <div className={styles.container}>
              <Navbar />
              {children}
            </div>
      </body>
    </html>
  );
}