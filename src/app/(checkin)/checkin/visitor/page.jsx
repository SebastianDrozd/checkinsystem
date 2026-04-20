'use client';

import { useState } from "react";
import Link from "next/link";
import styles from "../../../styles/visitorpage.module.css";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { CreateNewVisitor } from "@/api/guests";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

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
  const router = useRouter ();
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
    mutationFn: (data) => CreateNewVisitor(data),
    onSuccess: () => {
      setShowSuccess(true);
      fireConfetti();

      setFormData({
        firstName: "",
        lastName: "",
        department: "",
        company: "",
        purpose: "",
      });

      setTimeout(() => {
        setShowSuccess(false);
        router.push("/checkin")
      }, 2500);
    },
    onError: (error) => {
      console.error("error creating visitor", error);
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

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.company.trim()) newErrors.company = "Company is required";
    if (!formData.purpose.trim()) newErrors.purpose = "Purpose is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = {
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Department: formData.department,
      Company: formData.company,
      Purpose: formData.purpose,
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
        <h1>Visitor Check In</h1>
        <p>Please fill out the information below</p>
      </div>

      {showSuccess && (
        <div className={styles.successBanner}>
          Successfully checked in.
        </div>
      )}

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
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
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className={errors.lastName ? styles.inputError : ""}
            />
            {errors.lastName && (
              <span className={styles.errorText}>{errors.lastName}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="department">Department</label>
            <div className={styles.selectWrapper}>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`${styles.selectField} ${
                  errors.department ? styles.inputError : ""
                }`}
              >
                <option value="">Select department</option>
                {departmentOptions.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
              <span className={styles.selectArrow}>▾</span>
            </div>
            {errors.department && (
              <span className={styles.errorText}>{errors.department}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
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
              placeholder="Enter purpose"
              className={errors.purpose ? styles.inputError : ""}
            />
            {errors.purpose && (
              <span className={styles.errorText}>{errors.purpose}</span>
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