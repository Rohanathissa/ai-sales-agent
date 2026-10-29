import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const businessId = user?.business_id;
  const navigate = useNavigate();

  // ===== STATS & SUMMARY STATE =====
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(true);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productTotal, setProductTotal] = useState(0);

  // ===== FETCH DATA (View Only Summary) =====
  const fetchDashboardData = async () => {
    try {
      setLoadingManagers(true);
      setLoadingProducts(true);

      const [managersRes, productsRes] = await Promise.all([
        api.get(`/businesses/${businessId}/users`),
        api.get(`/businesses/${businessId}/products`, { params: { page: 1, limit: 6 } }),
      ]);

      setManagers(managersRes.data);
      setProducts(productsRes.data.data);
      setProductTotal(productsRes.data.pagination.total);
    } catch (err) {
      console.error("Failed to load dashboard summary", err);
    } finally {
      setLoadingManagers(false);
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchDashboardData();
    }
  }, [businessId]);

  const activeManagerCount = managers.filter((m) => m.is_active).length;
  const lowStockCount = products.filter((p) => p.stock_status === "low_stock").length;

  const formatPrice = (product) => {
    if (product.price === null || product.price === undefined) return "-";
    return `${product.currency || "USD"} ${Number(product.price).toLocaleString()}`;
  };

  return (
    <div className="app">
      <Sidebar />

      <div className="main-wrapper">
        <header className="header">
          <div className="search-box">
            <input type="text" placeholder="Search system overview..." />
          </div>
          <div className="header-right">
            <span className="online-status">🟢 System Operational</span>
          </div>
        </header>

        <main className="content">
          {/* STAT CARDS OVERVIEW */}
          <div className="stats-grid">
            <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => navigate("/products")}>
              <p className="stat-label">Total Products</p>
              <p className="stat-value">{productTotal}</p>
              <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: "600", marginTop: "4px", display: "inline-block" }}>
                View Catalog &rarr;
              </span>
            </div>
            <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => navigate("/managers")}>
              <p className="stat-label">Product Managers</p>
              <p className="stat-value">
                {managers.length} <span className="stat-sub">({activeManagerCount} Active)</span>
              </p>
              <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: "600", marginTop: "4px", display: "inline-block" }}>
                View Team &rarr;
              </span>
            </div>
            <div className="stat-card">
              <p className="stat-label">Low Stock Alerts</p>
              <p className="stat-value orange">{lowStockCount} Items</p>
            </div>
            <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => navigate("/chat-simulator")}>
              <p className="stat-label">AI Sales Status</p>
              <p className="stat-value green">Autonomous</p>
              <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "600", marginTop: "4px", display: "inline-block" }}>
                Open Live Chat &rarr;
              </span>
            </div>
          </div>

          {/* PRODUCT INVENTORY SUMMARY (VIEW ONLY) */}
          <section className="section">
            <div className="section-header">
              <div>
                <h2 className="section-title">📦 Product Inventory Summary</h2>
                <p className="section-description">
                  Overview of current gemstone stock and live pricing (View Only)
                </p>
              </div>
              <button
                className="action-button"
                onClick={() => navigate("/products")}
                style={{
                  background: "#eff6ff",
                  color: "#2563eb",
                  fontWeight: "600",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #bfdbfe",
                }}
              >
                Go to Products Page &rarr;
              </button>
            </div>

            <div className="table-wrapper">
              {loadingProducts ? (
                <p style={{ padding: 20 }}>Loading summary...</p>
              ) : products.length === 0 ? (
                <p style={{ padding: 20, color: "#64748b" }}>No products in catalog.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock Availability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="product-name">
                          <strong>{product.name}</strong>
                          {product.sku && (
                            <span style={{ display: "block", fontSize: "11px", color: "#64748b" }}>
                              SKU: {product.sku}
                            </span>
                          )}
                        </td>
                        <td>{product.category || "-"}</td>
                        <td>{formatPrice(product)}</td>
                        <td>
                          <span
                            className={
                              product.stock_status === "available"
                                ? "status active"
                                : product.stock_status === "low_stock"
                                ? "status low-stock"
                                : "status disabled"
                            }
                          >
                            {product.stock_status === "available"
                              ? "In Stock"
                              : product.stock_status === "low_stock"
                              ? "Low Stock"
                              : "Out of Stock"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* MANAGERS SUMMARY (VIEW ONLY) */}
          <section className="section">
            <div className="section-header">
              <div>
                <h2 className="section-title">👥 Team & Product Managers Summary</h2>
                <p className="section-description">
                  Current active sales agents and staff accounts (View Only)
                </p>
              </div>
              <button
                className="action-button"
                onClick={() => navigate("/managers")}
                style={{
                  background: "#eff6ff",
                  color: "#2563eb",
                  fontWeight: "600",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #bfdbfe",
                }}
              >
                Manage Staff Accounts &rarr;
              </button>
            </div>

            <div className="table-wrapper">
              {loadingManagers ? (
                <p style={{ padding: 20 }}>Loading team...</p>
              ) : managers.length === 0 ? (
                <p style={{ padding: 20, color: "#64748b" }}>No managers registered.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Manager Name</th>
                      <th>Email Address</th>
                      <th>Role</th>
                      <th>Account Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {managers.map((manager) => (
                      <tr key={manager.id}>
                        <td className="manager-name">
                          <strong>{manager.name}</strong>
                        </td>
                        <td>{manager.email}</td>
                        <td>
                          <span
                            style={{
                              background: manager.role === "ADMIN" ? "#dbeafe" : "#f1f5f9",
                              color: manager.role === "ADMIN" ? "#1e40af" : "#475569",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontWeight: "600",
                              fontSize: "12px",
                            }}
                          >
                            {manager.role}
                          </span>
                        </td>
                        <td>
                          <span className={manager.is_active ? "status active" : "status disabled"}>
                            {manager.is_active ? "Active" : "Disabled"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;