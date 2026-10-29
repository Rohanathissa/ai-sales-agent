import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './LegalPolicies.css';

export default function LegalPolicies() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL path
  const getTabFromPath = (path) => {
    if (path.includes('terms')) return 'terms';
    if (path.includes('return') || path.includes('refund')) return 'return';
    if (path.includes('contact')) return 'contact';
    return 'privacy';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'privacy') navigate('/privacy');
    else if (tab === 'terms') navigate('/terms');
    else if (tab === 'return') navigate('/return-policy');
    else if (tab === 'contact') navigate('/contact');
  };

  const currentFullUrl = window.location.href;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentFullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="app">
      <Sidebar />

      <div className="main-wrapper">
        <header className="header">
          <div className="search-box">
            <input type="text" placeholder="Search legal compliance, policies & terms..." />
          </div>
          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="legal-print-btn" onClick={() => window.print()}>
              🖨️ Print / Save PDF
            </button>
            <span className="online-status">🟢 Meta Compliant</span>
          </div>
        </header>

        <main className="content">
          <div className="legal-container">
            {/* Meta / Developer Help Banner */}
            <div className="legal-meta-banner">
          <div className="legal-meta-info">
            <span className="legal-meta-badge">Meta Compliance</span>
            <p className="legal-meta-text">
              Publicly verified policies for <strong>Meta WhatsApp Cloud API</strong>, <strong>Meta App Review</strong>, and commerce operations.
            </p>
          </div>
          <button className="legal-copy-url-btn" onClick={handleCopyUrl} title="Copy this URL to paste into Meta Developer Portal">
            {copiedUrl ? '✅ URL Copied!' : '📋 Copy URL for Meta Portal'}
          </button>
        </div>

        {/* Tab Navigation */}
        <nav className="legal-tabs" aria-label="Legal document tabs">
          <button
            className={`legal-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => handleTabChange('privacy')}
          >
            🛡️ Privacy Policy
          </button>
          <button
            className={`legal-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => handleTabChange('terms')}
          >
            📜 Terms of Service
          </button>
          <button
            className={`legal-tab-btn ${activeTab === 'return' ? 'active' : ''}`}
            onClick={() => handleTabChange('return')}
          >
            🔄 Return & Refund Policy
          </button>
          <button
            className={`legal-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => handleTabChange('contact')}
          >
            🏢 Business & Contact
          </button>
        </nav>

        {/* Content Card */}
        <div className="legal-card">
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <article>
              <div className="legal-card-header">
                <span className="legal-card-tag">OFFICIAL POLICY</span>
                <h1 className="legal-card-title">Privacy Policy</h1>
                <p className="legal-card-subtitle">
                  How GemConnect collects, uses, and safeguards customer data across WhatsApp and AI services.
                </p>
                <span className="legal-updated-date">Last Updated: October 2026 • Version 1.2</span>
              </div>

              <div className="legal-si-box">
                <strong>පෞද්ගලිකත්ව ප්‍රතිපත්තිය (සාරාංශය):</strong>
                අපගේ AI පද්ධතිය පාරිභෝගිකයාගේ WhatsApp අංකය සහ පණිවිඩ ලබාගන්නේ භාණ්ඩ මිල ගණන් සහ විමසීම් වලට ක්ෂණික පිළිතුරු ලබාදීමට පමණි. ඔබගේ දත්ත කිසිදු තෙවන පාර්ශවයකට විකුණනු නොලැබේ.
              </div>

              <section className="legal-section">
                <h2 className="legal-section-title">
                  <span className="legal-section-num">1</span> Introduction & Scope
                </h2>
                <p className="legal-p">
                  GemConnect ("we", "our", "us") operates an autonomous AI Sales Agent platform for premium gemstones and jewellery. This Privacy Policy governs the processing of personal data collected through our official WhatsApp Business channels (powered by Meta Cloud API) and web interfaces.
                </p>
                <p className="legal-p">
                  By messaging our official WhatsApp Business account, you agree to the collection and use of information in accordance with this policy.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">
                  <span className="legal-section-num">2</span> Information We Collect
                </h2>
                <p className="legal-p">When interacting with our sales agent, we collect:</p>
                <ul className="legal-ul">
                  <li className="legal-li">
                    <strong>WhatsApp Profile & Contact Identifiers:</strong> Your WhatsApp phone number (E.164 format) and your public WhatsApp display name.
                  </li>
                  <li className="legal-li">
                    <strong>Conversation Transcripts:</strong> Text messages, product inquiries, preferred gemstone categories, budget parameters, and inquiry timestamps.
                  </li>
                  <li className="legal-li">
                    <strong>Order & Reservation Details:</strong> In the event of an order, customer billing name, delivery address, and confirmation notes.
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">
                  <span className="legal-section-num">3</span> AI Processing & Data Protection (Gemini AI)
                </h2>
                <p className="legal-p">
                  Customer queries are analyzed by our automated AI reasoning engine (powered by Google Gemini API) to generate accurate product recommendations and pricing estimates.
                </p>
                <div className="legal-note-box">
                  🔒 <strong>Data Security Commitment:</strong> All communications between Meta Cloud API, our core servers, and Google AI Studio are encrypted in transit via TLS 1.3. We do not use customer personal data to train public foundation models, and we do not sell customer personal records to third-party data brokers.
                </div>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">
                  <span className="legal-section-num">4</span> Data Retention & Customer Rights
                </h2>
                <p className="legal-p">
                  We retain conversation history strictly for order fulfillment, customer relationship management, and accounting audit obligations. 
                </p>
                <ul className="legal-ul">
                  <li className="legal-li">
                    <strong>Right to Access:</strong> You may request a copy of the conversation records associated with your WhatsApp number.
                  </li>
                  <li className="legal-li">
                    <strong>Right to Deletion:</strong> You may request complete erasure of your contact record by sending a message saying "DELETE MY DATA" on WhatsApp or emailing <code>privacy@gemconnect.lk</code>.
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">
                  <span className="legal-section-num">5</span> Contact Privacy Officer
                </h2>
                <p className="legal-p">
                  For privacy inquiries or compliance requests, contact: <strong>privacy@gemconnect.lk</strong> or call <strong>+94 77 123 4567</strong>.
                </p>
              </section>
            </article>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <article>
              <div className="legal-card-header">
                <span className="legal-card-tag">TERMS & CONDITIONS</span>
                <h1 className="legal-card-title">Terms of Service</h1>
                <p className="legal-card-subtitle">
                  Terms governing the use of GemConnect WhatsApp AI sales assistant, quotations, and product inquiries.
                </p>
                <span className="legal-updated-date">Last Updated: October 2026 • Version 1.2</span>
              </div>

              <div className="legal-si-box">
                <strong>සේවා කොන්දේසි (සාරාංශය):</strong>
                AI සහායකයා ලබාදෙන තොරතුරු වෙළඳසැලේ පවතින සැබෑ තොග මත පදනම් වේ. අවසාන මිලදී ගැනීම සහ ගෙවීම් වෙළඳසැලේ නිල කාර්ය මණ්ඩලය විසින් තහවුරු කරනු ලැබේ.
              </div>

              <section className="legal-section">
                <h2 className="legal-section-title">
                  <span className="legal-section-num">1</span> Service Description
                </h2>
                <p className="legal-p">
                  GemConnect provides an automated conversational commerce agent to assist buyers with browsing certified natural gemstones (Sapphires, Rubies, Spinels, Alexandrites) and bespoke fine jewellery.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">
                  <span className="legal-section-num">2</span> Product Accuracy & Certifications
                </h2>
                <p className="legal-p">
                  Every gemstone listed in our catalog features authentic gemological details (origin, carat weight, color, clarity, enhancement status). Physical certificates (e.g., National Gem & Jewellery Authority - NGJA, GIA, or GRS) are provided with all qualified purchases.
                </p>
                <div className="legal-note-box warning">
                  ⚠️ <strong>Quotation Validity:</strong> Prices quoted via WhatsApp conversational assistant reflect real-time live inventory rates. Official orders are bound upon the issuance of an authorized digital invoice by our sales desk.
                </div>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">
                  <span className="legal-section-num">3</span> Acceptable Use
                </h2>
                <p className="legal-p">You agree not to:</p>
                <ul className="legal-ul">
                  <li className="legal-li">Use automated scripts or abuse mechanisms to flood the WhatsApp messaging endpoint.</li>
                  <li className="legal-li">Attempt prompt injection or extract unauthorized administrative data from the AI agent.</li>
                  <li className="legal-li">Engage in fraudulent identity spoofing or fraudulent payment representations.</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">
                  <span className="legal-section-num">4</span> Governing Law
                </h2>
                <p className="legal-p">
                  These terms are governed by the laws of the Democratic Socialist Republic of Sri Lanka. Any disputes arising out of transactions shall be subject to the jurisdiction of the commercial courts in Colombo, Sri Lanka.
                </p>
              </section>
            </article>
          )}

          {/* TAB 3: RETURN & REFUND POLICY */}
          {activeTab === 'return' && (
            <article>
              <div className="legal-card-header">
                <span className="legal-card-tag">COMMERCE & SATISFACTION</span>
                <h1 className="legal-card-title">Return & Refund Policy</h1>
                <p className="legal-card-subtitle">
                  Our transparent 14-day inspection and return guarantee for loose gemstones and jewellery pieces.
                </p>
                <span className="legal-updated-date">Last Updated: October 2026 • Version 1.2</span>
              </div>

              <div className="legal-si-box">
                <strong>භාණ්ඩ ආපසු භාරගැනීම සහ මුදල් ගෙවීම (සාරාංශය):</strong>
                මිලදී ගත් මැණික් ගල් සහ ස්වර්ණාභරණ සඳහා දින 14 ක පරීක්ෂණ සහතික කාලයක් හිමිවේ. කිසිදු හානියක් සිදුනොවී, ආරක්ෂිත Tag එක සහ මුල් සහතිකය (Certificate) සහිතව භාරදීමෙන් පසු සම්පූර්ණ මුදල ආපසු ලබාගත හැක.
              </div>

              <section className="legal-section">
                <h2 className="legal-section-title">
                  <span className="legal-section-num">1</span> 14-Day Examination Guarantee
                </h2>
                <p className="legal-p">
                  We understand that acquiring precious gemstones requires confidence. We offer a <strong>14-day inspection window</strong> from the verified date of delivery for all standard catalog items.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">
                  <span className="legal-section-num">2</span> Return Eligibility Conditions
                </h2>
                <p className="legal-p">To be eligible for a full refund or exchange:</p>
                <ul className="legal-ul">
                  <li className="legal-li">
                    <strong>Pristine Condition:</strong> The item must be unused, unmounted (for loose stones), free from scratches or chips, and in its original luxury presentation box.
                  </li>
                  <li className="legal-li">
                    <strong>Tamper-Evident Security Seal:</strong> The security seal/tag attached to the stone or jewellery must remain intact and untampered.
                  </li>
                  <li className="legal-li">
                    <strong>Original Gemological Certificate:</strong> The original laboratory certificate (NGJA / GIA / GRS) and sales invoice must be returned together with the item.
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">
                  <span className="legal-section-num">3</span> Non-Returnable & Custom Orders
                </h2>
                <p className="legal-p">
                  Custom-crafted jewellery items (e.g. customized ring sizing, personalized laser engravings, or bespoke metalwork crafted strictly per individual client request) are non-refundable once production has been formally approved and initiated.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">
                  <span className="legal-section-num">4</span> Refund Process & Timeline
                </h2>
                <p className="legal-p">
                  Upon receipt of the returned item:
                </p>
                <ul className="legal-ul">
                  <li className="legal-li">
                    <strong>Gemological Inspection:</strong> Our certified gemologists inspect the stone against the original laboratory certificate within <strong>2 business days</strong>.
                  </li>
                  <li className="legal-li">
                    <strong>Payment Reversal:</strong> Upon approval, the refund is processed back to the original method of payment (bank transfer or credit card) within <strong>5 to 7 business days</strong>.
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">
                  <span className="legal-section-num">5</span> How to Initiate a Return
                </h2>
                <p className="legal-p">
                  Simply reply to our official WhatsApp chat with your order number and the word "RETURN", or contact our customer support desk at <code>support@gemconnect.lk</code> with your invoice attached.
                </p>
              </section>
            </article>
          )}

          {/* TAB 4: CONTACT & BUSINESS */}
          {activeTab === 'contact' && (
            <article>
              <div className="legal-card-header">
                <span className="legal-card-tag">BUSINESS VERIFICATION</span>
                <h1 className="legal-card-title">Corporate & Contact Information</h1>
                <p className="legal-card-subtitle">
                  Official contact details for customer service, compliance audits, and Meta business verification.
                </p>
                <span className="legal-updated-date">Registered Enterprise • Sri Lanka</span>
              </div>

              <div className="legal-contact-grid">
                <div className="legal-contact-card">
                  <div className="legal-contact-label">🏢 Legal Entity</div>
                  <p className="legal-contact-val">GemConnect (Pvt) Ltd</p>
                </div>
                <div className="legal-contact-card">
                  <div className="legal-contact-label">💬 WhatsApp Hotline</div>
                  <p className="legal-contact-val">+94 77 123 4567</p>
                </div>
                <div className="legal-contact-card">
                  <div className="legal-contact-label">✉️ Support Email</div>
                  <p className="legal-contact-val">support@gemconnect.lk</p>
                </div>
                <div className="legal-contact-card">
                  <div className="legal-contact-label">🛡️ Compliance & Privacy</div>
                  <p className="legal-contact-val">privacy@gemconnect.lk</p>
                </div>
                <div className="legal-contact-card">
                  <div className="legal-contact-label">📍 Registered Office</div>
                  <p className="legal-contact-val">World Trade Center, West Tower, Colombo 01, Sri Lanka</p>
                </div>
                <div className="legal-contact-card">
                  <div className="legal-contact-label">🏛️ Gemological Licensing</div>
                  <p className="legal-contact-val">National Gem & Jewellery Authority (NGJA) Licensed Dealer</p>
                </div>
              </div>
            </article>
          )}

          {/* Footer Bar */}
          <footer className="legal-card-footer">
            <div>
              © 2026 GemConnect (Pvt) Ltd. All Rights Reserved. Powered by Meta Cloud API & Gemini AI.
            </div>
            <div>
              Platform Security: TLS 1.3 Encryption • PCI-DSS Compliant Partners
            </div>
          </footer>
        </div>
      </div>
    </main>
  </div>
</div>
  );
}
