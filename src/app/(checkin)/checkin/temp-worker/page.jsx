'use client';

import { useState } from "react";
import Link from "next/link";
import styles from "../../../styles/tempworker.module.css";
import { ArrowLeft } from "lucide-react";

export default function TempWorkerCheckInPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("temp worker form submitted", formData);

    // submit to backend here
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.topBar}>
          <Link href="/checkin" className={styles.backButton}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>
        </div>

        <div className={styles.header}>
          <h1>Temp Worker Check In</h1>
          <p>Please enter your name</p>
        </div>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                autoComplete="given-name"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitButton}>
              Check In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}