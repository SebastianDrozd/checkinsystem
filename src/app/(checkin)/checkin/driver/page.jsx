'use client';

import { useState } from "react";
import Link from "next/link";
import styles from "../../../styles/driverpage.module.css";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { CreateNewDriver } from "@/api/guests";

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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear error while typing
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
      FirstName : formData.firstName,
      LastName : formData.lastName,
      OriginCity : formData.cityFrom,
      Company : formData.companyFrom,
      Carrier : formData.carrierName,
      Cargo : formData.cargo,
      DestinationCity : formData.cargoDestination,
      DeliveryType : formData.visitType
    }
    saveMutation.mutate(data);
    console.log("driver form submitted", formData);

    // submit to backend here
  };
  
  const saveMutation = useMutation ({
    mutationFn : (data) => CreateNewDriver(data),
    onSuccess : (data) => {
      console.log("driver created", data);
    },
    onError : (error) => {
      console.error("error creating driver", error);
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

            {errors.visitType && (
              <span className={styles.errorText}>{errors.visitType}</span>
            )}
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? styles.inputError : ""}
              />
              {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
            </div>

            <div className={styles.field}>
              <label>First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? styles.inputError : ""}
              />
              {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
            </div>

            <div className={styles.field}>
              <label>City</label>
              <input
                name="cityFrom"
                value={formData.cityFrom}
                onChange={handleChange}
                className={errors.cityFrom ? styles.inputError : ""}
              />
              {errors.cityFrom && <span className={styles.errorText}>{errors.cityFrom}</span>}
            </div>

            <div className={styles.field}>
              <label>Company</label>
              <input
                name="companyFrom"
                value={formData.companyFrom}
                onChange={handleChange}
                className={errors.companyFrom ? styles.inputError : ""}
              />
              {errors.companyFrom && <span className={styles.errorText}>{errors.companyFrom}</span>}
            </div>

            <div className={styles.field}>
              <label>Carrier Name</label>
              <input
                name="carrierName"
                value={formData.carrierName}
                onChange={handleChange}
                className={errors.carrierName ? styles.inputError : ""}
              />
              {errors.carrierName && <span className={styles.errorText}>{errors.carrierName}</span>}
            </div>

            <div className={styles.field}>
              <label>Cargo</label>
              <input
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                className={errors.cargo ? styles.inputError : ""}
              />
              {errors.cargo && <span className={styles.errorText}>{errors.cargo}</span>}
            </div>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Destination</label>
              <textarea
                name="cargoDestination"
                value={formData.cargoDestination}
                onChange={handleChange}
                className={errors.cargoDestination ? styles.inputError : ""}
              />
              {errors.cargoDestination && (
                <span className={styles.errorText}>{errors.cargoDestination}</span>
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