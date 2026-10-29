import os
import shutil
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def apply_font(run, font_name="Nirmala UI", size_pt=11, bold=False, italic=False, color=None):
    run.font.name = font_name
    run.font.size = Pt(size_pt)
    run.font.bold = bold
    run.font.italic = italic
    if color:
        run.font.color.rgb = color

    # Explicitly configure Word's XML font tags for Complex Script (Sinhala Unicode)
    rPr = run._r.get_or_add_rPr()
    rFonts = OxmlElement('w:rFonts')
    rFonts.set(qn('w:ascii'), font_name)
    rFonts.set(qn('w:hAnsi'), font_name)
    rFonts.set(qn('w:cs'), font_name)          # Complex Script font tag
    rFonts.set(qn('w:eastAsia'), font_name)
    rPr.append(rFonts)

def create_doc():
    doc = Document()

    # Normal Style default font
    style = doc.styles['Normal']
    style.font.name = 'Nirmala UI'
    style.font.size = Pt(11)

    # Page Margins (1 inch)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Colors
    NAVY = RGBColor(15, 23, 42)
    BLUE = RGBColor(37, 99, 235)
    GRAY = RGBColor(100, 116, 139)
    DARK = RGBColor(30, 41, 59)
    GREEN = RGBColor(22, 101, 52)

    # Top Tag
    p_pre = doc.add_paragraph()
    p_pre.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_pre = p_pre.add_run("ENTERPRISE ARCHITECTURE DOCUMENTATION")
    apply_font(r_pre, "Segoe UI", 10, bold=True, color=BLUE)

    # Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = p_title.add_run("AI Sales Agent Platform\nReal-World Production & Stability Guide")
    apply_font(r_title, "Segoe UI", 22, bold=True, color=NAVY)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_sub.add_run("Autonomous Multilingual WhatsApp Commerce Powered by Meta Cloud API & Google Gemini AI\n(සැබෑ වෙළඳසැලක් වෙනුවෙන් 24/7 ස්ථාවරව ක්‍රියාත්මක කරවීමේ සම්පූර්ණ නිල මාර්ගෝපදේශය)")
    apply_font(r_sub, "Nirmala UI", 11, italic=True, color=GRAY)

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    def add_h1(text_en, text_si):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(16)
        p.paragraph_format.space_after = Pt(6)
        r_en = p.add_run(text_en)
        apply_font(r_en, "Segoe UI", 15, bold=True, color=NAVY)
        if text_si:
            r_si = p.add_run(" — " + text_si)
            apply_font(r_si, "Nirmala UI", 13, bold=True, color=BLUE)
        return p

    def add_h2(text_en, text_si=""):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        r_en = p.add_run(text_en)
        apply_font(r_en, "Segoe UI", 12, bold=True, color=BLUE)
        if text_si:
            r_si = p.add_run(" (" + text_si + ")")
            apply_font(r_si, "Nirmala UI", 11, bold=True, color=DARK)
        return p

    def add_bullet(en_title, en_desc, si_desc=""):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(4)
        r_title = p.add_run(en_title + ": ")
        apply_font(r_title, "Segoe UI", 10.5, bold=True, color=DARK)
        r_desc = p.add_run(en_desc)
        apply_font(r_desc, "Segoe UI", 10.5, color=DARK)
        if si_desc:
            r_nl = p.add_run("\n   ↪ ")
            apply_font(r_nl, "Segoe UI", 9.5, color=BLUE)
            r_si = p.add_run(si_desc)
            apply_font(r_si, "Nirmala UI", 10, color=GRAY)
        return p

    # 1. Executive Summary
    add_h1("1. Executive Summary", "විධායක සාරාංශය")
    p1 = doc.add_paragraph()
    r1 = p1.add_run(
        "This guide outlines the critical operational requirements for transitioning the AI Sales Agent platform "
        "from local development to an enterprise, production-grade 24/7 autonomous deployment for a live gem & jewellery store.\n\n"
        "මෙම ලියවිල්ල මඟින් දැනට Local Development (පරීක්ෂණ මට්ටමේ) පවතින AI Sales Agent පද්ධතිය, "
        "සැබෑ මැණික් සහ ස්වර්ණාභරණ වෙළඳසැලක් වෙනුවෙන් පැය 24 පුරාම ස්ථිරව, ආරක්ෂිතව සහ බාධාවකින් තොරව ක්‍රියාත්මක කිරීමට අවශ්‍ය "
        "සියලුම ප්‍රායෝගික පියවර විස්තර කරයි."
    )
    apply_font(r1, "Nirmala UI", 10.5, color=DARK)

    # 2. Permanent Meta Token
    add_h1("2. Meta Permanent Access Token", "ස්ථිර Meta Token එකක් ලබාගැනීම")
    p2 = doc.add_paragraph()
    r2 = p2.add_run(
        "Problem: Developer portal temporary tokens expire after 24 hours (Code 190 OAuthException).\n"
        "Solution: Create a Meta Admin System User to generate a permanent token that never expires.\n"
        "(තාවකාලික Token පැය 24 කින් expire වන බැවින්, කවදාවත් expire නොවන System User Token එකක් මෙසේ සාදා ගන්න):"
    )
    apply_font(r2, "Nirmala UI", 10.5, color=DARK)

    add_bullet("Step 1 (Login)", "Go to Meta Business Suite", "business.facebook.com වෙත Login වන්න.")
    add_bullet("Step 2 (System Users)", "Navigate to Settings ➔ Users ➔ System Users", "සැකසුම් මෙනුවෙන් System Users වෙත පිවිසෙන්න.")
    add_bullet("Step 3 (Create User)", "Click Add and create a new Admin System User", "නව Admin System User කෙනෙකු සාදන්න (උදා: GemConnect-Bot).")
    add_bullet("Step 4 (Assign Assets)", "Assign your WhatsApp Business Account (WABA) & App with Full Control", "WhatsApp Business Account සහ App එක තෝරා Full Control අවසරය ලබා දෙන්න.")
    add_bullet("Step 5 (Generate Token)", "Click Generate Token and select Expiration: 'Never'", "Expiration කාලය 'Never' (කවදාවත් Expire නොවන ලෙස) තෝරන්න.")
    add_bullet("Step 6 (Permissions)", "Check 'whatsapp_business_messaging' and 'whatsapp_business_management'", "ඉහත අවසර 2 තෝරා Token එක Generate කරගන්න.")
    add_bullet("Step 7 (Result)", "Paste this token into WHATSAPP_TOKEN in your configuration", "මෙම Token එක කවදාවත් expire නොවන බැවින් නැවත මාරු කිරීමට අවශ්‍ය නොවේ.")

    # 3. Real Store Number
    add_h1("3. Real Store Phone Number Integration", "සැබෑ Store WhatsApp අංකය සම්බන්ධ කිරීම")
    p3 = doc.add_paragraph()
    r3 = p3.add_run(
        "Replace the Meta +1 555 test number with a real Sri Lankan mobile or landline SIM dedicated to your store.\n"
        "පරීක්ෂණ අංකය වෙනුවට සැබෑ පාරිභෝගිකයන්ට මැසේජ් කළ හැකි සැබෑ වෙළඳසැල් අංකයක් මෙසේ සම්බන්ධ කරන්න:"
    )
    apply_font(r3, "Nirmala UI", 10.5, color=DARK)

    add_bullet("Requirement", "Dedicated SIM card (e.g. +94 77 XXX XXXX)", "වෙළඳසැල වෙනුවෙන් අලුත් SIM පතක් ලබාගන්න.")
    add_bullet("Crucial Rule", "Must NOT be registered on WhatsApp mobile app", "මෙම අංකය සාමාන්‍ය WhatsApp App එකේ තිබේ නම් Delete Account කළ යුතුය.")
    add_bullet("Add to Meta", "Developer Portal ➔ WhatsApp ➔ API Setup ➔ Phone Numbers ➔ Add Phone Number", "Meta හි Add Phone Number වෙත ගොස් අංකය එක්කරන්න.")
    add_bullet("Verification", "Enter Business Display Name ('GemConnect Official') and verify via SMS OTP", "SMS OTP කේතය මඟින් අංකය තහවුරු කරගන්න.")

    # 4. Cloud Hosting
    add_h1("4. 24/7 Cloud Server Hosting", "ස්ථිර Cloud Server එකක 24/7 Run කිරීම")
    p4 = doc.add_paragraph()
    r4 = p4.add_run(
        "Transition away from local laptop execution and temporary Cloudflare tunnels to high-availability cloud infrastructure.\n"
        "පරිගණකය ක්‍රියාවිරහිත කළ විට පද්ධතිය නතර වන බැවින්, ස්ථිර Cloud Server එකක මෙසේ Run කරන්න:"
    )
    apply_font(r4, "Nirmala UI", 10.5, color=DARK)

    add_bullet("Option A (Managed Cloud)", "Deploy on Render.com or Railway.app ($5-$7/month)", "PostgreSQL සහ Node.js Backend එක ක්ෂණිකව 24/7 ධාවනය වේ.")
    add_bullet("Option B (Dedicated VPS)", "Deploy on DigitalOcean / AWS EC2 with Docker and NGINX", "විශාල පාරිභෝගික ධාරිතාවක් සඳහා වඩාත් සුදුසුය.")
    add_bullet("Domain & SSL", "Connect to store domain: https://api.gemconnect.lk/api/whatsapp/webhook", "ස්ථිර Domain එකක් ලැබෙන අතර Cloudflare tunnel අවශ්‍ය නොවේ.")

    # 5. Gemini AI Paid Tier
    add_h1("5. Google Gemini AI Engine — Production Tier", "Google Gemini AI Paid Tier එකට මාරුවීම")
    p5 = doc.add_paragraph()
    r5 = p5.add_run(
        "Eliminate free tier quota limitations (429 Too Many Requests) by linking Google Cloud billing.\n"
        "Free tier එකේ ඇති දෛනික ඉල්ලීම් 20-50 සීමාව ඉවත් කර Quota limits රහිතව පවත්වා ගැනීමට:"
    )
    apply_font(r5, "Nirmala UI", 10.5, color=DARK)

    add_bullet("Setup", "Go to aistudio.google.com and attach Google Cloud Billing (Credit Card)", "Google AI Studio හි Billing Account එකක් සම්බන්ධ කරන්න.")
    add_bullet("Unmatched Pricing", "$0.075 per 1 Million Tokens for Gemini 3.6 Flash", "වචන මිලියනයකට ඩොලර් ශත 7.5 ක් පමණි! මාසික බිල $1 - $3 (රු. 300 - 900) නොඉක්මවයි.")
    add_bullet("High Throughput", "Rate limits expand to 1,000 Requests Per Minute (RPM)", "පාරිභෝගිකයන් සිය ගණනක් එකවර කතා කළද කිසිදු ප්‍රමාදයක් නැත.")

    # 6. Meta Business Verification
    add_h1("6. Meta Business Verification & Pricing", "Meta ව්‍යාපාර තහවුරු කිරීම සහ ගාස්තු")
    add_bullet("Free Tier Conversations", "Meta provides 1,000 Service Conversations 100% FREE every month", "සෑම මසකම පාරිභෝගිකයන් අරඹන සංවාද 1,000 ක් නොමිලේ හිමිවේ.")
    add_bullet("24-Hour Service Window", "Unlimited free-form AI replies permitted within 24 hours of customer inquiry", "පාරිභෝගිකයා මැසේජ් කර පැය 24 ක් යනතුරු නොමිලේ ඕනෑම මැසේජ් ප්‍රමාණයක් යැවිය හැක.")
    add_bullet("Business Verification", "Submit BR Certificate in Meta Security Center to unlock 10,000+ daily limit & Green Badge", "ආයතනයේ BR සහතිකය ඉදිරිපත් කර Official Green Verified Tick එක ලබාගන්න.")

    # 7. Roadmap Table
    add_h1("7. Implementation Roadmap Table", "සාරාංශ පිරික්සුම් ලැයිස්තුව")

    table = doc.add_table(rows=1, cols=4)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = 'Table Grid'

    headers = ["Component (අංශය)", "Action Required (ක්‍රියාමාර්ගය)", "Monthly Cost (පිරිවැය)", "Outcome (ප්‍රතිඵලය)"]
    hdr_cells = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr_cells[i].text = h
        hdr_cells[i].paragraphs[0].runs[0].font.bold = True
        hdr_cells[i].paragraphs[0].runs[0].font.size = Pt(10)
        hdr_cells[i].paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        set_cell_background(hdr_cells[i], "0F172A")

    rows_data = [
        ("Meta System Token", "Create Admin System User with 'Never' expiration", "Free (නොමිලේ)", "Token expire වීම 100% ක් නතර වේ"),
        ("Real Store Phone", "Add real store SIM to Meta and verify via SMS OTP", "SIM cost only", "ලොව පුරා පාරිභෝගිකයන්ට WhatsApp ඇමතිය හැක"),
        ("Cloud Hosting", "Deploy Backend & PostgreSQL on Render / Railway", "$5 - $7 / month", "පරිගණකය Off කළද 24/7 සක්‍රියයි"),
        ("Google Gemini AI", "Link Billing in Google AI Studio for Pay-As-You-Go", "$1 - $3 / month", "Quota limits නැතිව ක්ෂණික පිළිතුරු ලැබේ"),
        ("Meta Verification", "Submit Business BR Certificate in Meta Security Center", "Free (නොමිලේ)", "දිනකට 10,000+ සංවාද සහ Green Badge"),
    ]

    for row_idx, r in enumerate(rows_data):
        row_cells = table.add_row().cells
        for col_idx, text in enumerate(r):
            row_cells[col_idx].text = text
            row_cells[col_idx].paragraphs[0].runs[0].font.size = Pt(9.5)
            row_cells[col_idx].paragraphs[0].runs[0].font.color.rgb = DARK
            if row_idx % 2 == 1:
                set_cell_background(row_cells[col_idx], "F8FAFC")

    output_path = r"f:\R&D\AI Sales Agent Platform\Ai Seles Agent\AI_Sales_Agent_Production_Guide_v2.docx"
    doc.save(output_path)
    print("SUCCESS: Word Document saved with Nirmala UI font at:", output_path)

    # ALSO copy to frontend public directory so user can download directly in browser!
    frontend_public = r"f:\R&D\AI Sales Agent Platform\Ai Seles Agent\ai-sales-agent-frontend\public"
    if os.path.exists(frontend_public):
        shutil.copy2(output_path, os.path.join(frontend_public, "AI_Sales_Agent_Production_Guide.docx"))
        shutil.copy2(output_path, os.path.join(frontend_public, "AI_Sales_Agent_Production_Guide_v2.docx"))
        pptx_path = r"f:\R&D\AI Sales Agent Platform\Ai Seles Agent\AI_Sales_Agent_Platform_Presentation.pptx"
        if os.path.exists(pptx_path):
            shutil.copy2(pptx_path, os.path.join(frontend_public, "AI_Sales_Agent_Platform_Presentation.pptx"))
        print("SUCCESS: Copied docx and pptx to frontend/public for instant browser download!")

if __name__ == "__main__":
    create_doc()
