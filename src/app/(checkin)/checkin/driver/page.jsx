'use client';

import { useState } from "react";
import Link from "next/link";
import styles from "../../../styles/driverpage.module.css";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { CreateNewDriver } from "@/api/guests";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

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
    mutationFn: (data) => CreateNewDriver(data),
    onSuccess: () => {
      setShowSuccess(true);
      fireConfetti();

      setFormData({
        visitType: "",
        lastName: "",
        firstName: "",
        cityFrom: "",
        companyFrom: "",
        carrierName: "",
        cargo: "",
        cargoDestination: "",
      });

      setTimeout(() => {
        setShowSuccess(false);
        router.push("/checkin");
      }, 2500);
    },
    onError: (error) => {
      console.error("error creating driver", error);
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

    if (!formData.visitType) {
      newErrors.visitType = "Please select Pickup or Delivery";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.cityFrom.trim()) {
      newErrors.cityFrom = "City is required";
    }

    if (!formData.companyFrom.trim()) {
      newErrors.companyFrom = "Company is required";
    }

    if (!formData.carrierName.trim()) {
      newErrors.carrierName = "Carrier name is required";
    }

    if (!formData.cargo.trim()) {
      newErrors.cargo = "Cargo is required";
    }

    if (!formData.cargoDestination.trim()) {
      newErrors.cargoDestination = "Destination is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = {
      FirstName: formData.firstName,
      LastName: formData.lastName,
      OriginCity: formData.cityFrom,
      Company: formData.companyFrom,
      Carrier: formData.carrierName,
      Cargo: formData.cargo,
      DestinationCity: formData.cargoDestination,
      DeliveryType: formData.visitType,
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
        <h1>Driver Check In</h1>
        <p>Please fill out the information below</p>
      </div>

      {showSuccess && (
        <div className={styles.successBanner}>
          Successfully checked in.
        </div>
      )}

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

          {errors.visitType && (
            <span className={styles.errorText}>{errors.visitType}</span>
          )}
        </div>

        <div className={styles.formGrid}>
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
            <label htmlFor="cityFrom">City</label>
            <input
              id="cityFrom"
              name="cityFrom"
              value={formData.cityFrom}
              onChange={handleChange}
              placeholder="Enter city"
              className={errors.cityFrom ? styles.inputError : ""}
            />
            {errors.cityFrom && (
              <span className={styles.errorText}>{errors.cityFrom}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="companyFrom">Company</label>
            <input
              id="companyFrom"
              name="companyFrom"
              value={formData.companyFrom}
              onChange={handleChange}
              placeholder="Enter company"
              className={errors.companyFrom ? styles.inputError : ""}
            />
            {errors.companyFrom && (
              <span className={styles.errorText}>{errors.companyFrom}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="carrierName">Carrier Name</label>
            <input
              id="carrierName"
              name="carrierName"
              value={formData.carrierName}
              onChange={handleChange}
              placeholder="Enter carrier name"
              className={errors.carrierName ? styles.inputError : ""}
            />
            {errors.carrierName && (
              <span className={styles.errorText}>{errors.carrierName}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="cargo">Cargo</label>
            <input
              id="cargo"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              placeholder="Enter cargo"
              className={errors.cargo ? styles.inputError : ""}
            />
            {errors.cargo && (
              <span className={styles.errorText}>{errors.cargo}</span>
            )}
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label htmlFor="cargoDestination">Destination</label>
            <textarea
              id="cargoDestination"
              name="cargoDestination"
              value={formData.cargoDestination}
              onChange={handleChange}
              placeholder="Enter destination"
              className={errors.cargoDestination ? styles.inputError : ""}
            />
            {errors.cargoDestination && (
              <span className={styles.errorText}>{errors.cargoDestination}</span>
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