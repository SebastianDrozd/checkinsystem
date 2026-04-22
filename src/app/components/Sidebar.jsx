'use client'
import {
  ChartAreaIcon,
  ClipboardList,
  Factory,
  File,
  House,
  ReceiptPoundSterling,
  Wrench,
} from "lucide-react";
import styles from "../styles/Sidebar.module.css";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();

  const path = usePathname()
  return (
    <aside className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.logoBox}>
          <Wrench size={18} />
        </div>
        <div>
          <p className={styles.eyebrow}>Bobak</p>
          <h2 className={styles.title}>Visitor System</h2>
        </div>
      </div>

      <nav className={styles.nav}>
        <p className={styles.sectionLabel}>Navigation</p>

        <ul className={styles.list}>
          <li onClick={() => router.push("/dashboard")}  className={`${styles.listItem} ${path ==("/dashboard") && styles.active}`}>
            <House size={18} />
            <span>Home</span>
          </li>  
         
          <li onClick={() => router.push("/signins")}  className={`${styles.listItem} ${path ==("/signins") && styles.active}`}>
            <ClipboardList size={18} />
            <span>Sign Ins</span>
          </li>  
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;