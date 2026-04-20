'use client';

import { getAllACheckIns, getDashboardCards } from "@/api/guests";
import { getTodaysEvents } from "@/api/events";
import styles from "../../styles/Dashboard.module.css";
import {
    Users,
    UserRound,
    Truck,
    Briefcase,
    LogIn,
    LogOut,
    User,
    ShieldCheck,
    Activity,
    ChevronRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function DashboardPage() {
    const { data: signins = [], isLoading } = useQuery({
        queryKey: ["signins"],
        queryFn: () => getAllACheckIns(),
    });

    const { data: dashboardCards } = useQuery({
        queryKey: ["dashboardCards"],
        queryFn: () => getDashboardCards(),
    });

    const { data: events = [] } = useQuery({
        queryKey: ["events"],
        queryFn: () => getTodaysEvents(),
    });

    const stats = [
        {
            label: "Visitors",
            value: dashboardCards?.currentlySignedIn ?? 0,
            sub: "Active guests on site",
            icon: Users,
            tone: "green",
        },
        {
            label: "Drivers",
            value: dashboardCards?.drivers ?? 0,
            sub: "All sign-ins today",
            icon: Truck,
            tone: "orange",
        },
        {
            label: "Contractors",
            value: dashboardCards?.contractors ?? 0,
            sub: "Guests and meetings",
            icon: Briefcase,
            tone: "blue",
        },
        {
            label: "Temps",
            value: dashboardCards?.temps ?? 0,
            sub: "Pickups and deliveries",
            icon: Users,
            tone: "purple",
        },
    ];

    const signInBreakdown = [
        {
            label: "Visitors",
            value: dashboardCards?.visitors ?? 0,
            icon: UserRound,
            tone: "green",
        },
        {
            label: "Drivers",
            value: dashboardCards?.drivers ?? 0,
            icon: Truck,
            tone: "orange",
        },
        {
            label: "Contractors",
            value: dashboardCards?.contractors ?? 0,
            icon: Briefcase,
            tone: "blue",
        },
        {
            label: "Temps",
            value: dashboardCards?.temps ?? 0,
            icon: Users,
            tone: "purple",
        },
    ];

    const trafficBars = [
        { label: "6a", value: 3 },
        { label: "8a", value: 9 },
        { label: "10a", value: 6 },
        { label: "12p", value: 11 },
        { label: "2p", value: 7 },
        { label: "4p", value: 4 },
        { label: "6p", value: 2 },
    ];

    const maxTraffic = Math.max(...trafficBars.map((bar) => bar.value), 1);

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.header}></div>

                <div className={styles.heroGrid}>
                    <div className={styles.statsGrid}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className={`${styles.statCard} ${styles.skeletonCard}`}>
                                <div className={styles.statTop}>
                                    <div className={`${styles.skeletonIcon} ${styles.skeletonShimmer}`}></div>
                                </div>
                                <div className={`${styles.skeletonValue} ${styles.skeletonShimmer}`}></div>
                                <div className={`${styles.skeletonLabel} ${styles.skeletonShimmer}`}></div>
                                <div className={`${styles.skeletonSub} ${styles.skeletonShimmer}`}></div>
                            </div>
                        ))}
                    </div>

                    <div className={`${styles.panel} ${styles.chartPanel}`}>
                        <div className={styles.panelHeader}>
                            <div>
                                <div className={`${styles.skeletonHeading} ${styles.skeletonShimmer}`}></div>
                                <div className={`${styles.skeletonText} ${styles.skeletonShimmer}`}></div>
                            </div>
                            <div className={`${styles.skeletonPanelIcon} ${styles.skeletonShimmer}`}></div>
                        </div>

                        <div className={styles.chartBody}>
                            <div className={styles.chartBars}>
                                {Array.from({ length: 7 }).map((_, index) => (
                                    <div key={index} className={styles.chartBarItem}>
                                        <div className={styles.chartBarTrack}>
                                            <div
                                                className={`${styles.skeletonChartBar} ${styles.skeletonShimmer}`}
                                                style={{
                                                    height: `${[45, 75, 58, 88, 64, 52, 36][index]}%`,
                                                }}
                                            />
                                        </div>
                                        <span className={`${styles.skeletonMiniText} ${styles.skeletonShimmer}`}></span>
                                        <span className={`${styles.skeletonMiniText} ${styles.skeletonShimmer}`}></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.leftColumn}>
                        <div className={`${styles.panel} ${styles.signinsPanel}`}>
                            <div className={styles.panelHeader}>
                                <div>
                                    <div className={`${styles.skeletonHeading} ${styles.skeletonShimmer}`}></div>
                                    <div className={`${styles.skeletonText} ${styles.skeletonShimmer}`}></div>
                                </div>
                                <div className={`${styles.skeletonButton} ${styles.skeletonShimmer}`}></div>
                            </div>

                            <div className={styles.panelBody}>
                                <div className={styles.signinList}>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <div key={index} className={styles.signinRow}>
                                            <div className={styles.userBlock}>
                                                <div className={`${styles.avatar} ${styles.skeletonShimmer}`}></div>

                                                <div className={styles.userMeta}>
                                                    <div className={`${styles.skeletonName} ${styles.skeletonShimmer}`}></div>
                                                    <div className={`${styles.skeletonSubLine} ${styles.skeletonShimmer}`}></div>
                                                </div>
                                            </div>

                                            <div className={styles.signinRowRight}>
                                                <div className={`${styles.skeletonBadge} ${styles.skeletonShimmer}`}></div>
                                                <div className={`${styles.skeletonTime} ${styles.skeletonShimmer}`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.rightColumn}>
                        <div className={`${styles.panel} ${styles.activityPanel}`}>
                            <div className={styles.panelHeader}>
                                <div>
                                    <div className={`${styles.skeletonHeading} ${styles.skeletonShimmer}`}></div>
                                    <div className={`${styles.skeletonText} ${styles.skeletonShimmer}`}></div>
                                </div>
                            </div>

                            <div className={styles.panelBody}>
                                <div className={styles.activityList}>
                                    {Array.from({ length: 7 }).map((_, index) => (
                                        <div key={index} className={styles.activityItem}>
                                            <div className={`${styles.activityIcon} ${styles.skeletonShimmer}`}></div>

                                            <div className={styles.activityContent}>
                                                <div className={`${styles.skeletonActivityLine} ${styles.skeletonShimmer}`}></div>
                                                <div className={`${styles.skeletonActivityTime} ${styles.skeletonShimmer}`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>



            </div>

            <div className={styles.heroGrid}>


                <div className={styles.statsGrid}>
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div key={stat.label} className={styles.statCard}>
                                <div className={styles.statTop}>
                                    <div className={`${styles.statIcon} ${styles[stat.tone]}`}>
                                        <Icon size={18} strokeWidth={2.2} />
                                    </div>
                                </div>

                                <div className={styles.statValue}>{stat.value}</div>
                                <div className={styles.statLabel}>{stat.label}</div>
                                <div className={styles.statSub}>{stat.sub}</div>
                            </div>
                        );
                    })}
                </div>
                <div className={`${styles.panel} ${styles.chartPanel}`}>
                    <div className={styles.panelHeader}>
                        <div>
                            <h2>Today’s Traffic</h2>
                            <p>Estimated site activity across the day</p>
                        </div>
                        <div className={styles.panelHeaderIcon}>
                            <Activity size={16} strokeWidth={2.2} />
                        </div>
                    </div>

                    <div className={styles.chartBody}>
                        <div className={styles.chartBars}>
                            {trafficBars.map((bar) => (
                                <div key={bar.label} className={styles.chartBarItem}>
                                    <div className={styles.chartBarTrack}>
                                        <div
                                            className={styles.chartBarFill}
                                            style={{ height: `${(bar.value / maxTraffic) * 100}%` }}
                                        />
                                    </div>
                                    <span className={styles.chartBarValue}>{bar.value}</span>
                                    <span className={styles.chartBarLabel}>{bar.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.contentGrid}>
                <div className={styles.leftColumn}>

                    <div className={`${styles.panel} ${styles.signinsPanel}`}>
                        <div className={styles.panelHeader}>
                            <div>
                                <h2>Current Sign-Ins</h2>
                                <p>Compact live roster of everyone currently on site</p>
                            </div>
                            <button className={styles.ghostButton}>
                                View all <ChevronRight size={15} />
                            </button>
                        </div>

                        <div className={styles.panelBody}>
                            {signins.length > 0 ? (
                                <div className={styles.tableWrap}>
                                    <table className={styles.signinsTable}>
                                        <thead>
                                            <tr>
                                                <th>Person</th>
                                                <th>Type</th>
                                                <th>Company</th>
                                                <th>Department</th>
                                                <th>Time In</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {signins.map((user) => {
                                                const fullName = `${user.firstName} ${user.lastName}`;

                                                const typeConfig = {
                                                    Visitor: { color: styles.visitor, icon: UserRound },
                                                    Driver: { color: styles.driver, icon: Truck },
                                                    Temp: { color: styles.temp, icon: Users },
                                                    Contractor: { color: styles.contractor, icon: Briefcase },
                                                };

                                                const config = typeConfig[user.type] || {};
                                                const Icon = config.icon;

                                                return (
                                                    <tr key={user.id}>
                                                        <td>
                                                            <div className={styles.tableUserCell}>
                                                                <div className={styles.avatar}>
                                                                    <User size={15} strokeWidth={2.2} />
                                                                </div>
                                                                <div className={styles.tableUserMeta}>
                                                                    <span className={styles.tableUserName}>{fullName}</span>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <span className={`${styles.badge} ${config.color}`}>
                                                                {Icon && <Icon size={12} />}
                                                                {user.type}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <span className={styles.tableCellMuted}>
                                                                {user.company || "—"}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <span className={styles.tableCellMuted}>
                                                                {user.department || "—"}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <span className={styles.timeCell}>
                                                                {new Date(user.timeIn).toLocaleTimeString([], {
                                                                    hour: "numeric",
                                                                    minute: "2-digit",
                                                                })}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className={styles.emptyState}>No active sign-ins.</div>
                            )}
                        </div>
                    </div>

                </div>

                <div className={styles.rightColumn}>


                    <div className={`${styles.panel} ${styles.activityPanel}`}>
                        <div className={styles.panelHeader}>
                            <div>
                                <h2>Recent Activity</h2>
                                <p>Latest sign-in and sign-out events</p>
                            </div>
                        </div>

                        <div className={styles.panelBody}>
                            <div className={styles.activityList}>
                                {events.length > 0 ? (
                                    events.map((item) => (
                                        <div key={item.id} className={styles.activityItem}>
                                            <div className={styles.activityIcon}>
                                                {item.Action === "Signed in" ? (
                                                    <LogIn size={18} strokeWidth={2.2} />
                                                ) : (
                                                    <LogOut size={18} strokeWidth={2.2} />
                                                )}
                                            </div>

                                            <div className={styles.activityContent}>
                                                <p>
                                                    {item.user} {item.Action} as {item.type}
                                                </p>
                                                <span>
                                                    {new Date(item.time).toLocaleTimeString([], {
                                                        hour: "numeric",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.emptyState}>No recent events.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}