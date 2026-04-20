'use client';

import Link from "next/link";
import styles from "../../styles/checkin.module.css";
import { User, Truck, Users, Briefcase } from "lucide-react";

const options = [
  {
    href: "/checkin/visitor",
    label: "Visitor",
    description: "General guests and meetings",
    icon: User,
    colorClass: "blue",
  },
  {
    href: "/checkin/driver",
    label: "Driver",
    description: "Deliveries and pickups",
    icon: Truck,
    colorClass: "orange",
  },
  {
    href: "/checkin/temp-worker",
    label: "Temp Worker",
    description: "Agency or temporary staff",
    icon: Users,
    colorClass: "purple",
  },
  {
    href: "/checkin/contractor",
    label: "Contractor / Service Worker",
    description: "Vendors, contractors, and service visits",
    icon: Briefcase,
    colorClass: "green",
  },
];

export default function CheckInHomePage() {
  return (
    <>
      <div className={styles.rightHeader}>
        <span className={styles.sectionLabel}>Check-in type</span>
      </div>

      <div className={styles.cardList}>
        {options.map((option, index) => {
          const Icon = option.icon;

          return (
            <Link
              key={option.href}
              href={option.href}
              className={`${styles.optionCard} ${styles.fadeInCard}`}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className={styles.optionLeft}>
                <div className={`${styles.optionIcon} ${styles[option.colorClass]}`}>
                  <Icon size={24} strokeWidth={2} />
                </div>

                <div className={styles.optionContent}>
                  <h2>{option.label}</h2>
                  <p>{option.description}</p>
                </div>
              </div>

              <div className={styles.optionArrow}>→</div>
            </Link>
          );
        })}
      </div>
    </>
  );
}