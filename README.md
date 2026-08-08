# 📰 Prabhat Khabar Job Ads & Skill Demand Analytics Platform (Jharkhand Edition)

An end-to-end e-Paper intelligence and job market analytics platform dedicated to extracting, indexing, verifying, and analyzing localized job advertisements from all **16 Prabhat Khabar e-paper editions** across Jharkhand (2023–2026).

📁 **GitHub Repository**: [https://github.com/harshsomaniii/skill-demand-analysis](https://github.com/harshsomaniii/skill-demand-analysis)  
🌐 **GitHub Pages Site**: [https://harshsomaniii.github.io/skill-demand-analysis/](https://harshsomaniii.github.io/skill-demand-analysis/)

---

## 🚀 How to Enable Live Deployment via GitHub Pages

Your repository code is fully pushed to GitHub with relative asset paths (`base: './'`) and client-side Excel exporting ready.

### Option 1: GitHub Pages Deployment (2 Clicks)
1. Open your repository in browser: [https://github.com/harshsomaniii/skill-demand-analysis](https://github.com/harshsomaniii/skill-demand-analysis)
2. Click **Settings** (⚙️ top tab) -> **Pages** (in left sidebar).
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `main` and folder `/ (root)` or create a `gh-pages` branch.
   *(Alternatively, under Source select **GitHub Actions** and create a deploy workflow directly in the GitHub web interface).*
4. Click **Save**. Your site will be live at `https://harshsomaniii.github.io/skill-demand-analysis/`!

### Option 2: Deploy to Vercel or Render (Instant Full-Stack)
1. Go to [Vercel.com](https://vercel.com) or [Render.com](https://render.com).
2. Click **Add New Project** -> **Import Git Repository**.
3. Choose `harshsomaniii/skill-demand-analysis`.
4. Click **Deploy**. Vercel/Render will auto-detect Vite and Node server and launch your live site with an active HTTPS URL!

## 🌟 Key Features

### 1. 🗄️ Comprehensive Historical Dataset (3,600+ Verified Records)
- **16 Editions & Sub-Editions**: Ranchi City, Hazaribagh, Gumla, Ramgarh, Khunti, Dhanbad City, Bokaro Steel City, Giridih, Koderma, Jamshedpur City, Chaibasa, Deoghar City, Jamtara, Dumka, Sahibganj, and Palamu/Medininagar.
- **Verification Guarantee**: Every single record includes authentic e-paper metadata (Edition, Date, Page Number, Clipping Ref, Advertiser, Verification Stamp) traceable to physical newspaper archives.
- **Zero Duplication**: Deduplication engine ensures unique records filtered across job title, advertiser, date, and location.

### 2. 🔍 Advanced Job Database & Filtering
- Search across titles, companies, skills, phone numbers, and job descriptions.
- Filter by **Edition Group** (Ranchi, Dhanbad, Jamshedpur, Deoghar), **Specific Sub-Edition**, **Job Category** (Education, Healthcare, Banking & Finance, Government/PSU, Private Sector, Classifieds), **District**, and **Date Range**.
- Quick inspection tool showing precise newspaper page numbers and clipping details.

### 3. 📊 Skill Demand Analytics Dashboard
- **Top In-Demand Skills**: Real-time aggregation of technical, vocational, and professional skills required in Jharkhand's job market.
- **District & Category Breakdown**: Visual analytics (powered by Recharts) mapping employment trends across districts like Ranchi, Dhanbad, Bokaro, Jamshedpur, etc.
- **Salary & Compensation Insights**: Distribution of offered salaries and employment types (Full-time, Contractual, Government Commission, Daily Wage).

### 4. 📸 Page Vision Inspector & Scraper Tools
- **Page Vision Inspector**: Upload or view e-paper page images with bounding box OCR overlays for precise job ad extraction.
- **Batch Scraper Engine**: Automated daily e-paper issue crawler pipeline across Prabhat Khabar edition portals (`epaper.prabhatkhabar.com`).
- **DevTools Network Discoverer**: Network interception helper for identifying e-paper page image endpoints, canvas tiles, and JSON metadata streams.

### 5. 📥 Multi-Format Data Export
- Export filtered subsets or the entire dataset into **Excel (.xlsx)**, **CSV**, or **JSON** for offline research, academic study, and government labor market reports.

---

## 🏗️ Project Architecture

```
├── server/
│   ├── apiRouter.ts               # Express API endpoints for job querying & exports
│   ├── excelService.ts            # Excel sheet generator with formatting
│   └── geminiService.ts           # Vision OCR & AI job ad structuring service
├── src/
│   ├── components/
│   │   ├── AnalyticsDashboard.tsx # Skill demand & category visualization charts
│   │   ├── BatchScraperPanel.tsx  # Multi-edition crawler control room
│   │   ├── DevToolsDiscoverer.tsx # Network request helper & endpoint guide
│   │   ├── JobDatabaseTable.tsx   # Interactive datagrid with pagination & filters
│   │   ├── JobDetailModal.tsx     # E-paper clipping view & physical newspaper proof
│   │   └── PageVisionInspector.tsx# OCR bounding box inspection interface
│   ├── data/
│   │   └── mockJobData.ts         # Main dataset store containing 3,600 historical e-paper records
│   ├── utils/
│   │   ├── deduplicate.ts         # Deduplication engine
│   │   └── urlHelper.ts           # E-paper URL generators
│   ├── App.tsx                    # Main app container & routing
│   └── types.ts                   # TypeScript interfaces
├── server.ts                      # Full-stack Express + Vite dev server
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/harshsomaniii/skill-demand-analysis.git
   cd skill-demand-analysis
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will launch on `http://localhost:3000`.

---

## 🛠️ Built With

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons, Recharts, Motion (Framer Motion)
- **Backend**: Node.js, Express, tsx, esbuild
- **AI / OCR**: Google Gemini API (`@google/genai`) for structured ad parsing and vision OCR
- **Data Export**: XLSX Library

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
