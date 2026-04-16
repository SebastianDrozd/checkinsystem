'use client';

import Link from "next/link";
import styles from "../../styles/checkin.module.css";
import { User, Truck, HardHat, Users } from "lucide-react";

const options = [
  {
    label: "Visitor",
    description: "General guests and meetings",
    href: "/checkin/visitor",
    icon: User,
  },
  {
    label: "Driver",
    description: "Deliveries and pickups",
    href: "/checkin/driver",
    icon: Truck,
  },
  {
    label: "Temp Worker",
    description: "Agency or temporary staff",
    href: "/checkin/temp-worker",
    icon: Users,
  },
  {
    label: "Contractor / Service Worker",
    description: "Vendors, contractors, and service visits",
    href: "/checkin/contractor",
    icon: HardHat,
  },
];

export default function CheckInHome() {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1>Welcome</h1>
          <p>Please select your check-in type</p>
        </div>

        <div className={styles.grid}>
          {options.map((option) => {
            const Icon = option.icon;

            return (
              <Link key={option.href} href={option.href} className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Icon size={34} strokeWidth={2} />
                </div>

                <div className={styles.cardContent}>
                  <h2>{option.label}</h2>
                  <p>{option.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* SIGN OUT LINK */}
        <div className={styles.footer}>
          <Link href="/checkin/signout" className={styles.signOutLink}>
            Already signed in? Click here to sign out
          </Link>
        </div>
      </div>
    </div>
  );
}