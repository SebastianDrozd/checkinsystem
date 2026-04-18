'use client';

import { useState } from "react";
import Link from "next/link";
import styles from "../../../styles/tempworker.module.css";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { CreateNewTemp } from "@/api/guests";

export default function TempWorkerCheckInPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear error as user types
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

    // if errors exist, stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = {
      FirstName : formData.firstName,
      LastName : formData.lastName
    }
    console.log("temp worker form submitted", data);

    saveMutation.mutate(data);
    // submit to backend here
  };



  const saveMutation = useMutation({
      mutationFn : (data) => CreateNewTemp(data),
      onSuccess : (data) => {
        console.log("temp worker created", data);
      },
      onError : (error) => {
        console.error("error creating temp worker", error);
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