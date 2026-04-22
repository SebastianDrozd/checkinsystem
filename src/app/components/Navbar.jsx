'use client'

import { useRouter } from "next/navigation";
import {
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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5080/api/Guest";

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

const visitorTypeOptions = [
  { label: "All", value: "all" },
  { label: "Temp", value: "temp" },
  { label: "Driver", value: "driver" },
  { label: "Visitor", value: "visitor" },
  { label: "Contractor", value: "contractor" },
];

const Navbar = ({ logs = [] }) => {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState("");

  const [exportForm, setExportForm] = useState({
    startDate: "",
    endDate: "",
    visitorTypes: ["all"],
  });

  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchingUsers, setSearchingUsers] = useState(false);

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const exportModalRef = useRef(null);

  const toggleVisitorType = (type) => {
    setExportForm((prev) => {
      let updated = [...prev.visitorTypes];

      if (type === "all") {
        return { ...prev, visitorTypes: ["all"] };
      }

      updated = updated.filter((t) => t !== "all");

      if (updated.includes(type)) {
        updated = updated.filter((t) => t !== type);
      } else {
        updated.push(type);
      }

      if (updated.length === 0) {
        updated = ["all"];
      }

      return { ...prev, visitorTypes: updated };
    });
  };

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
        setUserResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = userSearch.trim();

    const debounce = setTimeout(async () => {
      if (!trimmed) {
        setUserResults([]);
        setSearchingUsers(false);
        return;
      }

      if (
        selectedUser &&
        `${selectedUser.firstName} ${selectedUser.lastName}`.toLowerCase() ===
          trimmed.toLowerCase()
      ) {
        setUserResults([]);
        setSearchingUsers(false);
        return;
      }

      try {
        setSearchingUsers(true);

        const response = await axios.get(`${API_BASE_URL}/search-users`, {
          params: { query: trimmed },
        });

        setUserResults(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("User search failed:", error);
        setUserResults([]);
      } finally {
        setSearchingUsers(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [userSearch, selectedUser]);

  const handleExportChange = (e) => {
    const { name, value } = e.target;
    setExportForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUserSearch(`${user.firstName} ${user.lastName}`);
    setUserResults([]);
  };

  const handleClearSelectedUser = () => {
    setSelectedUser(null);
    setUserSearch("");
    setUserResults([]);
  };

  const resetExportModal = () => {
    setExportForm({
      startDate: "",
      endDate: "",
      visitorTypes: ["all"],
    });
    setExportError("");
    setUserSearch("");
    setUserResults([]);
    setSelectedUser(null);
    setSearchingUsers(false);
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

      const params = new URLSearchParams({
        type: exportForm.visitorTypes.join(","),
        start: exportForm.startDate,
        end: exportForm.endDate,
      });

      if (selectedUser) {
        params.append("firstName", selectedUser.firstName);
        params.append("lastName", selectedUser.lastName);
      }
      console.log(params.toString());
      const response = await axios.get(
        `${API_BASE_URL}/export?${params.toString()}`,
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
      resetExportModal();
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
        <div className={styles.left}></div>

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

              <div className={styles.userMeta}>
                <span className={styles.userLabel}>Account</span>
                <span className={styles.userName}>Administrator</span>
              </div>

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
                onClick={() => {
                  setExportModalOpen(false);
                  resetExportModal();
                }}
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
                <label className={styles.formLabel}>Visitor Type</label>

                <div className={styles.checkboxGroup}>
                  {visitorTypeOptions.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      className={`${styles.checkboxItem} ${
                        exportForm.visitorTypes.includes(item.value)
                          ? styles.checkboxActive
                          : ""
                      }`}
                      onClick={() => toggleVisitorType(item.value)}
                    >
                      <div className={styles.checkboxIcon}>
                        {exportForm.visitorTypes.includes(item.value) && "✓"}
                      </div>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="userSearch" className={styles.formLabel}>
                  Search User
                </label>

                <div className={styles.userSearchWrapper}>
                  <input
                    id="userSearch"
                    type="text"
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setSelectedUser(null);
                    }}
                    placeholder="Type first or last name..."
                    className={styles.formInput}
                    autoComplete="off"
                  />

                  {selectedUser && (
                    <div className={styles.selectedUserRow}>
                      <span className={styles.selectedUserPill}>
                        {selectedUser.firstName} {selectedUser.lastName}
                      </span>
                      <button
                        type="button"
                        className={styles.clearUserButton}
                        onClick={handleClearSelectedUser}
                      >
                        Clear selected user
                      </button>
                    </div>
                  )}

                  {!selectedUser && userResults.length > 0 && (
                    <div className={styles.userResultsDropdown}>
                      {userResults.map((user, index) => (
                        <button
                          key={`${user.firstName}-${user.lastName}-${index}`}
                          type="button"
                          className={styles.userResultItem}
                          onClick={() => handleSelectUser(user)}
                        >
                          {user.firstName} {user.lastName}
                        </button>
                      ))}
                    </div>
                  )}

                  {!selectedUser && searchingUsers && (
                    <div className={styles.userSearchHint}>Searching...</div>
                  )}

                  {!selectedUser &&
                    !searchingUsers &&
                    userSearch.trim() &&
                    userResults.length === 0 && (
                      <div className={styles.userSearchHint}>
                        No users found.
                      </div>
                    )}
                </div>
              </div>

              {exportError && (
                <div className={styles.exportError}>{exportError}</div>
              )}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalSecondaryButton}
                  onClick={() => {
                    setExportModalOpen(false);
                    resetExportModal();
                  }}
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