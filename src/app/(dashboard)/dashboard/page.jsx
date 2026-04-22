'use client';

import { useMemo, useState } from "react";
import { getAllACheckIns, getDashboardCards } from "@/api/guests";
import { getTodaysEvents } from "@/api/events";
import styles from "../../styles/Dashboard.module.css";
import {
  Users,
  Truck,
  Briefcase,
  ShieldCheck,
  Activity,
  CalendarRange,
  ArrowUpRight,
  Clock3,
  UserRound,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

const RANGE_OPTIONS = [
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 Days" },
];

const TYPE_CONFIG = {
  Visitor: { icon: UserRound, tone: "green" },
  Driver: { icon: Truck, tone: "orange" },
  Contractor: { icon: Briefcase, tone: "blue" },
  Temp: { icon: Users, tone: "purple" },
};

function formatHourLabel(hour) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalized = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalized} ${suffix}`;
}

function formatShortHour(hour) {
  const suffix = hour >= 12 ? "p" : "a";
  const normalized = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalized}${suffix}`;
}

function getDateKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayLabel(date) {
  return new Date(date).toLocaleDateString([], { weekday: "short" });
}

function getHourBucketData(events, startHour = 6, endHour = 18) {
  const map = {};

  for (let h = startHour; h <= endHour; h++) {
    map[h] = 0;
  }

  events.forEach((event) => {
    const hour = new Date(event.time).getHours();
    if (hour >= startHour && hour <= endHour) {
      map[hour] += 1;
    }
  });

  return Object.entries(map).map(([hour, value]) => ({
    hour: Number(hour),
    label: formatShortHour(Number(hour)),
    fullLabel: formatHourLabel(Number(hour)),
    value,
  }));
}

function getLast7DaysData(events) {
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, index) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - index));
    return d;
  });

  const counts = {};
  dates.forEach((date) => {
    counts[getDateKey(date)] = 0;
  });

  events.forEach((event) => {
    const key = getDateKey(event.time);
    if (key in counts) {
      counts[key] += 1;
    }
  });

  return dates.map((date) => {
    const key = getDateKey(date);
    return {
      label: getDayLabel(date),
      fullLabel: new Date(date).toLocaleDateString([], {
        month: "short",
        day: "numeric",
      }),
      value: counts[key] || 0,
      dateKey: key,
    };
  });
}

function getHeatmapData(events, daysBack = 7, startHour = 6, endHour = 18) {
  const today = new Date();
  const dates = Array.from({ length: daysBack }, (_, index) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (daysBack - 1 - index));
    return d;
  });

  const matrix = [];
  const counts = {};

  dates.forEach((date) => {
    const dayKey = getDateKey(date);
    counts[dayKey] = {};
    for (let h = startHour; h <= endHour; h++) {
      counts[dayKey][h] = 0;
    }
  });

  events.forEach((event) => {
    const d = new Date(event.time);
    const dayKey = getDateKey(d);
    const hour = d.getHours();

    if (counts[dayKey] && hour >= startHour && hour <= endHour) {
      counts[dayKey][hour] += 1;
    }
  });

  dates.forEach((date) => {
    const dayKey = getDateKey(date);
    for (let h = startHour; h <= endHour; h++) {
      matrix.push({
        dayKey,
        dayLabel: getDayLabel(date),
        hour: h,
        hourLabel: formatShortHour(h),
        value: counts[dayKey][h],
      });
    }
  });

  return matrix;
}

function getDistributionData(dashboardCards) {
  return [
    { name: "Visitors", value: dashboardCards?.visitors ?? 0 },
    { name: "Drivers", value: dashboardCards?.drivers ?? 0 },
    { name: "Contractors", value: dashboardCards?.contractors ?? 0 },
    { name: "Temps", value: dashboardCards?.temps ?? 0 },
  ];
}

function getPeakLabel(series) {
  if (!series.length) return "No peak";
  const peak = [...series].sort((a, b) => b.value - a.value)[0];
  if (!peak || peak.value === 0) return "No activity yet";
  return peak.fullLabel || peak.label;
}

