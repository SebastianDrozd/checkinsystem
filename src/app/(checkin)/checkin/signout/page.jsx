'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "../../../styles/signout.module.css";
import { ArrowLeft, Search } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllACheckIns,signOutGuest } from "@/api/guests";

const mockSignedInUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Smith",
    type: "Visitor",
    company: "Acme Foods",
    department: "Office",
    signedInAt: "8:12 AM",
  },
  {
    id: 2,
    firstName: "Maria",
    lastName: "Lopez",
    type: "Driver",
    company: "Midwest Transport",
    department: "Shipping",
    signedInAt: "8:26 AM",
  },
  {
    id: 3,
    firstName: "David",
    lastName: "Miller",
    type: "Temp Worker",
    company: "",
    department: "",
    signedInAt: "8:41 AM",
  },
];

export default function SignOutPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(mockSignedInUsers);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return users;

    return users.filter((u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(term)
    );
  }, [searchTerm, users]);

  const handleSignOut = (id) => {
    console.log("sign out", id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const {data: guests,isLoading, isError} = useQuery({
    queryKey : ["guests"],
    queryFn : () => getAllACheckIns()
  })

  const signOutMutation = useMutation({
  
    mutationFn: (id) => signOutGuest(id),
    onSuccess: (data, variables) => {
      console.log("sign out successful", data);
      setUsers((prev) => prev.filter((u) => u.id !== variables));
    },
    onError: (error) => {
      console.error("sign out error", error);
    },
  })

  if(isLoading){
    return "loading...."
  }
  console.log("guests", guests, isLoading, isError);
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.topBar}>
          <Link href="/checkin" className={styles.backButton}>
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>

        <div className={styles.header}>
          <h1>Sign Out</h1>
          <p>Search for your name below</p>
        </div>

        <div className={styles.searchWrapper}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Company</th>
                <th>Department</th>
                <th>Signed In</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {guests?.length > 0 ? (
                guests?.map((user) => (
                  <tr key={user.id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.type}</td>
                    <td>{user.company || "-"}</td>
                    <td>{user.department || "-"}</td>
                    <td>{user.timeIn}</td>
                    <td>
                      <button
                        className={styles.signOutButton}
                        onClick={() => handleSignOut(user.id)}
                      >
                        Sign Out
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