'use client';

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllACheckIns } from "@/api/guests";
import styles from "../../styles/SignInsPage.module.css";
import {
  Search,
  Users,
  Truck,
  Briefcase,
  UserRound,
  Clock3,
  Building2,
  ShieldCheck,
} from "lucide-react";

const TYPE_META = {
  Visitor: {
    icon: UserRound,
    tone: "green",
  },
  Driver: {
    icon: Truck,
    tone: "orange",
  },
  Contractor: {
    icon: Briefcase,
    tone: "blue",
  },
  Temp: {
    icon: Users,
    tone: "purple",
  },
};

function formatTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getMinutesOnSite(timeIn) {
  if (!timeIn) return null;
  const start = new Date(timeIn).getTime();
  const now = Date.now();
  const diffMinutes = Math.max(0, Math.floor((now - start) / 60000));

  if (diffMinutes < 60) return `${diffMinutes}m`;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export default function SignInsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const { data: signins = [], isLoading, isError } = useQuery({
    queryKey: ["signins"],
    queryFn: () => getAllACheckIns(),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const filteredSignins = useMemo(() => {
    const term = search.trim().toLowerCase();

    return signins.filter((person) => {
      const matchesType =
        typeFilter === "All" ? true : person.type === typeFilter;

      const fullName = `${person.firstName || ""} ${person.lastName || ""}`.trim().toLowerCase();
      const company = (person.company || "").toLowerCase();
      const department = (person.department || "").toLowerCase();

      const matchesSearch =
        !term ||
        fullName.includes(term) ||
        company.includes(term) ||
        department.includes(term);

      return matchesType && matchesSearch;
    });
  }, [signins, search, typeFilter]);

  const stats = useMemo(() => {
    return {
      total: signins.length,
      visitors: signins.filter((p) => p.type === "Visitor").length,
      drivers: signins.filter((p) => p.type === "Driver").length,
      contractors: signins.filter((p) => p.type === "Contractor").length,
      temps: signins.filter((p) => p.type === "Temp").length,
    };
  }, [signins]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingGrid}>
          <div className={`${styles.skeletonBlock} ${styles.skeletonHeader}`} />
          <div className={styles.skeletonStatsGrid}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={`${styles.skeletonBlock} ${styles.skeletonCard}`} />
            ))}
          </div>
          <div className={`${styles.skeletonBlock} ${styles.skeletonTable}`} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyStateCard}>
          <h2>Unable to load current sign-ins</h2>
          <p>Please try again or check the API connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Visitor Operations</p>
          <h1 className={styles.title}>Current Sign-Ins</h1>
          <p className={styles.subtitle}>
            Live roster of everyone currently on site across visitors, drivers,
            contractors, and temps.
          </p>
        </div>

        <div className={styles.headerBadge}>
          <ShieldCheck size={16} />
          Live refresh 30s
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={`${styles.statIcon} ${styles.slate}`}>
              <Users size={18} />
            </div>
          </div>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>Currently On Site</div>
          <div className={styles.statSub}>Active sign-ins right now</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={`${styles.statIcon} ${styles.green}`}>
              <UserRound size={18} />
            </div>
          </div>
          <div className={styles.statValue}>{stats.visitors}</div>
          <div className={styles.statLabel}>Visitors</div>
          <div className={styles.statSub}>Guests and meetings</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={`${styles.statIcon} ${styles.orange}`}>
              <Truck size={18} />
            </div>
          </div>
          <div className={styles.statValue}>{stats.drivers}</div>
          <div className={styles.statLabel}>Drivers</div>
          <div className={styles.statSub}>Shipping and receiving traffic</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={`${styles.statIcon} ${styles.blue}`}>
              <Briefcase size={18} />
            </div>
          </div>
          <div className={styles.statValue}>{stats.contractors + stats.temps}</div>
          <div className={styles.statLabel}>Contractors + Temps</div>
          <div className={styles.statSub}>External and temporary labor</div>
        </div>
      </div>

      <div className={styles.tablePanel}>
        <div className={styles.panelHeader}>
          <div>
            <h2>Live Roster</h2>
            <p>{filteredSignins.length} active records shown</p>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <Search size={16} />
              <input
                type="text"
                placeholder="Search name, company, or department"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="All">All Types</option>
              <option value="Visitor">Visitor</option>
              <option value="Driver">Driver</option>
              <option value="Contractor">Contractor</option>
              <option value="Temp">Temp</option>
            </select>
          </div>
        </div>

        <div className={styles.tableWrap}>
          {filteredSignins.length > 0 ? (
            <table className={styles.signinsTable}>
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Type</th>
                  <th>Company</th>
                  <th>Department</th>
                  <th>Time In</th>
                  <th>On Site</th>
                </tr>
              </thead>

              <tbody>
                {filteredSignins.map((person) => {
                  const fullName = `${person.firstName || ""} ${person.lastName || ""}`.trim() || "Unknown";
                  const meta = TYPE_META[person.type] || {};
                  const Icon = meta.icon || UserRound;

                  return (
                    <tr key={person.id}>
                      <td>
                        <div className={styles.personCell}>
                          <div className={styles.avatar}>
                            <UserRound size={15} />
                          </div>

                          <div className={styles.personMeta}>
                            <span className={styles.personName}>{fullName}</span>
                            <span className={styles.personSub}>
                              Active sign-in
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={`${styles.badge} ${styles[meta.tone] || styles.green}`}>
                          <Icon size={12} />
                          {person.type || "Unknown"}
                        </span>
                      </td>

                      <td>
                        <span className={styles.mutedCell}>
                          {person.company || "—"}
                        </span>
                      </td>

                      <td>
                        <span className={styles.mutedCell}>
                          {person.department || "—"}
                        </span>
                      </td>

                      <td>
                        <span className={styles.timeCell}>
                          <Clock3 size={14} />
                          {formatTime(person.timeIn)}
                        </span>
                      </td>

                      <td>
                        <span className={styles.durationPill}>
                          {getMinutesOnSite(person.timeIn) || "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>
              <Building2 size={22} />
              <div>
                <h3>No matching active sign-ins</h3>
                <p>Try clearing the search or changing the type filter.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}