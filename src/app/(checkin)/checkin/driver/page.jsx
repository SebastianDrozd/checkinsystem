'use client';

import { useState } from "react";
import Link from "next/link";
import styles from "../../../styles/driverpage.module.css";
import { ArrowLeft } from "lucide-react";

export default function DriverCheckInPage() {
  const [formData, setFormData] = useState({
    visitType: "",
    lastName: "",
    firstName: "",
    cityFrom: "",
    companyFrom: "",
    carrierName: "",
    cargo: "",
    cargoDestination: "",
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
    console.log("driver form submitted", formData);

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
          <h1>Driver Check In</h1>
          <p>Please fill out the information below</p>
        </div>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label>Pick Up or Delivery</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioCard}>
                <input
                  type="radio"
                  name="visitType"
                  value="Pickup"
                  checked={formData.visitType === "Pickup"}
                  onChange={handleChange}
                />
                <span>Pick Up</span>
              </label>

              <label className={styles.radioCard}>
                <input
                  type="radio"
                  name="visitType"
                  value="Delivery"
                  checked={formData.visitType === "Delivery"}
                  onChange={handleChange}
                />
                <span>Delivery</span>
              </label>
            </div>
          </div>

          <div className={styles.grid}>
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
              <label htmlFor="cityFrom">What city are you coming from?</label>
              <input
                id="cityFrom"
                name="cityFrom"
                type="text"
                value={formData.cityFrom}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="companyFrom">What company are you from?</label>
              <input
                id="companyFrom"
                name="companyFrom"
                type="text"
                value={formData.companyFrom}
                onChange={handleChange}
                placeholder="Enter company name"
                autoComplete="organization"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="carrierName">Carrier Name</label>
              <input
                id="carrierName"
                name="carrierName"
                type="text"
                value={formData.carrierName}
                onChange={handleChange}
                placeholder="Enter carrier name"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="cargo">What is your cargo?</label>
              <input
                id="cargo"
                name="cargo"
                type="text"
                value={formData.cargo}
                onChange={handleChange}
                placeholder="Describe cargo"
              />
            </div>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label htmlFor="cargoDestination">Where is the cargo going?</label>
              <textarea
                id="cargoDestination"
                name="cargoDestination"
                value={formData.cargoDestination}
                onChange={handleChange}
                placeholder="Enter cargo destination"
                rows={4}
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