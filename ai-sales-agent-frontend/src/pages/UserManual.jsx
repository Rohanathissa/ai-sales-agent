import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './UserManual.css';

function UserManual() {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedKey, setCopiedKey] = useState('');

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2500);
  };

  const tabs = [
    { id: 'overview', label: '⚡ Architecture & Overview' },
    { id: 'step1', label: '🛠️ 1. Backend & DB' },
    { id: 'step2', label: '☁️ 2. Cloudflare Tunnel' },
    { id: 'step3', label: '📱 3. Meta WhatsApp API' },
    { id: 'step4', label: '🔗 4. Webhook & WABA Link' },
    { id: 'step5', label: '🤖 5. Google Gemini AI' },
    { id: 'troubleshoot', label: '❓ 6. Troubleshooting' },
  ];

  return (
    <div className="app">
      <Sidebar />

      <div className="main-wrapper">
        <header className="header">
          <div className="search-box">
            <input type="text" placeholder="Search documentation & setup steps..." />
          </div>
          <div className="header-right">
            <span className="online-status">🟢 System Operational</span>
          </div>
        </header>

        <main className="content">
          <div className="manual-container">
            {/* HERO BANNER */}
            <div className="manual-hero">
              <h1 className="manual-hero-title">
                📖 AI Sales Agent — Setup Guide & User Manual
              </h1>
              <p className="manual-hero-subtitle">
                Comprehensive step-by-step documentation for deploying, configuring, and operating the WhatsApp AI Sales Agent platform with Meta Cloud API, Cloudflare Tunnel, and Google Gemini AI.
                (මෙම AI Sales Agent පද්ධතිය ස්ථාපනය සහ WhatsApp සමග සම්බන්ධ කිරීමේ සම්පූර්ණ අත්පොත).
              </p>
              <div className="manual-quick-badges">
                <span className="quick-badge">🚀 Gemini 3.6 Flash</span>
                <span className="quick-badge">💬 Meta WhatsApp Cloud API</span>
                <span className="quick-badge">🔒 Cloudflare HTTPS Tunnel</span>
                <span className="quick-badge">🐘 PostgreSQL Database</span>
                <span className="quick-badge">🇱🇰 Sinhala & English Multi-lingual</span>
              </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="steps-nav-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`step-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="step-content-card">
                <div className="step-card-header">
                  <div className="step-number-title">
                    <div className="step-badge">⚡</div>
                    <div>
                      <h2 className="step-heading">How the AI Sales Agent Works</h2>
                      <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                        End-to-End Autonomous Messaging Lifecycle
                      </p>
                    </div>
                  </div>
                  <span className="step-category-tag">System Architecture</span>
                </div>

                <div className="arch-flow-card" style={{ marginBottom: '24px' }}>
                  <h3 className="arch-flow-title">🔄 Complete Live Data Flow</h3>
                  <div className="flow-steps">
                    <div className="flow-step-item">
                      <div className="flow-icon">📱</div>
                      <div className="flow-label">1. Customer WhatsApp</div>
                      <div className="flow-sub">Customer asks question on their phone</div>
                    </div>
                    <div className="flow-arrow">➔</div>
                    <div className="flow-step-item">
                      <div className="flow-icon">🏢</div>
                      <div className="flow-label">2. Meta Cloud API</div>
                      <div className="flow-sub">Meta receives & fires Webhook payload</div>
                    </div>
                    <div className="flow-arrow">➔</div>
                    <div className="flow-step-item">
                      <div className="flow-icon">☁️</div>
                      <div className="flow-label">3. Cloudflare Tunnel</div>
                      <div className="flow-sub">Secure HTTPS proxy to local machine</div>
                    </div>
                    <div className="flow-arrow">➔</div>
                    <div className="flow-step-item">
                      <div className="flow-icon">⚙️</div>
                      <div className="flow-label">4. AI Backend & DB</div>
                      <div className="flow-sub">Saves to DB, syncs to Chat Simulator</div>
                    </div>
                    <div className="flow-arrow">➔</div>
                    <div className="flow-step-item">
                      <div className="flow-icon">🧠</div>
                      <div className="flow-label">5. Gemini Flash AI</div>
                      <div className="flow-sub">Reads catalog & drafts custom reply</div>
                    </div>
                    <div className="flow-arrow">➔</div>
                    <div className="flow-step-item">
                      <div className="flow-icon">💬</div>
                      <div className="flow-label">6. Outbound Reply</div>
                      <div className="flow-sub">Auto-sent back to customer's WhatsApp</div>
                    </div>
                  </div>
                </div>

                <div className="manual-callout tip">
                  <div className="manual-callout-icon">💡</div>
                  <div>
                    <strong>Core Value Proposition:</strong> Customers can talk in English, Sinhala (සිංහල), or Singlish (e.g. <em>"Oyalage Nil Manik thiyenawada?"</em>). The AI checks your real product catalog with stock status, carats, and prices, and responds naturally like an expert sales executive.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STEP 1 - BACKEND & DB */}
            {activeTab === 'step1' && (
              <div className="step-content-card">
                <div className="step-card-header">
                  <div className="step-number-title">
                    <div className="step-badge">1</div>
                    <div>
                      <h2 className="step-heading">Backend & Database Installation</h2>
                      <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                        PostgreSQL Database Setup & Environment Variables
                      </p>
                    </div>
                  </div>
                  <span className="step-category-tag">Prerequisites</span>
                </div>

                <div className="step-instruction-block">
                  <h3 className="step-instruction-title">1.1 Create the PostgreSQL Database</h3>
                  <p className="step-instruction-desc">
                    Make sure PostgreSQL is running on your machine (Default port 5432). Create a new database named <code>ai_sales_agent</code> and run the seed script:
                  </p>
                  <div className="code-block-container">
                    <div className="code-header">
                      <span>powershell — database setup</span>
                      <button
                        className={`code-copy-btn ${copiedKey === 'db-seed' ? 'copied' : ''}`}
                        onClick={() => copyToClipboard('psql -U postgres -d ai_sales_agent -f db/seed.sql', 'db-seed')}
                      >
                        {copiedKey === 'db-seed' ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="code-pre">psql -U postgres -d ai_sales_agent -f db/seed.sql</pre>
                  </div>
                </div>

                <div className="step-instruction-block">
                  <h3 className="step-instruction-title">1.2 Configure the Backend .env File</h3>
                  <p className="step-instruction-desc">
                    In <code>ai-sales-agent-backend/.env</code>, configure your database credentials, Gemini API key, and Meta credentials:
                  </p>
                  <div className="code-block-container">
                    <div className="code-header">
                      <span>ai-sales-agent-backend/.env</span>
                      <button
                        className={`code-copy-btn ${copiedKey === 'env' ? 'copied' : ''}`}
                        onClick={() =>
                          copyToClipboard(
`PORT=3000
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=root
PGDATABASE=ai_sales_agent

JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash

WHATSAPP_PHONE_NUMBER_ID=your_meta_phone_number_id
WHATSAPP_VERIFY_TOKEN=my_secret_webhook_token_123
WHATSAPP_TOKEN=your_meta_access_token`,
                            'env'
                          )
                        }
                      >
                        {copiedKey === 'env' ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="code-pre">{`PORT=3000
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=root
PGDATABASE=ai_sales_agent

JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash

WHATSAPP_PHONE_NUMBER_ID=your_meta_phone_number_id
WHATSAPP_VERIFY_TOKEN=my_secret_webhook_token_123
WHATSAPP_TOKEN=your_meta_access_token`}</pre>
                  </div>
                </div>

                <div className="step-instruction-block">
                  <h3 className="step-instruction-title">1.3 Start Backend & Frontend</h3>
                  <div className="code-block-container">
                    <div className="code-header">
                      <span>Terminal (Backend)</span>
                      <button
                        className={`code-copy-btn ${copiedKey === 'npm-be' ? 'copied' : ''}`}
                        onClick={() => copyToClipboard('cd ai-sales-agent-backend && npm run dev', 'npm-be')}
                      >
                        {copiedKey === 'npm-be' ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="code-pre">cd ai-sales-agent-backend && npm run dev</pre>
                  </div>
                  <div className="code-block-container">
                    <div className="code-header">
                      <span>Terminal (Frontend)</span>
                      <button
                        className={`code-copy-btn ${copiedKey === 'npm-fe' ? 'copied' : ''}`}
                        onClick={() => copyToClipboard('cd ai-sales-agent-frontend && npm run dev', 'npm-fe')}
                      >
                        {copiedKey === 'npm-fe' ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="code-pre">cd ai-sales-agent-frontend && npm run dev</pre>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: STEP 2 - CLOUDFLARE TUNNEL */}
            {activeTab === 'step2' && (
              <div className="step-content-card">
                <div className="step-card-header">
                  <div className="step-number-title">
                    <div className="step-badge">2</div>
                    <div>
                      <h2 className="step-heading">Exposing Localhost via Cloudflare Tunnel</h2>
                      <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                        Free, Secure HTTPS Public Tunnel for Meta Webhooks
                      </p>
                    </div>
                  </div>
                  <span className="step-category-tag">Public Networking</span>
                </div>

                <div className="step-instruction-block">
                  <h3 className="step-instruction-title">Why Cloudflare Tunnel? (ඇයි Cloudflare Tunnel එකක් අවශ්‍ය?)</h3>
                  <p className="step-instruction-desc">
                    Meta's servers require a publicly accessible <strong>HTTPS URL</strong> to send incoming WhatsApp customer messages. Because our Node.js backend runs locally on <code>http://localhost:3000</code>, Cloudflare Tunnel securely forwards traffic from the internet straight into our computer without requiring port forwarding or a public static IP.
                  </p>
                </div>

                <div className="step-instruction-block">
                  <h3 className="step-instruction-title">2.1 Run the Cloudflare Quick Tunnel Command</h3>
                  <p className="step-instruction-desc">
                    Open a new terminal window in your project root and execute:
                  </p>
                  <div className="code-block-container">
                    <div className="code-header">
                      <span>powershell — start tunnel</span>
                      <button
                        className={`code-copy-btn ${copiedKey === 'cf-cmd' ? 'copied' : ''}`}
                        onClick={() => copyToClipboard('npx cloudflared tunnel --url http://localhost:3000', 'cf-cmd')}
                      >
                        {copiedKey === 'cf-cmd' ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="code-pre">npx cloudflared tunnel --url http://localhost:3000</pre>
                  </div>
                </div>

                <div className="manual-callout success">
                  <div className="manual-callout-icon">🎉</div>
                  <div>
                    <strong>Look for the Generated URL in Terminal:</strong>
                    <br />
                    Cloudflare will output a box containing your unique public URL, for example:
                    <br />
                    <code style={{ background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                      https://xxxx-xxxx-xxxx.trycloudflare.com
                    </code>
                    <br />
                    Copy this URL! You will use it in Step 4 for the Meta Webhook Callback URL.
                  </div>
                </div>

                <div className="manual-callout warning">
                  <div className="manual-callout-icon">⚠️</div>
                  <div>
                    <strong>Important Note:</strong> Keep this terminal running in the background. If you close this terminal, the tunnel closes and Meta won't be able to reach your machine.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: STEP 3 - META WHATSAPP API */}
            {activeTab === 'step3' && (
              <div className="step-content-card">
                <div className="step-card-header">
                  <div className="step-number-title">
                    <div className="step-badge">3</div>
                    <div>
                      <h2 className="step-heading">Meta WhatsApp Cloud API Configuration</h2>
                      <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                        Developer App Setup, Phone Number IDs & Access Tokens
                      </p>
                    </div>
                  </div>
                  <span className="step-category-tag">Meta Cloud API</span>
                </div>

                <div className="step-instruction-block">
                  <h3 className="step-instruction-title">3.1 Create a Meta Developer App</h3>
                  <p className="step-instruction-desc">
                    1. Go to <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>developers.facebook.com</a> and sign in with Facebook.
                    <br />
                    2. Click <strong>My Apps</strong> &gt; <strong>Create App</strong>.
                    <br />
                    3. Select <strong>Other</strong> as Use Case &gt; Select <strong>Business</strong> as App Type.
                    <br />
                    4. Give your app a name (e.g. <code>raw-ai-sales-agent</code>) and click Create.
                    <br />
                    5. In the App Dashboard, scroll down and find <strong>WhatsApp</strong> &gt; Click <strong>Set up</strong>.
                  </p>
                </div>

                <div className="step-instruction-block">
                  <h3 className="step-instruction-title">3.2 Find Phone Number ID and WABA ID</h3>
                  <p className="step-instruction-desc">
                    Go to <strong>WhatsApp &gt; API Setup</strong> (or <strong>Step 1: Try it out</strong>):
                    <br />
                    • <strong>Test Phone Number:</strong> Typically <code>+1 555 670 0541</code>
                    <br />
                    • <strong>Phone Number ID:</strong> Copy the numeric ID (e.g. <code>1192511870621578</code>) and paste it into <code>WHATSAPP_PHONE_NUMBER_ID</code> in <code>.env</code>.
                    <br />
                    • <strong>WhatsApp Business Account ID (WABA ID):</strong> Note down this ID (e.g. <code>1011673878532817</code>).
                  </p>
                </div>

                <div className="step-instruction-block">
                  <h3 className="step-instruction-title">3.3 Generate Access Token</h3>
                  <p className="step-instruction-desc">
                    Under <strong>Access token</strong> in Step 1, click <strong>Generate token</strong>. Copy this string and paste it into <code>WHATSAPP_TOKEN</code> in your backend <code>.env</code>.
                  </p>
                </div>

                <div className="manual-callout tip">
                  <div className="manual-callout-icon">💡</div>
                  <div>
                    <strong>Add Your Phone as a Recipient (Test Mode):</strong>
                    <br />
                    In Step 1 &gt; <em>"To" Recipient phone number</em> dropdown, click <strong>Manage phone number list</strong>, add your Sri Lankan phone number (e.g. <code>+94 71 975 9280</code>), and verify with the SMS OTP code.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: STEP 4 - WEBHOOK & WABA LINK */}
            {activeTab === 'step4' && (
              <div className="step-content-card">
                <div className="step-card-header">
                  <div className="step-number-title">
                    <div className="step-badge">4</div>
                    <div>
                      <h2 className="step-heading">Webhook & WABA Subscription Linking</h2>
                      <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                        Connecting Meta Webhooks to your Cloudflare URL
                      </p>
                    </div>
                  </div>
                  <span className="step-category-tag">Crucial Linking Step</span>
                </div>

                <div className="step-instruction-block">
                  <h3 className="step-instruction-title">4.1 Configure Meta Webhook URL</h3>
                  <p className="step-instruction-desc">
                    In Meta Developer Portal, navigate to <strong>WhatsApp &gt; Configuration</strong> (or <strong>Step 2: Production setup &gt; Configure Webhooks</strong>):
                  </p>
                  <p className="step-instruction-desc">
                    • <strong>Callback URL:</strong> <code>https://&lt;YOUR-CLOUDFLARE-TUNNEL&gt;/api/whatsapp/webhook</code>
                    <br />
                    • <strong>Verify Token:</strong> <code>my_secret_webhook_token_123</code>
                  </p>
                  <p className="step-instruction-desc">
                    Click <strong>Verify and Save</strong>. Meta will send a GET challenge which your backend automatically approves with <code>200 OK</code>!
                  </p>
                </div>

                <div className="step-instruction-block">
                  <h3 className="step-instruction-title">4.2 Subscribe to the 'messages' Webhook Field</h3>
                  <p className="step-instruction-desc">
                    In the Webhook Fields table below the URL, locate <strong>messages</strong> and toggle it to <strong>Subscribed (Active)</strong>.
                  </p>
                </div>

                <div className="step-instruction-block">
                  <h3 className="step-instruction-title">4.3 Publish the App & Set Privacy Policy URL</h3>
                  <p className="step-instruction-desc">
                    Meta does not deliver real customer messages to unpublished apps!
                    <br />
                    1. Go to <strong>App settings &gt; Basic</strong>.
                    <br />
                    2. In <strong>Privacy Policy URL</strong>, enter: <code>https://&lt;YOUR-CLOUDFLARE-TUNNEL&gt;/privacy</code> (our backend serves a live HTML page here).
                    <br />
                    3. Click <strong>Save changes</strong>.
                    <br />
                    4. In the left sidebar, click <strong>Publish</strong> and click the blue <strong>Publish</strong> button so the badge turns to <strong>[Published]</strong>.
                  </p>
                </div>

                <div className="step-instruction-block">
                  <h3 className="step-instruction-title">4.4 Link the App to your WABA Account (The Secret Key!)</h3>
                  <p className="step-instruction-desc">
                    Even when published, Meta requires the app to be subscribed to your WhatsApp Business Account. Run this command once in your terminal:
                  </p>
                  <div className="code-block-container">
                    <div className="code-header">
                      <span>powershell / curl — link WABA</span>
                      <button
                        className={`code-copy-btn ${copiedKey === 'waba-curl' ? 'copied' : ''}`}
                        onClick={() =>
                          copyToClipboard(
                            'curl.exe -X POST "https://graph.facebook.com/v20.0/1011673878532817/subscribed_apps" -H "Authorization: Bearer YOUR_ACCESS_TOKEN"',
                            'waba-curl'
                          )
                        }
                      >
                        {copiedKey === 'waba-curl' ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="code-pre">curl.exe -X POST "https://graph.facebook.com/v20.0/&lt;WABA_ID&gt;/subscribed_apps" -H "Authorization: Bearer &lt;YOUR_TOKEN&gt;"</pre>
                  </div>
                  <p className="step-instruction-desc" style={{ color: '#16a34a', fontWeight: 'bold' }}>
                    Output: <code>{`{"success":true}`}</code> — Once this is done, real messages will flow into your AI Agent!
                  </p>
                </div>
              </div>
            )}

            {/* TAB 6: STEP 5 - GEMINI AI */}
            {activeTab === 'step5' && (
              <div className="step-content-card">
                <div className="step-card-header">
                  <div className="step-number-title">
                    <div className="step-badge">5</div>
                    <div>
                      <h2 className="step-heading">Google Gemini AI Engine & Multi-Lingual Intelligence</h2>
                      <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                        Catalog Context Injection & Sinhala/English Translation
                      </p>
                    </div>
                  </div>
                  <span className="step-category-tag">Artificial Intelligence</span>
                </div>

                <div className="step-instruction-block">
                  <h3 className="step-instruction-title">5.1 Get Google Gemini API Key</h3>
                  <p className="step-instruction-desc">
                    1. Visit <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>aistudio.google.com</a> and sign in with Google.
                    <br />
                    2. Click <strong>Get API Key</strong> &gt; <strong>Create API Key in new project</strong>.
                    <br />
                    3. Copy the key and set it as <code>GEMINI_API_KEY</code> in <code>.env</code>.
                  </p>
                </div>

                <div className="step-instruction-block">
                  <h3 className="step-instruction-title">5.2 Recommended Gemini Models</h3>
                  <p className="step-instruction-desc">
                    Set <code>GEMINI_MODEL=gemini-3.6-flash</code> in your <code>.env</code> file. Our backend automatically implements automatic fallbacks to <code>gemini-3.7-flash</code> and <code>gemini-flash-latest</code> if rate limits are approached.
                  </p>
                </div>

                <div className="manual-callout success">
                  <div className="manual-callout-icon">🌐</div>
                  <div>
                    <strong>Native Sinhala & Singlish Understanding:</strong>
                    <br />
                    Gemini 3.6 Flash understands colloquial Sinhala and Singlish fluently:
                    <br />
                    • Question: <em>"ඔයාල ළඟ නිල් මැණික් තියෙනවද? මිල ගණන් කොහොමද?"</em>
                    <br />
                    • AI Response: <em>"ඔව්, අප ළඟ ස්වභාවික Royal Blue Ceylon Sapphire (USD 3,500.00) සහ Diamond & Sapphire Ring එකක් තිබෙනවා..."</em>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: TROUBLESHOOTING */}
            {activeTab === 'troubleshoot' && (
              <div className="step-content-card">
                <div className="step-card-header">
                  <div className="step-number-title">
                    <div className="step-badge">❓</div>
                    <div>
                      <h2 className="step-heading">Troubleshooting & Common Pitfalls</h2>
                      <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                        Quick Solutions for Common Errors
                      </p>
                    </div>
                  </div>
                  <span className="step-category-tag">Diagnosis & Fixes</span>
                </div>

                <div className="faq-grid">
                  <div className="faq-card">
                    <h4 className="faq-question">🔴 1. WhatsApp messages not reaching Chat Simulator?</h4>
                    <p className="faq-answer">
                      • <strong>Check Cloudflare Tunnel:</strong> Is <code>npx cloudflared tunnel</code> still running? If restarted, copy the new tunnel URL into Meta Webhook configuration.
                      <br />
                      • <strong>Check App Mode:</strong> Is your app <strong>Published</strong>? If it says "Unpublished", Meta blocks delivery from user phones.
                      <br />
                      • <strong>Check WABA Subscription:</strong> Did you run the <code>POST /subscribed_apps</code> command?
                    </p>
                  </div>

                  <div className="faq-card">
                    <h4 className="faq-question">🔑 2. Error validating access token: Session has expired (Code 190)</h4>
                    <p className="faq-answer">
                      Meta temporary tokens expire after 24 hours. Go to <strong>Step 1. Try it out</strong> in Meta Developer Portal, click <strong>Generate token</strong>, and paste the fresh token into <code>WHATSAPP_TOKEN</code> in your <code>.env</code> file.
                    </p>
                  </div>

                  <div className="faq-card">
                    <h4 className="faq-question">⚡ 3. 429 Too Many Requests on Gemini AI?</h4>
                    <p className="faq-answer">
                      If <code>gemini-3.5-flash</code> reaches the 20 request/day free tier limit, switch your <code>GEMINI_MODEL</code> in <code>.env</code> to <code>gemini-3.6-flash</code> or <code>gemini-3.7-flash</code> which have independent quota buckets.
                    </p>
                  </div>

                  <div className="faq-card">
                    <h4 className="faq-question">🌐 4. Outbound message timeouts on Windows (IPv6)?</h4>
                    <p className="faq-answer">
                      Windows Node.js <code>fetch</code> sometimes hangs on IPv6 DNS lookups to <code>graph.facebook.com</code>. In <code>whatsappService.js</code>, we use native Node <code>https.request</code> with <code>family: 4</code> to force fast IPv4 resolution.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default UserManual;
