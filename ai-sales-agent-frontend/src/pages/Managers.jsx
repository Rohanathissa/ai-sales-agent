import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

function Managers() {
  const { user } = useAuth();
  const businessId = user?.business_id;

  // ===== MANAGERS STATE =====
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [managerError, setManagerError] = useState("");

  const [showManagerModal, setShowManagerModal] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
  const [managerForm, setManagerForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "AGENT",
  });
  const [managerFormError, setManagerFormError] = useState("");
  const [savingManager, setSavingManager] = useState(false);

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

  useEffect(() => {
    if (businessId) {
      fetchManagers();
    }
  }, [businessId]);

  // ===== MANAGER HANDLERS =====
  const openAddManagerModal = () => {
    setEditingManager(null);
    setManagerForm({ name: "", email: "", password: "", role: "AGENT" });
    setManagerFormError("");
    setShowManagerModal(true);
  };

  const openEditManagerModal = (manager) => {
    setEditingManager(manager);
    setManagerForm({
      name: manager.name,
      email: manager.email,
      password: "",
      role: manager.role,
    });
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
        const payload = {
          name: managerForm.name,
          email: managerForm.email,
          role: managerForm.role,
        };
        if (managerForm.password) {
          payload.password = managerForm.password;
        }
        await api.put(`/businesses/${businessId}/users/${editingManager.id}`, payload);
      } else {
        if (!managerForm.password) {
          setManagerFormError("Password is required for new accounts");
          setSavingManager(false);
          return;
        }
        await api.post(`/businesses/${businessId}/users`, managerForm);
      }
      closeManagerModal();
      fetchManagers();
    } catch (err) {
      setManagerFormError(err.response?.data?.error || "Something went wrong");
    } finally {
      setSavingManager(false);
    }
  };

  const toggleManagerStatus = async (manager) => {
    try {
      await api.put(`/businesses/${businessId}/users/${manager.id}`, {
        is_active: !manager.is_active,
      });
      fetchManagers();
    } catch (err) {
      alert("Failed to update user status");
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

  const activeCount = managers.filter((m) => m.is_active).length;
  const adminCount = managers.filter((m) => m.role === "ADMIN" || m.role === "admin").length;

  return (
    <div className="app">
      <Sidebar />

      <div className="main-wrapper">
        <header className="header">
          <div className="search-box">
            <input type="text" placeholder="Search team members by name or email..." />
          </div>
          <div className="header-right">
            <span className="online-status">
              Team: {managers.length} Users ({activeCount} Active)
            </span>
          </div>
        </header>

        <main className="content">
          {/* STATS ROW */}
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Total Team Members</p>
              <p className="stat-value">{managers.length}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Active Agents</p>
              <p className="stat-value green">{activeCount}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Administrators</p>
              <p className="stat-value">{adminCount}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Access Control</p>
              <p className="stat-value green">Protected</p>
            </div>
          </div>

          <section className="section">
            <div className="section-header">
              <div>
                <h2 className="section-title">👥 Product Managers & Staff Accounts</h2>
                <p className="section-description">
                  Manage user accounts, assign sales roles, and configure system permissions
                </p>
              </div>
              <button className="primary-button" onClick={openAddManagerModal}>
                + Add New Manager
              </button>
            </div>

            <div className="table-wrapper">
              {loadingManagers ? (
                <p style={{ padding: 20 }}>Loading managers...</p>
              ) : managerError ? (
                <p style={{ padding: 20, color: "red" }}>{managerError}</p>
              ) : managers.length === 0 ? (
                <p style={{ padding: 20, color: "#64748b" }}>No managers found.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Manager Name</th>
                      <th>Email Address</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
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
                        <td className="text-right">
                          <button
                            className="action-button edit-button"
                            onClick={() => openEditManagerModal(manager)}
                          >
                            Edit
                          </button>
                          <button
                            className={manager.is_active ? "action-button disable-button" : "action-button enable-button"}
                            onClick={() => toggleManagerStatus(manager)}
                          >
                            {manager.is_active ? "Disable" : "Enable"}
                          </button>
                          <button
                            className="action-button delete-button"
                            onClick={() => handleDeleteManager(manager)}
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
          </section>
        </main>
      </div>

      {/* MANAGER MODAL */}
      {showManagerModal && (
        <div className="modal-overlay" onClick={closeManagerModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingManager ? "Edit Manager" : "Add New Manager"}</h3>
              <button className="modal-close" onClick={closeManagerModal}>&times;</button>
            </div>
            {managerFormError && <p className="modal-error">{managerFormError}</p>}
            <form onSubmit={handleManagerSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohana Hettiarachchi"
                  value={managerForm.name}
                  onChange={(e) => setManagerForm({ ...managerForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. manager@gemconnect.lk"
                  value={managerForm.email}
                  onChange={(e) => setManagerForm({ ...managerForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Password {editingManager ? "(leave blank to keep current)" : "*"}</label>
                <input
                  type="password"
                  placeholder={editingManager ? "Enter new password or leave blank" : "Min 6 characters"}
                  value={managerForm.password}
                  onChange={(e) => setManagerForm({ ...managerForm, password: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  value={managerForm.role}
                  onChange={(e) => setManagerForm({ ...managerForm, role: e.target.value })}
                >
                  <option value="AGENT">AGENT (Chat & Sales Handling)</option>
                  <option value="MANAGER">MANAGER (Catalog & Operations)</option>
                  <option value="ADMIN">ADMIN (Full Access)</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="action-button" onClick={closeManagerModal}>
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={savingManager}>
                  {savingManager ? "Saving..." : editingManager ? "Update Account" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Managers;
