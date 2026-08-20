import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./ChatSimulator.css";

function ChatSimulator() {
  const { user } = useAuth();
  const businessId = user?.business_id;

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

  const [selectedConvId, setSelectedConvId] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingThread, setLoadingThread] = useState(false);

  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [showNewConvModal, setShowNewConvModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [newConvForm, setNewConvForm] = useState({ customer_id: "", newCustomerName: "", newCustomerPhone: "" });
  const [creatingConv, setCreatingConv] = useState(false);
  const [newConvError, setNewConvError] = useState("");

  const messagesEndRef = useRef(null);

  // ===== FETCH CONVERSATIONS LIST =====
  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);
      const res = await api.get(`/businesses/${businessId}/conversations`);
      setConversations(res.data);
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setLoadingConversations(false);
    }
  };

  // ===== FETCH SELECTED CONVERSATION THREAD =====
  const fetchThread = async (id) => {
    try {
      setLoadingThread(true);
      const res = await api.get(`/conversations/${id}`);
      setConversation(res.data);
      setMessages(res.data.messages);
    } catch (err) {
      console.error("Failed to load thread", err);
    } finally {
      setLoadingThread(false);
    }
  };

  useEffect(() => {
    if (businessId) fetchConversations();
  }, [businessId]);

  useEffect(() => {
    if (selectedConvId) fetchThread(selectedConvId);
  }, [selectedConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ===== SEND MESSAGE =====
//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !selectedConvId) return;

//     const content = newMessage;
//     setNewMessage("");
//     setSending(true);

//     // Optimistically show the customer's message right away
//     const tempCustomerMsg = {
//       id: `temp-${Date.now()}`,
//       sender_type: "customer",
//       content,
//       created_at: new Date().toISOString(),
//     };
//     setMessages((prev) => [...prev, tempCustomerMsg]);

//     try {
//       const res = await api.post(`/conversations/${selectedConvId}/messages`, {
//         sender_type: "customer",
//         content,
//       });

//       // Replace temp message with real ones (customer + AI reply if generated)
//       setMessages((prev) => {
//         const withoutTemp = prev.filter((m) => m.id !== tempCustomerMsg.id);
//         const newMsgs = [res.data.customerMessage];
//         if (res.data.aiMessage) newMsgs.push(res.data.aiMessage);
//         return [...withoutTemp, ...newMsgs];
//       });

//       fetchConversations(); // refresh list preview/order
//     } catch (err) {
//       alert(err.response?.data?.error || "Failed to send message");
//       setMessages((prev) => prev.filter((m) => m.id !== tempCustomerMsg.id));
//     } finally {
//       setSending(false);
//     }
//   };
    const handleSend = async (e) => {
    e.preventDefault();

    // Guard: block if already sending, or message is empty/whitespace-only
    if (sending || !newMessage.trim() || !selectedConvId) return;

    const content = newMessage.trim();
    setNewMessage("");
    setSending(true); // disables the input + button immediately

    const tempCustomerMsg = {
        id: `temp-${Date.now()}`,
        sender_type: "customer",
        content,
        created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempCustomerMsg]);

    try {
        const res = await api.post(`/conversations/${selectedConvId}/messages`, {
        sender_type: "customer",
        content,
        });

        setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempCustomerMsg.id);
        const newMsgs = [res.data.customerMessage];
        if (res.data.aiMessage) newMsgs.push(res.data.aiMessage);
        return [...withoutTemp, ...newMsgs];
        });

        fetchConversations();
    } catch (err) {
        alert(err.response?.data?.error || "Failed to send message");
        setMessages((prev) => prev.filter((m) => m.id !== tempCustomerMsg.id));
    } finally {
        setSending(false); // re-enable only after the request fully completes
    }
    };
  // ===== NEW CONVERSATION MODAL =====
  const openNewConvModal = async () => {
    setNewConvError("");
    setNewConvForm({ customer_id: "", newCustomerName: "", newCustomerPhone: "" });
    setShowNewConvModal(true);
    try {
      const res = await api.get(`/businesses/${businessId}/customers`);
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to load customers", err);
    }
  };

  const handleCreateConversation = async (e) => {
    e.preventDefault();
    setNewConvError("");
    setCreatingConv(true);

    try {
      let customerId = newConvForm.customer_id;

      // If no existing customer selected, create a new one
      if (!customerId) {
        if (!newConvForm.newCustomerName.trim()) {
          setNewConvError("Enter a customer name or select an existing customer");
          setCreatingConv(false);
          return;
        }
        const customerRes = await api.post(`/businesses/${businessId}/customers`, {
          name: newConvForm.newCustomerName,
          whatsapp_number: newConvForm.newCustomerPhone,
        });
        customerId = customerRes.data.id;
      }

      const convRes = await api.post(`/businesses/${businessId}/conversations`, {
        customer_id: customerId,
        channel: "whatsapp",
      });

      setShowNewConvModal(false);
      await fetchConversations();
      setSelectedConvId(convRes.data.id);
    } catch (err) {
      setNewConvError(err.response?.data?.error || "Failed to start conversation");
    } finally {
      setCreatingConv(false);
    }
  };

  const toggleAI = async () => {
    if (!conversation) return;
    try {
      const res = await api.put(`/conversations/${conversation.id}`, {
        ai_enabled: !conversation.ai_enabled,
      });
      setConversation((prev) => ({ ...prev, ai_enabled: res.data.ai_enabled }));
    } catch (err) {
      alert("Failed to toggle AI");
    }
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="app">
      <Sidebar />

      <div className="main-wrapper">
        <div className="chat-layout">
          {/* CONVERSATIONS LIST */}
          <div className="conv-list-panel">
            <div className="conv-list-header">
              <h3>Conversations</h3>
              <button className="primary-button small" onClick={openNewConvModal}>
                + New
              </button>
            </div>

            <div className="conv-list">
              {loadingConversations ? (
                <p className="conv-list-empty">Loading...</p>
              ) : conversations.length === 0 ? (
                <p className="conv-list-empty">No conversations yet. Start one!</p>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`conv-list-item ${selectedConvId === conv.id ? "active" : ""}`}
                    onClick={() => setSelectedConvId(conv.id)}
                  >
                    <div className="conv-avatar">
                      {conv.channel === "whatsapp" ? "💬" : "🗨️"}
                    </div>
                    <div className="conv-preview">
                      <p className="conv-preview-name">Conversation #{conv.id}</p>
                      <p className="conv-preview-status">
                        {conv.status} {conv.ai_enabled ? "· 🤖 AI" : "· 👤 Human"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CHAT THREAD */}
          <div className="chat-thread-panel">
            {!selectedConvId ? (
              <div className="chat-empty-state">
                <p>Select a conversation or start a new one</p>
              </div>
            ) : loadingThread ? (
              <div className="chat-empty-state">
                <p>Loading conversation...</p>
              </div>
            ) : (
              <>
                <div className="chat-thread-header">
                  <div>
                    <strong>Conversation #{conversation?.id}</strong>
                    <p className="chat-thread-sub">{conversation?.channel} · {conversation?.status}</p>
                  </div>
                  <button className="ai-toggle-btn" onClick={toggleAI}>
                    {conversation?.ai_enabled ? "🤖 AI Active" : "👤 Human Mode"}
                  </button>
                </div>

                <div className="chat-messages">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-bubble-row ${msg.sender_type === "customer" ? "from-customer" : "from-agent"}`}
                    >
                      <div className={`chat-bubble ${msg.sender_type}`}>
                        <p>{msg.content}</p>
                        <span className="chat-bubble-time">{formatTime(msg.created_at)}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-bar" onSubmit={handleSend}>
                <input
                    type="text"
                    placeholder="Type a customer message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                    autoComplete="off"
                />
                <button type="submit" disabled={sending || !newMessage.trim()}>
                    {sending ? "Sending..." : "Send"}
                </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* NEW CONVERSATION MODAL */}
      {showNewConvModal && (
        <div className="modal-overlay" onClick={() => setShowNewConvModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Start New Conversation</h3>
            <form onSubmit={handleCreateConversation}>
              <div className="form-group">
                <label>Existing Customer</label>
                <select
                  value={newConvForm.customer_id}
                  onChange={(e) => setNewConvForm({ ...newConvForm, customer_id: e.target.value })}
                >
                  <option value="">-- Or create new below --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name || c.whatsapp_number}</option>
                  ))}
                </select>
              </div>

              {!newConvForm.customer_id && (
                <>
                  <div className="form-group">
                    <label>New Customer Name</label>
                    <input
                      type="text"
                      value={newConvForm.newCustomerName}
                      onChange={(e) => setNewConvForm({ ...newConvForm, newCustomerName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>WhatsApp Number</label>
                    <input
                      type="text"
                      value={newConvForm.newCustomerPhone}
                      onChange={(e) => setNewConvForm({ ...newConvForm, newCustomerPhone: e.target.value })}
                    />
                  </div>
                </>
              )}

              {newConvError && <p className="login-error">{newConvError}</p>}

              <div className="modal-actions">
                <button type="button" className="action-button" onClick={() => setShowNewConvModal(false)}>Cancel</button>
                <button type="submit" className="primary-button" disabled={creatingConv}>
                  {creatingConv ? "Starting..." : "Start Conversation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatSimulator;