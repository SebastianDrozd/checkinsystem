'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../../styles/tempworker.module.css";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { CreateNewTemp } from "@/api/guests";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

export default function TempWorkerCheckInPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const fireConfetti = () => {
    const end = Date.now() + 1800;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const saveMutation = useMutation({
    mutationFn: (data) => CreateNewTemp(data),
    onSuccess: () => {
      setShowSuccess(true);
      fireConfetti();

      setFormData({
        firstName: "",
        lastName: "",
      });

      setTimeout(() => {
        setShowSuccess(false);
        router.push("/checkin");
      }, 2500);
    },
    onError: (error) => {
      console.error("error creating temp worker", error);
    },
  });

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = {
      FirstName: formData.firstName,
      LastName: formData.lastName,
    };

    saveMutation.mutate(data);
  };

  return (
    <div className={styles.formShell}>
      <div className={styles.formTopBar}>
        <Link href="/checkin" className={styles.backButton}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </Link>
      </div>

      <div className={styles.formPageHeader}>
        <h1>Temp Worker Check In</h1>
        <p>Please enter your name</p>
      </div>

      {showSuccess && (
        <div className={styles.successBanner}>
          Successfully checked in.
        </div>
      )}

      <form className={`${styles.formCard} ${styles.compactFormCard}`} onSubmit={handleSubmit}>
        <div className={`${styles.formGrid} ${styles.compactFormGrid}`}>
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

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? "Checking In..." : "Check In"}
          </button>
        </div>
      </form>
    </div>
  );
}