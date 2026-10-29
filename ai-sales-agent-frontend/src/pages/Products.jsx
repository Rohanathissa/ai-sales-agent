import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

function Products() {
  const { user } = useAuth();
  const businessId = user?.business_id;

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
    sku: "",
    name: "",
    category: "",
    description: "",
    price: "",
    currency: "USD",
    stock_status: "available",
  });
  const [productFormError, setProductFormError] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);

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
      fetchProducts(1);
    }
  }, [businessId]);

  // ===== PRODUCT HANDLERS =====
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      sku: "",
      name: "",
      category: "",
      description: "",
      price: "",
      currency: "USD",
      stock_status: "available",
    });
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
      price: product.price ?? "",
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
        await fetchProducts(1);
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
      const isLastItemOnPage = products.length === 1 && productPage > 1;
      await fetchProducts(isLastItemOnPage ? productPage - 1 : productPage);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete product");
    }
  };

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
            <input type="text" placeholder="Search product catalog..." />
          </div>
          <div className="header-right">
            <span className="online-status">Catalog Active ({productTotal} Items)</span>
          </div>
        </header>

        <main className="content">
          <section className="section">
            <div className="section-header">
              <div>
                <h2 className="section-title">📦 Product Inventory & Catalog</h2>
                <p className="section-description">
                  Manage gemstones, jewellery items, prices, and live stock for the AI Sales Agent
                </p>
              </div>
              <button className="primary-button green-button" onClick={openAddProductModal}>
                + Add New Product
              </button>
            </div>

            <div className="table-wrapper">
              {loadingProducts ? (
                <p style={{ padding: 20 }}>Loading products...</p>
              ) : productError ? (
                <p style={{ padding: 20, color: "red" }}>{productError}</p>
              ) : products.length === 0 ? (
                <p style={{ padding: 20, color: "#64748b" }}>No products found. Add your first item!</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock Status</th>
                      <th className="text-right">Actions</th>
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
                        <td className="text-right">
                          <button
                            className="action-button edit-button"
                            onClick={() => openEditProductModal(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-button delete-button"
                            onClick={() => handleDeleteProduct(product)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls */}
            {productTotalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
                  background: "white",
                  borderTop: "1px solid #e2e8f0",
                }}
              >
                <button
                  className="action-button"
                  disabled={productPage <= 1}
                  onClick={() => fetchProducts(productPage - 1)}
                  style={{ opacity: productPage <= 1 ? 0.5 : 1 }}
                >
                  &larr; Previous
                </button>
                <span style={{ fontSize: "13px", color: "#64748b" }}>
                  Page {productPage} of {productTotalPages} ({productTotal} items)
                </span>
                <button
                  className="action-button"
                  disabled={productPage >= productTotalPages}
                  onClick={() => fetchProducts(productPage + 1)}
                  style={{ opacity: productPage >= productTotalPages ? 0.5 : 1 }}
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* PRODUCT MODAL */}
      {showProductModal && (
        <div className="modal-overlay" onClick={closeProductModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <button className="modal-close" onClick={closeProductModal}>&times;</button>
            </div>
            {productFormError && <p className="modal-error">{productFormError}</p>}
            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Blue Ceylon Sapphire"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label>SKU</label>
                  <input
                    type="text"
                    placeholder="e.g. GEM-BS-001"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Sapphire, Ring, Ruby"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 3500.00"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    value={productForm.currency}
                    onChange={(e) => setProductForm({ ...productForm, currency: e.target.value })}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="LKR">LKR (Rs)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Stock Status</label>
                <select
                  value={productForm.stock_status}
                  onChange={(e) => setProductForm({ ...productForm, stock_status: e.target.value })}
                >
                  <option value="available">In Stock (Available)</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description (AI Uses This for Customer Inquiries)</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Natural unheated royal blue sapphire from Ratnapura, Sri Lanka. 2.45 carats, oval cut, certified."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="action-button" onClick={closeProductModal}>
                  Cancel
                </button>
                <button type="submit" className="primary-button green-button" disabled={savingProduct}>
                  {savingProduct ? "Saving..." : editingProduct ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
