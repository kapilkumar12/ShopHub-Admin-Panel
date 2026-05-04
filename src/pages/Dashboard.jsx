import { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#f59e0b"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [view, setView] = useState("monthly");

  useEffect(() => {
    API.get("/admin/dashboard").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) return <p className="p-6">Loading...</p>;

  ////////////////////////////////////////////////////////////////
  // 🔥 ORDER DATA
  ////////////////////////////////////////////////////////////////
  const completedOrders =
    data.totalOrders - data.pendingOrders - data.cancelledOrders;

  const orderData = [
    { name: "Pending", value: data.pendingOrders },
    { name: "Completed", value: completedOrders },
    { name: "Cancelled", value: data.cancelledOrders },
  ];

  ////////////////////////////////////////////////////////////////
  // 🔥 ENGAGEMENT
  ////////////////////////////////////////////////////////////////
  const engagementData = [
    { name: "Wishlist", value: data.stats?.totalWishlist || 0 },
    { name: "Views", value: data.stats?.totalViews || 0 },
    { name: "Sales", value: data.stats?.totalSales || 0 },
  ];

  ////////////////////////////////////////////////////////////////
  // 🔥 SALES FORMAT
  ////////////////////////////////////////////////////////////////
  const getSalesData = () => {
    let raw = [];

    if (view === "daily") raw = data.dailySales || [];
    if (view === "weekly") raw = data.weeklySales || [];
    if (view === "monthly") raw = data.monthlySales || [];

    return raw.map((item) => ({
      name:
        view === "monthly"
          ? `M${item._id.month}`
          : view === "weekly"
          ? `W${item._id.week}`
          : `D${item._id.day}`,
      value: item.total,
    }));
  };

  ////////////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////////////
  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">📊 Admin Dashboard</h1>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-8">

        <Card title="Orders" value={data.totalOrders} bgcolor="blue" color="white" />
        <Card title="Revenue" value={`₹${Math.floor(data.totalRevenue)}`} bgcolor="green" color="white"/>
        <Card title="Pending" value={data.pendingOrders} bgcolor="yellow" />
        <Card title="Completed" value={completedOrders} bgcolor="emerald" />
        <Card title="Cancelled" value={data.cancelledOrders} bgcolor="red" color="white"/>

      </div>

      {/* 🔥 CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        <ChartCard title="Order Distribution">
          <CustomPie data={orderData} />
        </ChartCard>

        <ChartCard title="Product Engagement">
          <CustomPie data={engagementData} />
        </ChartCard>

        <ChartCard title="Sales Analytics">

          <div className="flex gap-2 mb-3">
            {["daily", "weekly", "monthly"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  view === v
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <CustomPie data={getSalesData()} />

        </ChartCard>

      </div>

      {/* 🔥 TOP PRODUCTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        <TopList
          title="❤️ Most Wishlisted"
          data={data.topWishlist}
          field="wishlistCount"
        />

        <TopList
          title="👁️ Most Viewed"
          data={data.topViewed}
          field="views"
        />

        <TopList
          title="🔥 Top Selling"
          data={data.topSelling}
          field="salesCount"
        />

      </div>

      {/* 🔥 RECENT ORDERS */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-4">Recent Orders</h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-3">User</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.recentOrders?.map((o) => (
              <tr key={o._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{o.user?.name}</td>
                <td className="p-3 font-semibold">₹{Math.floor(o.totalPrice)}</td>
                <td className="p-3">
                  <StatusBadge status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

//////////////////////////////////////////////////////////////
// 🔥 COMPONENTS
//////////////////////////////////////////////////////////////

function Card({ title, value, color, bgcolor }) {
  return (
    <div className={`p-5 rounded-2xl shadow text-${color} bg-${bgcolor}-500`}>
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function CustomPie({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          label
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

function TopList({ title, data = [], field }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <h3 className="font-semibold mb-4">{title}</h3>

      {data.map((p) => (
        <div key={p._id} className="flex justify-between border-b py-2 text-sm">
          <span className="truncate">{p.name}</span>
          <span className="font-bold">{p[field]}</span>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: "bg-yellow-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
    confirmed: "bg-blue-500",
  };

  return (
    <span className={`text-white px-3 py-1 rounded text-xs ${colors[status]}`}>
      {status}
    </span>
  );
}