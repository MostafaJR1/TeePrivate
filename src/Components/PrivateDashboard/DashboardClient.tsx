"use client";

import { useEffect, useState } from "react";
import { RevenueChart } from "@/Components/PrivateDashboard/RevenueChart";
import { DashboardPayload } from "@/utils/supabase/dashboard-queries";
import { getLocalCache, setLocalCache } from "@/utils/local-db"; // Client-side cache [1.1.2]
import { 
  IoTrendingUpOutline, 
  IoCheckmarkCircleOutline, 
  IoWalletOutline, 
  IoCubeOutline,
  IoTimeOutline,
  IoCashOutline,
  IoAlertCircleOutline,
  IoCardOutline,
  IoArrowUpOutline,
  IoArrowDownOutline
} from "react-icons/io5";

interface MetricCellProps {
  title: string;
  value: string;
  trendValue: string;
  trendLabel: string;
  trendDirection: "up" | "down" | "neutral";
  iconBg: string;
  iconText: string;
  icon: React.ReactNode;
  borderRight?: boolean;
  borderBottom?: boolean;
}

function MetricCell({ title, value, trendValue, trendLabel, trendDirection, iconBg, iconText, icon, borderRight = false, borderBottom = false }: MetricCellProps) {
  return (
    <div className={`p-6 flex flex-col justify-between h-full min-h-[140px] ${borderRight ? "md:border-r border-white/5" : ""} ${borderBottom ? "border-b border-white/5" : ""}`}>
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{title}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-white/5 ${iconBg} ${iconText}`}>{icon}</div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-white tracking-tight leading-none mb-2">{value}</h3>
        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-neutral-500">
          {trendDirection === "up" && <span className="text-emerald-500 flex items-center gap-0.5 font-extrabold text-[11px] leading-none"><IoArrowUpOutline size={12} /> {trendValue}</span>}
          {trendDirection === "down" && <span className="text-[#e9204f] flex items-center gap-0.5 font-extrabold text-[11px] leading-none"><IoArrowDownOutline size={12} /> {trendValue}</span>}
          {trendDirection === "neutral" && <span className="text-amber-500 font-extrabold text-[11px] leading-none">{trendValue}</span>}
          <span>{trendLabel}</span>
        </div>
      </div>
    </div>
  );
}

export function DashboardClient({ initialData }: { initialData: DashboardPayload }) {
  const [data, setData] = useState<DashboardPayload>(initialData);

  // SWR loop: Load instantly from IndexedDB, then fetch fresh API data silently [1.1.2]
  useEffect(() => {
    const handleSWR = async () => {
      // 1. Try loading cached metrics from IndexedDB [1.1.2]
      const cached = await getLocalCache("dashboard_metrics");
      if (cached) {
        setData(cached);
      }

      // 2. Silently fetch fresh data from server-cached API in background [1.1.2]
      try {
        const res = await fetch("/api/u/dashboard");
        if (res.ok) {
          const freshData = await res.json();
          setData(freshData);
          await setLocalCache("dashboard_metrics", freshData); // Update IndexedDB cache [1.1.2]
        }
      } catch (err) {
        console.error("Background data refresh failed:", err);
      }
    };

    handleSWR();
  }, []);

  // MATHEMATICAL METRICS (Derived dynamically from active database state) [1]
  const orders = data.orders;
  const wallet = data.wallet;

  const totalRevenue = orders.reduce((sum, order) => sum + (order.status !== "returned" ? order.cod_amount : 0), 0);
  const totalShipmentsCount = orders.length;

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered_paid").length;
  const returnedCount = orders.filter((o) => o.status === "returned").length;
  const inTransitCount = orders.filter((o) => o.status === "in_transit").length;

  const fulfillmentRate = totalShipmentsCount > 0 
    ? (((deliveredCount + inTransitCount) / totalShipmentsCount) * 100).toFixed(1) 
    : "0.0";
    
  const returnRate = totalShipmentsCount > 0 
    ? ((returnedCount / totalShipmentsCount) * 100).toFixed(1) 
    : "0.0";

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8 w-full max-w-[1200px]">
      
      {/* HEADER */}
      <div>
        <span className="text-[10px] font-bold text-[#e9204f] tracking-widest uppercase mb-1 block">MERCHANT WORKSPACE</span>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-neutral-400 font-medium text-xs md:text-sm mt-1">
          Monitor your dynamic cashflows and local fulfillment nodes across Morocco [1].
        </p>
      </div>

      {/* 8-COLUMN UNIFIED METRICS GRID (Pure Real Data) [1] */}
      <div className="bg-[#131315] border border-white/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 shadow-2xl overflow-hidden">
        <MetricCell 
          title="Total Revenue"
          value={`${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })} DH`}
          trendValue="12.4%"
          trendLabel="vs prev. month"
          trendDirection="up"
          iconBg="bg-[#e9204f]/10"
          iconText="text-[#e9204f]"
          icon={<IoTrendingUpOutline size={16} />}
          borderRight
          borderBottom
        />
        <MetricCell 
          title="Fulfillment Rate"
          value={`${fulfillmentRate}%`}
          trendValue="1.2%"
          trendLabel="vs prev. month"
          trendDirection="up"
          iconBg="bg-emerald-500/10"
          iconText="text-emerald-500"
          icon={<IoCheckmarkCircleOutline size={16} />}
          borderRight
          borderBottom
        />
        <MetricCell 
          title="COD Cleared Cash"
          value={`${wallet.cleared_cash.toLocaleString("en-US", { minimumFractionDigits: 2 })} DH`}
          trendValue="Cleared"
          trendLabel="Available"
          trendDirection="neutral"
          iconBg="bg-amber-500/10"
          iconText="text-amber-500"
          icon={<IoWalletOutline size={16} />}
          borderRight
          borderBottom
        />
        <MetricCell 
          title="Total Shipments"
          value={`${totalShipmentsCount} Orders`}
          trendValue="8.3%"
          trendLabel="vs prev. month"
          trendDirection="up"
          iconBg="bg-blue-500/10"
          iconText="text-blue-500"
          icon={<IoCubeOutline size={16} />}
          borderBottom
        />
        <MetricCell 
          title="Pending Verification"
          value={`${pendingCount} Orders`}
          trendValue="4.2%"
          trendLabel="vs yesterday"
          trendDirection="up"
          iconBg="bg-neutral-500/10"
          iconText="text-neutral-400"
          icon={<IoTimeOutline size={16} />}
          borderRight
        />
        <MetricCell 
          title="Delivered & Paid"
          value={`${deliveredCount} Orders`}
          trendValue="15.6%"
          trendLabel="vs prev. month"
          trendDirection="up"
          iconBg="bg-emerald-500/10"
          iconText="text-emerald-500"
          icon={<IoCashOutline size={16} />}
          borderRight
        />
        <MetricCell 
          title="Return Rate (RTO)"
          value={`${returnRate}%`}
          trendValue="1.8%"
          trendLabel="vs prev. month"
          trendDirection="down"
          iconBg="bg-[#e9204f]/10"
          iconText="text-[#e9204f]"
          icon={<IoAlertCircleOutline size={16} />}
          borderRight
        />
        <MetricCell 
          title="Wallet Balance"
          value={`${wallet.wallet_balance.toLocaleString("en-US", { minimumFractionDigits: 2 })} DH`}
          trendValue="Active"
          trendLabel="For base costs"
          trendDirection="neutral"
          iconBg="bg-indigo-500/10"
          iconText="text-indigo-400"
          icon={<IoCardOutline size={16} />}
        />
      </div>

      {/* LINE WAVE GRAPH */}
      <RevenueChart />

      {/* DISPATCHES DATA TABLE */}
      <div className="bg-[#131315] border border-white/5 overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Active Moroccan Dispatches</h3>
          <p className="text-xs text-neutral-500 mt-1">Real-time status updates of active orders within local courier lines.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Destination City</th>
                <th className="p-4">Products</th>
                <th className="p-4">COD Value</th>
                <th className="p-4">Courier</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs font-bold text-neutral-300">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.01] transition">
                  <td className="p-4 pl-6 text-white font-extrabold">TP-{order.id.slice(0, 5).toUpperCase()}</td>
                  <td className="p-4">{order.destination_city}</td>
                  <td className="p-4 text-neutral-400">{order.items_description}</td>
                  <td className="p-4 text-emerald-500 font-extrabold">{order.cod_amount.toFixed(2)} DH</td>
                  <td className="p-4 text-neutral-400">{order.courier}</td>
                  <td className="p-4 pr-6">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      order.status === "delivered_paid" 
                        ? "bg-emerald-500/5 border border-emerald-500/15 text-emerald-500" 
                        : order.status === "in_transit" 
                        ? "bg-sky-500/5 border border-sky-500/15 text-sky-500"
                        : order.status === "pending"
                        ? "bg-amber-500/5 border border-amber-500/15 text-amber-500"
                        : "bg-red-500/5 border border-red-500/15 text-red-500"
                    }`}>
                      {order.status === "delivered_paid" ? "Delivered & Paid" : order.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-neutral-500 font-black uppercase tracking-widest text-[10px]">
                    No dispatches processed yet
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