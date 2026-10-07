import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const businessId = user?.business_id;
  const location = useLocation();

  // ===== MANAGERS STATE =====
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [managerError, setManagerError] = useState("");

  const [showManagerModal, setShowManagerModal] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
  const [managerForm, setManagerForm] = useState({ name: "", email: "", password: "", role: "AGENT" });
  const [managerFormError, setManagerFormError] = useState("");
  const [savingManager, setSavingManager] = useState(false);

  // ===== PRODUCTS STATE =====
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");

  // Pagination state
  const [productPage, setProductPage] = useState(1);
  const [productTotalPages, setProductTotalPages] = useState(1);
  const [productTotal, setProductTotal] = useState(0);
  const PRODUCTS_PER_PAGE = 10;

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    sku: "", name: "", category: "", description: "",
    price: "", currency: "USD", stock_status: "available",
  });
  const [productFormError, setProductFormError] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);

  // ===== FETCH MANAGERS =====
  const fetchManagers = async () => {
    try {
      setLoadingManagers(true);
      const res = await api.get(`/businesses/${businessId}/users`);
      setManagers(res.data);
    } catch (err) {
      setManagerError("Failed to load managers");
    } finally {
      setLoadingManagers(false);
    }
  };

  // ===== FETCH PRODUCTS (paginated) =====
  const fetchProducts = async (page = 1) => {
    try {
      setLoadingProducts(true);
      const res = await api.get(`/businesses/${businessId}/products`, {
        params: { page, limit: PRODUCTS_PER_PAGE },
      });
      setProducts(res.data.data);
      setProductPage(res.data.pagination.page);
      setProductTotalPages(res.data.pagination.totalPages);
      setProductTotal(res.data.pagination.total);
    } catch (err) {
      setProductError("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchManagers();
      fetchProducts(1);
    }
  }, [businessId]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, [location.hash]);

  // ===== MANAGER HANDLERS =====
  const openAddManagerModal = () => {
    setEditingManager(null);
    setManagerForm({ name: "", email: "", password: "", role: "AGENT" });
    setManagerFormError("");
    setShowManagerModal(true);
  };

  const openEditManagerModal = (manager) => {
    setEditingManager(manager);
    setManagerForm({ name: manager.name, email: manager.email, password: "", role: manager.role });
    setManagerFormError("");
    setShowManagerModal(true);
  };

  const closeManagerModal = () => {
    setShowManagerModal(false);
    setEditingManager(null);
  };

  const handleManagerSubmit = async (e) => {
    e.preventDefault();
    setManagerFormError("");
    setSavingManager(true);
    try {
      if (editingManager) {
        await api.patch(`/businesses/${businessId}/users/${editingManager.id}`, {
          name: managerForm.name,
          role: managerForm.role,
        });
      } else {
        await api.post(`/businesses/${businessId}/users`, managerForm);
      }
      await fetchManagers();
      closeManagerModal();
    } catch (err) {
      setManagerFormError(err.response?.data?.error || "Something went wrong");
    } finally {
      setSavingManager(false);
    }
  };

  const toggleManagerStatus = async (manager) => {
    try {
      await api.patch(`/businesses/${businessId}/users/${manager.id}/status`, {
        is_active: !manager.is_active,
      });
      fetchManagers();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleDeleteManager = async (manager) => {
    if (!window.confirm(`Delete ${manager.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/businesses/${businessId}/users/${manager.id}`);
      fetchManagers();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete user");
    }
  };

  // ===== PRODUCT HANDLERS =====
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({ sku: "", name: "", category: "", description: "", price: "", currency: "USD", stock_status: "available" });
    setProductFormError("");
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      sku: product.sku || "",
      name: product.name || "",
      category: product.category || "",
      description: product.description || "",
      price: product.price || "",
      currency: product.currency || "USD",
      stock_status: product.stock_status || "available",
    });
    setProductFormError("");
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductFormError("");
    setSavingProduct(true);

    const payload = {
      ...productForm,
      price: productForm.price ? Number(productForm.price) : null,
    };

    try {
      if (editingProduct) {
        await api.put(`/businesses/${businessId}/products/${editingProduct.id}`, payload);
        await fetchProducts(productPage);
      } else {
        await api.post(`/businesses/${businessId}/products`, payload);
        await fetchProducts(1); // jump to page 1 so the new product is visible
      }
      closeProductModal();
    } catch (err) {
      setProductFormError(err.response?.data?.error || "Something went wrong");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/businesses/${businessId}/products/${product.id}`);
      // If this was the last item on the page (and not page 1), go back a page
      const isLastItemOnPage = products.length === 1 && productPage > 1;
      await fetchProducts(isLastItemOnPage ? productPage - 1 : productPage);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete product");
    }
  };

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
            <input type="text" placeholder="Search products, managers..." />
          </div>
          <div className="header-right">
            <button className="notification">
              🔔
              <span className="notification-dot"></span>
            </button>
            <span className="online-status">System Online</span>
          </div>
        </header>

        <main className="content">
          {/* STAT CARDS */}
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Total Products</p>
              <p className="stat-value">{productTotal}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Product Managers</p>
              <p className="stat-value">
                {managers.length} <span className="stat-sub">({activeManagerCount} Active)</span>
              </p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Low Stock Alerts</p>
              <p className="stat-value orange">{lowStockCount} Items</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">System Status</p>
              <p className="stat-value green">Active</p>
            </div>
          </div>

          {/* PRODUCT MANAGERS */}
          <section className="section" id="managers-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Product Managers</h2>
                <p className="section-description">Manage user accounts and system access privileges</p>
              </div>
              <button className="primary-button" onClick={openAddManagerModal}>
                + Add New Manager
              </button>
            </div>

            <div className="table-wrapper">
              {loadingManagers ? (
                <p style={{ padding: 20 }}>Loading...</p>
              ) : managerError ? (
                <p style={{ padding: 20, color: "red" }}>{managerError}</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Manager Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {managers.map((manager) => (
                      <tr key={manager.id}>
                        <td className="manager-name">{manager.name}</td>
                        <td>{manager.email}</td>
                        <td>{manager.role}</td>
                        <td>
                          <span className={manager.is_active ? "status active" : "status disabled"}>
                            {manager.is_active ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="text-right">
                          <button className="action-button edit-button" onClick={() => openEditManagerModal(manager)}>Edit</button>
                          <button
                            className={manager.is_active ? "action-button disable-button" : "action-button enable-button"}
                            onClick={() => toggleManagerStatus(manager)}
                          >
                            {manager.is_active ? "Disable" : "Enable"}
                          </button>
                          <button className="action-button delete-button" onClick={() => handleDeleteManager(manager)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* PRODUCTS */}
          <section className="section" id="products-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Product Inventory</h2>
                <p className="section-description">Add, edit, or remove inventory items</p>
              </div>
              <button className="primary-button green-button" onClick={openAddProductModal}>
                + Add New Product
              </button>
            </div>

            <div className="table-wrapper">
              {loadingProducts ? (
                <p style={{ padding: 20 }}>Loading...</p>
              ) : productError ? (
                <p style={{ padding: 20, color: "red" }}>{productError}</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="product-name">{product.name}</td>
                        <td>{product.category || "-"}</td>
                        <td>{formatPrice(product)}</td>
                        <td>
                          <span className={product.stock_status === "low_stock" ? "stock-low" : "stock-good"}>
                            {product.stock_status}
                          </span>
                        </td>
                        <td className="text-right">
                          <button className="action-button edit-button" onClick={() => openEditProductModal(product)}>Edit</button>
                          <button className="action-button delete-button" onClick={() => handleDeleteProduct(product)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* PAGINATION CONTROLS */}
            {!loadingProducts && productTotalPages > 1 && (
              <div className="pagination-controls">
                <button
                  className="action-button"
                  disabled={productPage === 1}
                  onClick={() => fetchProducts(productPage - 1)}
                >
                  ← Previous
                </button>
                <span className="pagination-info">
                  Page {productPage} of {productTotalPages} ({productTotal} total)
                </span>
                <button
                  className="action-button"
                  disabled={productPage === productTotalPages}
                  onClick={() => fetchProducts(productPage + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* MANAGER MODAL */}
      {showManagerModal && (
        <div className="modal-overlay" onClick={closeManagerModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{editingManager ? "Edit Manager" : "Add New Manager"}</h3>
            <form onSubmit={handleManagerSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={managerForm.name} onChange={(e) => setManagerForm({ ...managerForm, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={managerForm.email} onChange={(e) => setManagerForm({ ...managerForm, email: e.target.value })} required disabled={!!editingManager} />
              </div>
              {!editingManager && (
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" value={managerForm.password} onChange={(e) => setManagerForm({ ...managerForm, password: e.target.value })} required />
                </div>
              )}
              <div className="form-group">
                <label>Role</label>
                <select value={managerForm.role} onChange={(e) => setManagerForm({ ...managerForm, role: e.target.value })}>
                  <option value="AGENT">Agent</option>
                  <option value="ADMIN">Admin</option>
                  <option value="OWNER">Owner</option>
                </select>
              </div>
              {managerFormError && <p className="login-error">{managerFormError}</p>}
              <div className="modal-actions">
                <button type="button" className="action-button" onClick={closeManagerModal}>Cancel</button>
                <button type="submit" className="primary-button" disabled={savingManager}>
                  {savingManager ? "Saving..." : editingManager ? "Save Changes" : "Add Manager"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT MODAL */}
      {showProductModal && (
        <div className="modal-overlay" onClick={closeProductModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>SKU</label>
                <input type="text" value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input type="text" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select value={productForm.currency} onChange={(e) => setProductForm({ ...productForm, currency: e.target.value })}>
                  <option value="USD">USD</option>
                  <option value="LKR">LKR</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div className="form-group">
                <label>Stock Status</label>
                <select value={productForm.stock_status} onChange={(e) => setProductForm({ ...productForm, stock_status: e.target.value })}>
                  <option value="available">Available</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
              {productFormError && <p className="login-error">{productFormError}</p>}
              <div className="modal-actions">
                <button type="button" className="action-button" onClick={closeProductModal}>Cancel</button>
                <button type="submit" className="primary-button" disabled={savingProduct}>
                  {savingProduct ? "Saving..." : editingProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;