export default function DashboardPage() {
  const [range, setRange] = useState("today");

  const {
    data: signins = [],
    isLoading: signinsLoading,
  } = useQuery({
    queryKey: ["signins"],
    queryFn: () => getAllACheckIns(),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const {
    data: dashboardCards,
    isLoading: cardsLoading,
  } = useQuery({
    queryKey: ["dashboardCards"],
    queryFn: () => getDashboardCards(),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const {
    data: events = [],
    isLoading: eventsLoading,
  } = useQuery({
    queryKey: ["events", range],
    queryFn: () => getTodaysEvents(range),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const isLoading = signinsLoading || cardsLoading || eventsLoading;

  const stats = [
    {
      label: "Visitors",
      value: dashboardCards?.visitors ?? 0,
      sub: "Guest arrivals",
      icon: UserRound,
      tone: "green",
    },
    {
      label: "Drivers",
      value: dashboardCards?.drivers ?? 0,
      sub: "Dock and delivery traffic",
      icon: Truck,
      tone: "orange",
    },
    {
      label: "Contractors",
      value: dashboardCards?.contractors ?? 0,
      sub: "External work on-site",
      icon: Briefcase,
      tone: "blue",
    },
    {
      label: "Temps",
      value: dashboardCards?.temps ?? 0,
      sub: "Temporary labor activity",
      icon: Users,
      tone: "purple",
    },
  ];

  const totalOnSite = signins.length;
  const totalEvents = events.length;
  const signedInCount = events.filter((e) => e.action === "Signed in").length;
  const signedOutCount = events.filter((e) => e.action === "Signed out").length;

  const lineData = useMemo(() => {
    return range === "today" ? getHourBucketData(events) : getLast7DaysData(events);
  }, [events, range]);

  const heatmapData = useMemo(() => getHeatmapData(events), [events]);

  const distributionData = useMemo(() => getDistributionData(dashboardCards), [dashboardCards]);

  const maxDistribution = Math.max(...distributionData.map((item) => item.value), 1);
  const maxHeat = Math.max(...heatmapData.map((item) => item.value), 1);

  const peakLabel = getPeakLabel(lineData);
  const busiestType = [...distributionData].sort((a, b) => b.value - a.value)[0];
  const averagePerBucket =
    lineData.length > 0
      ? Math.round(lineData.reduce((sum, item) => sum + item.value, 0) / lineData.length)
      : 0;

  const customTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className={styles.chartTooltip}>
        <div className={styles.tooltipLabel}>{label}</div>
        <div className={styles.tooltipValue}>{payload[0].value} events</div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingGrid}>
          <div className={`${styles.skeletonBlock} ${styles.skeletonHero}`} />
          <div className={styles.skeletonStatsGrid}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={`${styles.skeletonBlock} ${styles.skeletonCard}`} />
            ))}
          </div>
          <div className={`${styles.skeletonBlock} ${styles.skeletonPanel}`} />
          <div className={styles.lowerGrid}>
            <div className={`${styles.skeletonBlock} ${styles.skeletonPanel}`} />
            <div className={`${styles.skeletonBlock} ${styles.skeletonPanel}`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
    
          <h1 className={styles.title}>Site Activity Dashboard</h1>
          <p className={styles.subtitle}>
            Live operational view of sign-ins, traffic patterns, and visitor mix.
          </p>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.rangeToggle}>
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`${styles.rangeButton} ${
                  range === option.key ? styles.rangeButtonActive : ""
                }`}
                onClick={() => setRange(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.topGrid}>
        <div className={`${styles.panel} ${styles.chartPanel}`}>
          <div className={styles.panelHeader}>
            <div>
              <h2>{range === "today" ? "Traffic by Hour" : "Traffic by Day"}</h2>
              <p>
                {range === "today"
                  ? "Hourly sign activity across the day"
                  : "Daily sign activity over the last 7 days"}
              </p>
            </div>
            <div className={styles.panelHeaderIcon}>
              <Activity size={16} strokeWidth={2.2} />
            </div>
          </div>

          <div className={styles.chartBodyLarge}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey={range === "today" ? "label" : "fullLabel"}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <Tooltip content={customTooltip} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill="url(#trafficFill)"
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.statsGrid}>
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.label} className={styles.statCard}>
                <div className={styles.statTop}>
                  <div className={`${styles.statIcon} ${styles[stat.tone]}`}>
                    <Icon size={18} strokeWidth={2.2} />
                  </div>
                  <span className={styles.statTrend}>
                    <ArrowUpRight size={14} />
                    Live
                  </span>
                </div>

                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statSub}>{stat.sub}</div>
              </div>
            );
          })}
        </div>
      </div>

      

      <div className={styles.bottomGrid}>
        <div className={`${styles.panel} ${styles.heatmapPanel}`}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Activity Heatmap</h2>
              <p>When traffic clusters throughout the week</p>
            </div>
            <div className={styles.panelHeaderIcon}>
              <CalendarRange size={16} strokeWidth={2.2} />
            </div>
          </div>

          <div className={styles.heatmapWrap}>
            <div className={styles.heatmapHeader}>
              <div className={styles.heatmapCorner} />
              {Array.from({ length: 13 }, (_, index) => {
                const hour = index + 6;
                return (
                  <div key={hour} className={styles.heatmapHeaderCell}>
                    {formatShortHour(hour)}
                  </div>
                );
              })}
            </div>

            {Array.from(new Set(heatmapData.map((item) => item.dayKey))).map((dayKey) => {
              const rowCells = heatmapData.filter((item) => item.dayKey === dayKey);
              return (
                <div key={dayKey} className={styles.heatmapRow}>
                  <div className={styles.heatmapDayLabel}>{rowCells[0]?.dayLabel}</div>
                  {rowCells.map((cell) => {
                    const intensity = cell.value === 0 ? 0 : Math.max(cell.value / maxHeat, 0.16);

                    return (
                      <div
                        key={`${cell.dayKey}-${cell.hour}`}
                        className={styles.heatmapCell}
                        title={`${cell.dayLabel} ${formatHourLabel(cell.hour)}: ${cell.value} events`}
                        style={{
                          background: `rgba(37, 99, 235, ${intensity})`,
                        }}
                      >
                        <span>{cell.value > 0 ? cell.value : ""}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}