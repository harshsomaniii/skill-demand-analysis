# 📰 Prabhat Khabar Job Ads & Skill Demand Analytics Platform (Jharkhand Edition)

An end-to-end e-Paper intelligence and job market analytics platform dedicated to extracting, indexing, verifying, and analyzing localized job advertisements from all **16 Prabhat Khabar e-paper editions** across Jharkhand (2023–2026).

---

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
- **Batch Scraper Engine**: Simulate or run automated daily e-paper issue crawlers across Prabhat Khabar edition portals (`epaper.prabhatkhabar.com`).
- **DevTools Network Discoverer**: Network interception helper for identifying e-paper page image endpoints, canvas tiles, and JSON metadata streams.

### 5. 📥 Multi-Format Data Export
- Export filtered subsets or the entire dataset into **Excel (.xlsx)**, **CSV**, or **JSON** for offline research, academic study, and government labor market reports.

---

## 🏗️ Project Architecture

```
├── scripts/
│   └── generate2000Jobs.cjs       # Realistic dataset generator for 3,600+ Prabhat Khabar job records
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
│   │   └── mockJobData.ts         # 3,600 historical records dataset
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

4. **Regenerate / Expand Dataset** (Optional):
   ```bash
   node scripts/generate2000Jobs.cjs
   ```

---

## 🛠️ Built With

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons, Recharts, Motion (Framer Motion)
- **Backend**: Node.js, Express, tsx, esbuild
- **AI / OCR**: Google Gemini API (`@google/genai`) for structured ad parsing and vision OCR
- **Data Export**: XLSX Library

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
