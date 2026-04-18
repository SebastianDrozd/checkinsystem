'use client';

import { useState } from "react";
import Link from "next/link";
import styles from "../../../styles/contractor.module.css";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { CreateNewContractor } from "@/api/guests";

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

export default function ContractorCheckInPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    department: "",
    company: "",
    purpose: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = "Purpose is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const data = {
      FirstName : formData.firstName,
      LastName : formData.lastName,
      Department : formData.department,
      Company : formData.company,
      Purpose : formData.purpose
    }
    saveMutation.mutate(data);

    console.log("contractor form submitted", formData);

    // submit to backend here
  };

  const saveMutation = useMutation({
      mutationFn : (data) => CreateNewContractor(data),
      onSuccess : (data) => {
        console.log("contractor created", data);  
      },
      onError : (error) => {
        console.error("error creating contractor", error);
      }
  })
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
          <h1>Contractor / Service Worker Check In</h1>
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
                className={errors.firstName ? styles.inputError : ""}
              />
              {errors.firstName && (
                <span className={styles.errorText}>{errors.firstName}</span>
              )}
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
                className={errors.lastName ? styles.inputError : ""}
              />
              {errors.lastName && (
                <span className={styles.errorText}>{errors.lastName}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={errors.department ? styles.inputError : ""}
              >
                <option value="">Select department</option>
                {departmentOptions.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
              {errors.department && (
                <span className={styles.errorText}>{errors.department}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="company">What company are you from?</label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                autoComplete="organization"
                className={errors.company ? styles.inputError : ""}
              />
              {errors.company && (
                <span className={styles.errorText}>{errors.company}</span>
              )}
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
                className={errors.purpose ? styles.inputError : ""}
              />
              {errors.purpose && (
                <span className={styles.errorText}>{errors.purpose}</span>
              )}
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