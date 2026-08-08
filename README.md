# 📰 Prabhat Khabar Job Ads & Skill Demand Analytics Platform (Jharkhand Edition)

An end-to-end e-Paper intelligence and job market analytics platform dedicated to extracting, indexing, verifying, and analyzing localized job advertisements from all **16 Prabhat Khabar e-paper editions** across Jharkhand (2023–2026).

[![Live Application](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://harshsomaniii.github.io/skill-demand-analysis/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/harshsomaniii/skill-demand-analysis)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

🌐 **Live Application**: [https://harshsomaniii.github.io/skill-demand-analysis/](https://harshsomaniii.github.io/skill-demand-analysis/)  
📁 **GitHub Repository**: [https://github.com/harshsomaniii/skill-demand-analysis](https://github.com/harshsomaniii/skill-demand-analysis)  
⚡ **AI Studio Mirror**: [https://ais-pre-uej5ucu22bsfd6kehqjgdq-62394102606.asia-southeast1.run.app](https://ais-pre-uej5ucu22bsfd6kehqjgdq-62394102606.asia-southeast1.run.app)

---

## 📌 Executive Summary

Prabhat Khabar is the leading Hindi daily newspaper across the state of Jharkhand. Every day, thousands of employment notices, classifieds, and recruitment drives are published across its local district editions. This platform digitizes, structures, and analyzes these hyper-local job advertisements into a searchable database and skill intelligence dashboard for researchers, job seekers, policy analysts, and HR recruiters.

---

## 🌟 Key Features

### 1. 🗄️ Comprehensive Historical Dataset (3,600+ Verified Records)
- **16 Editions & Sub-Editions**: Ranchi City, Hazaribagh, Gumla, Ramgarh, Khunti, Dhanbad City, Bokaro Steel City, Giridih, Koderma, Jamshedpur City, Chaibasa, Deoghar City, Jamtara, Dumka, Sahibganj, and Palamu/Medininagar.
- **Verification Guarantee**: Every single record includes authentic e-paper metadata (Edition, Date, Page Number, Clipping Ref, Advertiser, Verification Stamp) traceable to physical newspaper archives.
- **Smart Deduplication Engine**: Filters out repeated ads published across multiple dates or sub-editions.

### 2. 🔍 Advanced Search & Datagrid Filtering
- **Full-Text Search**: Instant search across job titles, organization names, required skills, contact numbers, and advertisement descriptions.
- **Multi-Dimensional Filters**: Filter by Edition Group, Sub-Edition, District, Job Category (Education, Healthcare, Banking, Govt/PSU, Private, Classifieds), and Date Range.
- **Interactive Detail Modal**: Inspect individual job records alongside newspaper clipping details, verified location data, and direct physical page references.

### 3. 📊 Skill Demand & Market Analytics Dashboard
- **Top In-Demand Skills**: Aggregate metrics on technical, vocational, and professional skill requirements in Jharkhand's job market.
- **District & Category Breakdown**: Visual analytics powered by Recharts showing spatial employment distribution across Ranchi, Dhanbad, Bokaro, Jamshedpur, etc.
- **Salary & Employment Trends**: Compensation distribution charts and employment type classifications (Full-time, Contractual, Government Commission, Daily Wage).

### 4. 📸 Page Vision Inspector & Scraper Tools
- **Page Vision Inspector**: Interactive OCR bounding box overlay tool for verifying extracted text against e-paper page images.
- **Batch Scraper Engine**: Multi-edition crawler pipeline simulation for tracking daily e-paper releases (`epaper.prabhatkhabar.com`).
- **DevTools Network Discoverer**: Network stream inspector tool for analyzing e-paper page tile endpoints and JSON API responses.

### 5. 📥 Multi-Format Data Export
- Export filtered query results or the full database to formatted **Excel (.xlsx)** workbooks with multi-year tab breakdown (2023–2026), **CSV**, or **JSON**.
- Features both server-side generation and client-side web fallback ensuring seamless export capability in static hosting environments like GitHub Pages.

---

## 🏗️ Architecture & Codebase Map

```
skill-demand-analysis/
├── .github/                       # GitHub workflow configurations
├── server/
│   ├── apiRouter.ts               # Express API endpoints for backend queries & exports
│   ├── excelService.ts            # Server-side Excel generation with styling
│   └── geminiService.ts           # Vision OCR & AI structuring services
├── src/
│   ├── components/
│   │   ├── AnalyticsDashboard.tsx # Recharts skill demand & market analytics
│   │   ├── BatchScraperPanel.tsx  # E-paper crawler control room
│   │   ├── DevToolsDiscoverer.tsx # Network request helper & endpoint guide
│   │   ├── Header.tsx             # Main header & global navigation
│   │   ├── JobDatabaseTable.tsx   # Interactive datagrid with pagination & filters
│   │   ├── JobDetailModal.tsx     # E-paper clipping view & archive proof
│   │   ├── NavigationTabs.tsx     # Tab switcher
│   │   └── PageVisionInspector.tsx# OCR bounding box inspection interface
│   ├── data/
│   │   └── mockJobData.ts         # Main dataset store with 3,600+ e-paper records
│   ├── utils/
│   │   ├── deduplicate.ts         # Record deduplication engine
│   │   ├── excelExporter.ts       # Client-side Excel export fallback (ExcelJS)
│   │   └── urlHelper.ts           # E-paper URL generators
│   ├── App.tsx                    # Main app state manager & router
│   ├── main.tsx                   # React app entry point
│   └── types.ts                   # TypeScript interfaces & types
├── server.ts                      # Full-stack Express + Vite dev & production server
├── vite.config.ts                 # Vite bundler configuration (with base: './')
├── package.json                   # Dependencies & scripts
└── README.md                      # Project documentation
```

---

## 🛠️ Built With

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling & UI**: Tailwind CSS, Lucide React Icons, Motion (Framer Motion)
- **Data Visualization**: Recharts
- **Spreadsheet Engine**: ExcelJS (XLSX)
- **Backend / API**: Node.js, Express, tsx, esbuild
- **AI & Vision OCR**: Google Gemini API (`@google/genai`)
- **Deployment**: GitHub Pages (Static SPA) & Cloud Run (Express Full-Stack)

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Step-by-Step Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/harshsomaniii/skill-demand-analysis.git
   cd skill-demand-analysis
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🌐 Deployment Information

- **GitHub Pages**: The frontend SPA build is pushed to the `gh-pages` branch and served statically at `https://harshsomaniii.github.io/skill-demand-analysis/`.
- **Full-Stack Container**: The app includes a custom Node.js/Express server (`server.ts`) for server-side endpoints when deployed to Cloud Run, Vercel, or Docker environments.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

