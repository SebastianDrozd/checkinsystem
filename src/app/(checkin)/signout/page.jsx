'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "../../styles/signout.module.css";
import { ArrowLeft, Search, LogOut } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllACheckIns, signOutGuest } from "@/api/guests";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: guests = [], isLoading, isError } = useQuery({
    queryKey: ["guests"],
    queryFn: () => getAllACheckIns(),
  });

 const filteredUsers = useMemo(() => {
  const term = searchTerm.toLowerCase().trim();

  const sortedGuests = [...guests].sort((a, b) => {
    const nameA = `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim().toLowerCase();
    const nameB = `${b.firstName ?? ""} ${b.lastName ?? ""}`.trim().toLowerCase();
    return nameA.localeCompare(nameB);
  });

  if (!term) return sortedGuests;

  return sortedGuests
    .filter((user) => {
      const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim().toLowerCase();
      const firstName = (user.firstName ?? "").toLowerCase();
      const lastName = (user.lastName ?? "").toLowerCase();

      return (
        fullName.includes(term) ||
        firstName.includes(term) ||
        lastName.includes(term)
      );
    })
    .sort((a, b) => {
      const fullNameA = `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim().toLowerCase();
      const fullNameB = `${b.firstName ?? ""} ${b.lastName ?? ""}`.trim().toLowerCase();
      const firstNameA = (a.firstName ?? "").toLowerCase();
      const firstNameB = (b.firstName ?? "").toLowerCase();
      const lastNameA = (a.lastName ?? "").toLowerCase();
      const lastNameB = (b.lastName ?? "").toLowerCase();

      const score = (fullName, firstName, lastName) => {
        if (fullName === term) return 0;
        if (firstName === term || lastName === term) return 1;
        if (fullName.startsWith(term)) return 2;
        if (firstName.startsWith(term) || lastName.startsWith(term)) return 3;
        if (fullName.includes(term)) return 4;
        return 5;
      };

      const scoreA = score(fullNameA, firstNameA, lastNameA);
      const scoreB = score(fullNameB, firstNameB, lastNameB);

      if (scoreA !== scoreB) return scoreA - scoreB;

      return fullNameA.localeCompare(fullNameB);
    });
}, [searchTerm, guests]);

  const fireConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 140,
      startVelocity: 45,
      origin: { y: 0.65 },
    });
  };

  const signOutMutation = useMutation({
    mutationFn: (data) => signOutGuest(data),
    onSuccess: () => {
      setShowSuccess(true);
     // fireConfetti();
      queryClient.invalidateQueries({ queryKey: ["guests"] });

      setTimeout(() => {
        setShowSuccess(false);
      }, 2200);
    },
    onError: (error) => {
      console.error("sign out error", error);
    },
  });

  const handleSignout = (user) => {
    console.log("signing out", user);
    const data = {
      Id : user.id,
      FirstName : user.firstName,
      LastName : user.lastName,
      Type : user.type
    }
    signOutMutation.mutate(data);
  }
  return (
    <div className={styles.pageShell}>
      <div className={styles.topBar}>
        <Link href="/checkin" className={styles.backButton}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </Link>
      </div>

      <div className={styles.pageHeader}>
        <h1>Sign Out</h1>
        <p>Search for your name below and sign out when you are leaving.</p>
      </div>

      {showSuccess && (
        <div className={styles.successBanner}>
          Successfully signed out.
        </div>
      )}

      <div className={styles.searchCard}>
        <div className={styles.searchWrapper}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by first or last name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeaderRow}>
          <div>
            <h2>Currently Signed In</h2>
            <p>{filteredUsers.length} active check-in{filteredUsers.length === 1 ? "" : "s"}</p>
          </div>
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Company</th>
                <th>Department</th>
                <th>Signed In</th>
                <th className={styles.actionCol}></th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className={styles.empty}>
                    Loading check-ins...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="6" className={styles.empty}>
                    Unable to load signed-in users.
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className={styles.nameCell}>
                      <div className={styles.nameBlock}>
                        <span className={styles.primaryText}>
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td>{user.type || "-"}</td>
                    <td>{user.company || "-"}</td>
                    <td>{user.department || "-"}</td>
                    <td>{user.timeIn || "-"}</td>
                    <td className={styles.actionCell}>
                      <button
                        type="button"
                        className={styles.signOutButton}
                        onClick={() => handleSignout(user)} 
                        disabled={signOutMutation.isPending}
                      >
                        <LogOut size={15} />
                        <span>
                          {signOutMutation.isPending ? "Signing Out..." : "Sign Out"}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={styles.empty}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}