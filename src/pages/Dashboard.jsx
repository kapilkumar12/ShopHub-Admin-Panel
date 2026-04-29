import { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [view, setView] = useState("monthly");

  ////////////////////////////////////////////////////////////////
  // 🔥 FETCH DATA
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    API.get("/admin/dashboard").then((res) => {
      setData(res.data);
      console.log("setData", res.data)
    });
  }, []);

  if (!data) return <p className="p-6">Loading...</p>;

  ////////////////////////////////////////////////////////////////
  // 🔥 ORDER DISTRIBUTION (FIXED)
  ////////////////////////////////////////////////////////////////
  const completedOrders =
    data.totalOrders - data.pendingOrders - data.cancelledOrders;

  const orderData = [
    { name: "Pending", value: data.pendingOrders },
    { name: "Completed", value: completedOrders },
    { name: "Cancelled", value: data.cancelledOrders },
  ];

  ////////////////////////////////////////////////////////////////
  // 🔥 PRODUCT ENGAGEMENT
  ////////////////////////////////////////////////////////////////
  const engagementData = [
    { name: "Wishlist", value: data.stats?.totalWishlist || 0 },
    { name: "Views", value: data.stats?.totalViews || 0 },
    { name: "Sales", value: data.stats?.totalSales || 0 },
  ];

  ////////////////////////////////////////////////////////////////
  // 🔥 SALES DATA FORMAT
  ////////////////////////////////////////////////////////////////
  const getSalesData = () => {
    let raw = [];

    if (view === "daily") raw = data.dailySales || [];
    if (view === "weekly") raw = data.weeklySales || [];
    if (view === "monthly") raw = data.monthlySales || [];

    return raw.map((item) => ({
      name:
        view === "monthly"
          ? `M${item._id}`
          : view === "weekly"
          ? `W${item._id}`
          : `D${item._id}`,
      value: item.total,
    }));
  };

  ////////////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////////////
  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card title="Orders" value={data.totalOrders} />
        <Card title="Revenue" value={`₹${Math.floor(data.totalRevenue || 0)}`} />
        <Card title="Pending" value={data.pendingOrders} />
        <Card title="Cancelled" value={data.cancelledOrders} />
      </div>

      {/* 🔥 CHARTS */}
      <div className="grid grid-cols-3 gap-6 mb-8">

        {/* ORDER */}
        <ChartCard title="Order Distribution">
          <CustomPie data={orderData} />
        </ChartCard>

        {/* ENGAGEMENT */}
        <ChartCard title="Product Engagement">
          <CustomPie data={engagementData} />
        </ChartCard>

        {/* SALES */}
        <ChartCard title="Sales Distribution">

          <div className="flex gap-2 mb-3">
            {["daily", "weekly", "monthly"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 rounded ${
                  view === v
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
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
      <div className="grid grid-cols-3 gap-6 mb-8">

        <TopList
          title="❤️ Most Wishlisted"
          data={data.topWishlist || []}
          field="wishlistCount"
        />

        <TopList
          title="👁️ Most Viewed"
          data={data.topViewed || []}
          field="views"
        />

        <TopList
          title="🔥 Top Selling"
          data={data.topSelling || []}
          field="soldCount"
        />

      </div>

      {/* 🔥 RECENT ORDERS */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-4">Recent Orders</h2>

        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.recentOrders?.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-3">{o.user?.name}</td>
                <td className="p-3">₹{o.totalPrice}</td>
                <td className="p-3">{o.status}</td>
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

function Card({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <p className="text-gray-500">{title}</p>
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
            <Cell key={i} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

function TopList({ title, data, field }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <h3 className="font-semibold mb-4">{title}</h3>

      {data.map((p) => (
        <div
          key={p._id}
          className="flex justify-between border-b py-2 text-sm"
        >
          <span className="truncate">{p.name}</span>
          <span className="font-bold">{p[field]}</span>
        </div>
      ))}
    </div>
  );
}