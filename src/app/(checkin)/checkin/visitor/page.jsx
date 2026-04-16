'use client';

import { useState } from "react";
import Link from "next/link";
import styles from "../../../styles/visitorpage.module.css";
import { ArrowLeft } from "lucide-react";

const departmentOptions = [
  "Office",
  "Warehouse",
  "Production",
  "Maintenance",
  "Quality Assurance",
  "Shipping",
  "Receiving",
  "Human Resources",
  "Other",
];

export default function VisitorCheckInPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    department: "",
    company: "",
    purpose: "",
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
    console.log("visitor form submitted", formData);

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
          <h1>Visitor Check In</h1>
          <p>Please fill out the information below</p>
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

            <div className={styles.field}>
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select department</option>
                {departmentOptions.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                autoComplete="organization"
              />
            </div>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label htmlFor="purpose">Purpose of Visit</label>
              <textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Enter purpose of the visit"
                rows={5}
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