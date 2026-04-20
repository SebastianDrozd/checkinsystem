'use client';

import Link from "next/link";
import styles from "../../styles/checkin.module.css";
import { Building2, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function CheckInLayout({ children }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const formattedTime = now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });

      const formattedDate = now.toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      setTime(formattedTime);
      setDate(formattedDate);
    };

    updateDateTime(); // initial run

    const interval = setInterval(updateDateTime, 1000); // update every second

    return () => clearInterval(interval);
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.leftInner}>
          <div className={styles.brandRow}>
            <div className={styles.brandIcon}>
              <Building2 size={18} strokeWidth={2.2} />
            </div>
            <span className={styles.brandText}>Bobak Sausage Company</span>
          </div>

          <div className={styles.heroContent}>
            <h1 className={styles.title}>Welcome.</h1>
            <p className={styles.subtitle}>
              Let&apos;s get you signed in. Choose a check-in type on the right to continue.
            </p>

            <div className={styles.timeChip}>
              <span className={styles.statusDot} />
              <span className={styles.timeText}>{time}</span>
              <span className={styles.dividerDot}>·</span>
              <span className={styles.dateText}>{date}</span>
            </div>
            <div>
              
            </div>
             <span>Already signed in?</span>
            <Link href="/signout" className={styles.signOutLink}>
              Click here to sign out <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.footerNote}>
           
          </div>

          <div className={styles.glowOne} />
          <div className={styles.glowTwo} />
          <div className={styles.glowThree} />
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.rightInner}>
          {children}
        </div>
      </div>
    </div>
  );
}