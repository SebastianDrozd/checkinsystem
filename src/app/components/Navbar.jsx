'use client'

import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  ClipboardList,
  Factory,
  LogOut,
  ShieldCheck,
  User,
  Wrench,
  X,
  Download,
} from "lucide-react";
import styles from "../styles/Navbar.module.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const getEventIcon = (type) => {
  switch (type) {
    case "work_order":
      return <ClipboardList size={14} />;
    case "pm_template":
      return <ShieldCheck size={14} />;
    case "asset":
      return <Factory size={14} />;
    case "Admin":
      return <User size={14} />;
    default:
      return <Wrench size={14} />;
  }
};

const Navbar = ({ logs = [] }) => {
  const path = usePathname();
  const router = useRouter();
  const pathNames = path.split("/").filter((path) => path);

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState("");

  const [exportForm, setExportForm] = useState({
    startDate: "",
    endDate: "",
    visitorType: "all",
  });

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const exportModalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }

      if (
        exportModalRef.current &&
        !exportModalRef.current.contains(event.target)
      ) {
        setExportModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportChange = (e) => {
    const { name, value } = e.target;
    setExportForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExportSubmit = async (e) => {
    e.preventDefault();
    setExportError("");

    if (!exportForm.startDate || !exportForm.endDate) {
      setExportError("Please select both a start date and end date.");
      return;
    }

    if (new Date(exportForm.startDate) > new Date(exportForm.endDate)) {
      setExportError("Start date cannot be after end date.");
      return;
    }

    try {
      setExportLoading(true);

      const response = await axios.post(
        "/api/exports/visitor-records",
        {
          startDate: exportForm.startDate,
          endDate: exportForm.endDate,
          visitorType: exportForm.visitorType,
        },
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const fileName =
        response.headers["content-disposition"]
          ?.split("filename=")[1]
          ?.replace(/"/g, "") ||
        `visitor-records-${exportForm.startDate}-to-${exportForm.endDate}.xlsx`;

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      setExportModalOpen(false);
      setExportForm({
        startDate: "",
        endDate: "",
        visitorType: "all",
      });
    } catch (error) {
      console.error("Export failed:", error);
      setExportError("Failed to export records. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // logout logic here
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.left}>
          <h3>Bobak Guests</h3>
        </div>

        <div className={styles.right}>
          <div>
            <div className={styles.headerActions}>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => {
                  setExportModalOpen(true);
                  setMenuOpen(false);
                  setNotificationsOpen(false);
                }}
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className={styles.notificationWrapper} ref={notificationsRef}>
           

            {notificationsOpen && (
              <div className={styles.notificationsDropdown}>
                <div className={styles.notificationsHeader}>
                  <div>
                    <p className={styles.notificationsEyebrow}>Activity</p>
                    <h3 className={styles.notificationsTitle}>Recent Events</h3>
                  </div>
                </div>

                <div className={styles.notificationsList}>
                  {logs?.map((event) => (
                    <button
                      key={event.event_id}
                      type="button"
                      className={styles.notificationItem}
                    >
                      <div className={styles.notificationIcon}>
                        {getEventIcon(event.event_type)}
                      </div>

                      <div className={styles.notificationContent}>
                        <div className={styles.notificationTopRow}>
                          <span className={styles.notificationType}>
                            {event.event_type}
                          </span>

                          <span
                            className={`${styles.notificationAction} ${
                              event.event_action === "Created"
                                ? styles.createdPill
                                : event.event_action === "Modified"
                                  ? styles.updatedPill
                                  : event.event_action === "Deleted"
                                    ? styles.deletedPill
                                    : event.event_action === "Error"
                                      ? styles.errorPill
                                      : styles.closedPill
                            }`}
                          >
                            {event.event_action}
                          </span>
                        </div>

                        <p className={styles.notificationText}>
                          {event.description}
                        </p>
                        <span className={styles.notificationTime}>
                          {new Date(event.created_at).toLocaleString()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className={styles.notificationsFooter}>
                  <button
                    type="button"
                    className={styles.viewAllBtn}
                    onClick={() => {
                      setNotificationsOpen(false);
                      router.push("/dashboard/logs");
                    }}
                  >
                    View all activity
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.userMenuWrapper} ref={dropdownRef}>
            <button
              className={styles.userTrigger}
              onClick={() => {
                setMenuOpen((prev) => !prev);
                setNotificationsOpen(false);
              }}
              type="button"
            >
              <div className={styles.userAvatar}>
                <User size={16} />
              </div>

              <span className={styles.userName}></span>

              <ChevronDown
                size={16}
                className={`${styles.chevron} ${menuOpen ? styles.chevronOpen : ""}`}
              />
            </button>

            {menuOpen && (
              <div className={styles.dropdown}>
                <button
                  className={styles.dropdownItem}
                  onClick={handleLogout}
                  type="button"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {exportModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.exportModal} ref={exportModalRef}>
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.modalEyebrow}>Records Export</p>
                <h3 className={styles.modalTitle}>Export visitor records</h3>
              </div>

              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setExportModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleExportSubmit} className={styles.exportForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="startDate" className={styles.formLabel}>
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={exportForm.startDate}
                    onChange={handleExportChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="endDate" className={styles.formLabel}>
                    End Date
                  </label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={exportForm.endDate}
                    onChange={handleExportChange}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="visitorType" className={styles.formLabel}>
                  Visitor Type
                </label>
                <select
                  id="visitorType"
                  name="visitorType"
                  value={exportForm.visitorType}
                  onChange={handleExportChange}
                  className={styles.formSelect}
                >
                  <option value="all">All</option>
                  <option value="temp">Temp</option>
                  <option value="driver">Driver</option>
                  <option value="visitor">Visitor</option>
                  <option value="contractor">Contractor</option>
                </select>
              </div>

              {exportError && (
                <div className={styles.exportError}>{exportError}</div>
              )}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalSecondaryButton}
                  onClick={() => setExportModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={styles.modalPrimaryButton}
                  disabled={exportLoading}
                >
                  {exportLoading ? "Exporting..." : "Export Records"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;