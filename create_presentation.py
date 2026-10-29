import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 Widescreen slides (13.333 x 7.5 inches)
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    COLOR_BG_DARK = RGBColor(15, 23, 42)       # Slate 900
    COLOR_CARD_DARK = RGBColor(30, 41, 59)     # Slate 800
    COLOR_BLUE = RGBColor(37, 99, 235)         # Blue 600
    COLOR_CYAN = RGBColor(56, 189, 248)        # Cyan 400
    COLOR_EMERALD = RGBColor(16, 185, 129)     # Emerald 500
    COLOR_WHITE = RGBColor(255, 255, 255)
    COLOR_TEXT_MUTED = RGBColor(148, 163, 184) # Slate 400
    COLOR_BORDER = RGBColor(51, 65, 85)        # Slate 700

    def add_header(slide, title_text, category_text="AI SALES AGENT PLATFORM"):
        # Category tag
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_CYAN

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_WHITE

    def add_card(slide, left, top, width, height, title, body_bullets, accent_color=COLOR_BLUE):
        # Shape background
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = COLOR_CARD_DARK
        shape.line.color.rgb = COLOR_BORDER
        shape.line.width = Pt(1)

        # Header accent stripe
        stripe = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left + Inches(0.2), top + Inches(0.2), width - Inches(0.4), Pt(3))
        stripe.fill.solid()
        stripe.fill.fore_color.rgb = accent_color
        stripe.line.fill.background()

        # Text box
        tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.3), width - Inches(0.4), height - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        
        # Title
        p_head = tf.paragraphs[0]
        p_head.text = title
        p_head.font.size = Pt(16)
        p_head.font.bold = True
        p_head.font.color.rgb = COLOR_WHITE
        p_head.space_after = Pt(10)

        # Bullets
        for b in body_bullets:
            p = tf.add_paragraph()
            p.text = "• " + b
            p.font.size = Pt(12)
            p.font.color.rgb = COLOR_TEXT_MUTED
            p.space_after = Pt(6)

    # =========================================================================
    # SLIDE 1: TITLE SLIDE
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = COLOR_BG_DARK
    bg1.line.fill.background()

    # Title Box
    t1_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(11.0), Inches(2.2))
    tf1 = t1_box.text_frame
    tf1.word_wrap = True
    
    p_badge = tf1.paragraphs[0]
    p_badge.text = "NEXT-GENERATION E-COMMERCE"
    p_badge.font.size = Pt(14)
    p_badge.font.bold = True
    p_badge.font.color.rgb = COLOR_CYAN
    p_badge.space_after = Pt(12)

    p_main = tf1.add_paragraph()
    p_main.text = "AI Sales Agent Platform"
    p_main.font.size = Pt(44)
    p_main.font.bold = True
    p_main.font.color.rgb = COLOR_WHITE
    p_main.space_after = Pt(10)

    p_sub = tf1.add_paragraph()
    p_sub.text = "Autonomous Conversational Sales Engine for Gem & Jewellery Businesses"
    p_sub.font.size = Pt(20)
    p_sub.font.color.rgb = COLOR_TEXT_MUTED

    # Bottom Highlights
    h_box = s1.shapes.add_textbox(Inches(1.2), Inches(4.8), Inches(11.0), Inches(1.2))
    tf_h = h_box.text_frame
    tf_h.word_wrap = True
    p_h = tf_h.paragraphs[0]
    p_h.text = "⚡ Google Gemini 3.6 Flash   |   💬 Meta WhatsApp Cloud API   |   🇱🇰 Sinhala, Singlish & English   |   🔒 Cloudflare Secure Tunnel"
    p_h.font.size = Pt(13)
    p_h.font.bold = True
    p_h.font.color.rgb = COLOR_EMERALD

    # =========================================================================
    # SLIDE 2: BUSINESS CHALLENGE & THE SOLUTION
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    bg2 = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg2.fill.solid()
    bg2.fill.fore_color.rgb = COLOR_BG_DARK
    bg2.line.fill.background()
    add_header(s2, "Business Opportunity & The AI Advantage", "PROBLEM VS SOLUTION")

    add_card(
        s2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "⚠️ The Traditional Bottleneck",
        [
            "High Inquiry Volume: Customers text 24/7 on WhatsApp asking for stock, carats, cut, and pricing.",
            "Delayed Responses: Slow response times lead to high bounce rates and lost sales to competitors.",
            "Language Barrier: Customers ask in Sinhala ('ඔයාල ළඟ නිල් මැණික් තියෙනවද?') or Singlish.",
            "Staff Fatigue: Human sales reps spend 80% of time answering repetitive price and inventory questions."
        ],
        RGBColor(239, 68, 68)
    )

    add_card(
        s2, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "🚀 The AI Sales Agent Solution",
        [
            "Instant 24/7 Responses: Sub-second reply latency on WhatsApp with zero human delay.",
            "Fluent Multi-lingual Intelligence: Seamless comprehension of Sinhala, Singlish, and English.",
            "Catalog-Grounded Accuracy: Strictly recommends real inventory (Blue Sapphires, Padparadscha, Emeralds, Rubies).",
            "Full Team Oversight: Live Chat Simulator and Product Management dashboard for human managers."
        ],
        COLOR_EMERALD
    )

    # =========================================================================
    # SLIDE 3: SYSTEM ARCHITECTURE
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    bg3 = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg3.fill.solid()
    bg3.fill.fore_color.rgb = COLOR_BG_DARK
    bg3.line.fill.background()
    add_header(s3, "Full-Stack Technology Architecture", "ENGINEERING DESIGN")

    cards_s3 = [
        ("📱 Frontend Client", ["React 18 + Vite SPA", "BizAdmin Dark Modern UI", "Real-Time Chat Simulator", "Interactive User Manual"], COLOR_BLUE),
        ("⚙️ Express API Backend", ["Node.js REST Services", "Meta Webhook Inbound Route", "Auto-Token & Session Refresh", "IPv4 Outbound Dispatcher"], COLOR_CYAN),
        ("🧠 Gemini 3.6 Flash AI", ["Google Generative AI SDK", "Catalog Context Injection", "Multi-turn History Memory", "Automated Fallback Cascade"], COLOR_EMERALD),
        ("🐘 PostgreSQL Storage", ["Products & Inventory Table", "Customer WhatsApp Profiles", "Conversations & Message Logs", "Business Rules & Settings"], RGBColor(168, 85, 247))
    ]

    for idx, (c_title, c_bullets, c_col) in enumerate(cards_s3):
        col_left = Inches(0.8 + idx * 2.95)
        add_card(s3, col_left, Inches(1.8), Inches(2.75), Inches(5.0), c_title, c_bullets, c_col)

    # =========================================================================
    # SLIDE 4: END-TO-END WORKFLOW
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    bg4 = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg4.fill.solid()
    bg4.fill.fore_color.rgb = COLOR_BG_DARK
    bg4.line.fill.background()
    add_header(s4, "End-to-End Real-Time Message Flow", "DATA PIPELINE")

    flow_items = [
        ("1. Inbound WhatsApp", "Customer types inquiry on phone ('Do you have Padparadscha?')"),
        ("2. Meta Cloud API", "Meta verifies and forwards webhook payload to Cloudflare"),
        ("3. Cloudflare Tunnel", "Secure HTTPS tunnel proxies payload to http://localhost:3000"),
        ("4. Express Backend", "Normalizes phone, saves message in DB & syncs Chat Simulator"),
        ("5. Gemini 3.6 Flash", "Injects live catalog and generates domain-specific sales response"),
        ("6. Outbound Dispatch", "Node HTTPS sends message back to customer's WhatsApp in < 2 sec")
    ]

    for idx, (f_title, f_desc) in enumerate(flow_items):
        row = idx // 3
        col = idx % 3
        c_left = Inches(0.8 + col * 3.95)
        c_top = Inches(1.8 + row * 2.5)
        add_card(s4, c_left, c_top, Inches(3.75), Inches(2.2), f_title, [f_desc], COLOR_CYAN)

    # =========================================================================
    # SLIDE 5: LIVE SHOWCASE & CHAT DEMO
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    bg5 = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg5.fill.solid()
    bg5.fill.fore_color.rgb = COLOR_BG_DARK
    bg5.line.fill.background()
    add_header(s5, "Real-World Sales Conversation Examples", "CONVERSATIONAL CAPABILITIES")

    add_card(
        s5, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "💬 English Inquiry (Padparadscha)",
        [
            "Customer: 'Do you have Padparadscha sapphires?'",
            "AI Agent Reply:",
            "  'Yes, we absolutely do! We have a rare loose Natural Padparadscha Sapphire from Sri Lanka for USD 5,200.00, featuring a gorgeous blend of pink and orange tones.'",
            "  'We also offer an elegant Padparadscha Rose Gold Pendant set in a diamond halo for USD 3,800.00. Which one of these would you like to explore further?'"
        ],
        COLOR_BLUE
    )

    add_card(
        s5, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "🇱🇰 Sinhala Inquiry (නිල් මැණික්)",
        [
            "Customer: 'ඔයාල ළඟ නිල් මැණික් තියෙනවද? මිල ගණන් කොහොමද?'",
            "AI Agent Reply:",
            "  'ඔව්, අප ළඟ ස්වභාවික Royal Blue Ceylon Sapphire (USD 3,500.00) සහ Diamond & Sapphire Ring (USD 4,500.00) තිබෙනවා.'",
            "  'ඔබ සොයන්නේ කැපූ මැණික් ගලක්ද (Loose Stone), නැතහොත් නිමි ආභරණයක්ද?'",
            "Native Understanding: Automatically maps colloquial Sinhala terms to English database records."
        ],
        COLOR_EMERALD
    )

    # =========================================================================
    # SLIDE 6: ADMIN PLATFORM CAPABILITIES
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    bg6 = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg6.fill.solid()
    bg6.fill.fore_color.rgb = COLOR_BG_DARK
    bg6.line.fill.background()
    add_header(s6, "BizAdmin Management Dashboard", "ENTERPRISE FEATURES")

    add_card(
        s6, Inches(0.8), Inches(1.8), Inches(3.75), Inches(5.0),
        "📊 Dashboard & Metrics",
        [
            "Live system status monitoring.",
            "Active manager and agent counts.",
            "Low stock alerts for fast-moving items.",
            "Quick access to catalog summaries."
        ],
        COLOR_BLUE
    )

    add_card(
        s6, Inches(4.8), Inches(1.8), Inches(3.75), Inches(5.0),
        "📦 Product Catalog CMS",
        [
            "Full CRUD management of gems and jewellery.",
            "Attributes: Carat weight, Cut, Metal, Price, Currency.",
            "Real-time synchronization with Gemini AI prompt memory."
        ],
        COLOR_CYAN
    )

    add_card(
        s6, Inches(8.8), Inches(1.8), Inches(3.75), Inches(5.0),
        "💬 Live Chat Simulator",
        [
            "Real-time dual-view of customer & AI chats.",
            "3-second background polling without refresh.",
            "Internal sales testing without burning WhatsApp quota."
        ],
        COLOR_EMERALD
    )

    # =========================================================================
    # SLIDE 7: PRODUCTION DEPLOYMENT & ROADMAP
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    bg7 = s7.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg7.fill.solid()
    bg7.fill.fore_color.rgb = COLOR_BG_DARK
    bg7.line.fill.background()
    add_header(s7, "Production Scaling & Deployment Roadmap", "NEXT MILESTONES")

    add_card(
        s7, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "🌐 Phase 1: Permanent Cloud Hosting",
        [
            "Cloud Deployment: Host Backend & PostgreSQL on Render / Railway / AWS VPS for 99.99% uptime.",
            "Cloudflare Named Tunnel: Dedicated custom domain (e.g. webhook.gemconnect.lk) with SSL.",
            "Meta System User: Replace 24-hour temporary token with permanent 60-day or system token."
        ],
        COLOR_BLUE
    )

    add_card(
        s7, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "🎯 Phase 2: Advanced Commerce",
        [
            "WhatsApp Pay & Checkout: In-chat invoices and payment link generation.",
            "Image Catalog Sharing: Automatically send high-res gem photos and GIA certificates over WhatsApp.",
            "Human Agent Takeover: Seamless notification when customer requests human negotiation."
        ],
        COLOR_EMERALD
    )

    # =========================================================================
    # SLIDE 8: SUMMARY & Q&A
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    bg8 = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg8.fill.solid()
    bg8.fill.fore_color.rgb = COLOR_BG_DARK
    bg8.line.fill.background()

    t8_box = s8.shapes.add_textbox(Inches(1.5), Inches(2.2), Inches(10.3), Inches(3.0))
    tf8 = t8_box.text_frame
    tf8.word_wrap = True
    
    p8_sub = tf8.paragraphs[0]
    p8_sub.text = "CONCLUSION & NEXT STEPS"
    p8_sub.font.size = Pt(14)
    p8_sub.font.bold = True
    p8_sub.font.color.rgb = COLOR_CYAN
    p8_sub.space_after = Pt(14)

    p8_title = tf8.add_paragraph()
    p8_title.text = "Ready to Transform Gem Sales with AI"
    p8_title.font.size = Pt(40)
    p8_title.font.bold = True
    p8_title.font.color.rgb = COLOR_WHITE
    p8_title.space_after = Pt(14)

    p8_desc = tf8.add_paragraph()
    p8_desc.text = "The AI Sales Agent combines conversational intelligence, accurate inventory data, and instant WhatsApp response times to turn every inquiry into a high-value sale."
    p8_desc.font.size = Pt(18)
    p8_desc.font.color.rgb = COLOR_TEXT_MUTED

    output_path = r"f:\R&D\AI Sales Agent Platform\Ai Seles Agent\AI_Sales_Agent_Platform_Presentation.pptx"
    prs.save(output_path)
    print("SUCCESS: Presentation saved at:", output_path)

if __name__ == "__main__":
    create_deck()
