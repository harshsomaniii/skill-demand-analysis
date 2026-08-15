import { GoogleGenAI, Type } from "@google/genai";
import exceljs from 'exceljs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const START_DATE = '2024-01-01'; 
const END_DATE = '2024-01-31';
const DELAY_BETWEEN_PAGES = 4500; // 4.5 seconds for ~15/min limits
const MAX_PAGES_PER_ISSUE = 16;
const EXCEL_FILE_PATH = path.join(process.cwd(), 'Prabhat_Khabar_Real_Data.xlsx');

const MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3-flash-preview',
  'gemini-3.6-flash',
  'gemini-3.1-flash-image',
  'gemini-flash-latest'
];
let currentModelIndex = 0;

// ------------------------------------------------------------------
// UTILITY: Get Next Date
// ------------------------------------------------------------------
function getNextDate(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

// ------------------------------------------------------------------
// STEP 1: Download Page Image
// ------------------------------------------------------------------
async function fetchPageImage(pageUrl: string): Promise<Buffer | null> {
  try {
    const fetchRes = await fetch(pageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!fetchRes.ok) return null;

    const htmlText = await fetchRes.text();
    
    const imgRegex = /<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi;
    const foundImages: string[] = [];
    let match;
    while ((match = imgRegex.exec(htmlText)) !== null) {
      let src = match[1];
      src = src.replace(/&amp;/g, '&');
      if (src.startsWith('//')) src = 'https:' + src;
      else if (src.startsWith('/')) src = 'https://epaper.prabhatkhabar.com' + src;
      if (src.startsWith('http')) {
        foundImages.push(src);
      }
    }

    const newspaperCandidates = foundImages.filter((src) => {
      const lower = src.toLowerCase();
      return lower.includes('cdnimg') || lower.includes('pdf');
    });

    let primaryImageUrl = newspaperCandidates[0];
    if (!primaryImageUrl) return null;

    primaryImageUrl = primaryImageUrl.replace(/w=\d+/, 'w=2048').replace(/q=\d+/, 'q=75');

    const imgRes = await fetch(primaryImageUrl);
    if (!imgRes.ok) return null;

    const arrayBuffer = await imgRes.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    return null;
  }
}

// ------------------------------------------------------------------
// STEP 2: Gemini Vision API (With Auto-Failover)
// ------------------------------------------------------------------
async function extractJobsFromImage(imageBuffer: Buffer, metadata: any): Promise<any[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing from .env");
  
  const ai = new GoogleGenAI({ apiKey });
  const imageBase64 = imageBuffer.toString('base64');

  const promptText = `Analyze this newspaper page image from ${metadata.newspaper} (${metadata.edition} edition, Date: ${metadata.date}, Page: ${metadata.pageNumber}).
Identify ALL job advertisements, walk-in interview calls, and classified job postings on this page.
For EACH job advertisement found, extract:
1. company (The name of the company hiring, or "Unknown")
2. job_title (The specific role, or "Multiple Roles")
3. job_location (Where the job is located)
4. original_advertisement (The full text of the advertisement)
5. category (e.g. Education, IT, Construction)
6. qualification (Required degrees/experience)
7. deadline (Any mentioned application deadline)
8. contact_info (Phone numbers, emails, addresses)

If NO job advertisements exist on this page, return an empty array.`;

  while (currentModelIndex < MODELS.length) {
    const currentModel = MODELS[currentModelIndex];
    try {
      const response = await ai.models.generateContent({
        model: currentModel,
        contents: [
          { role: 'user', parts: [
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
            { text: promptText },
          ]}
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                job_title: { type: Type.STRING },
                job_location: { type: Type.STRING },
                original_advertisement: { type: Type.STRING },
                category: { type: Type.STRING },
                qualification: { type: Type.STRING },
                deadline: { type: Type.STRING },
                contact_info: { type: Type.STRING },
              },
              required: ["company", "job_title", "job_location", "original_advertisement"],
            },
          },
        },
      });

      const jsonText = response.text ? response.text.trim() : "[]";
      return JSON.parse(jsonText);
    } catch (e: any) {
      if (e.message && e.message.includes('429')) {
        console.log(`\n      ⚠️ Model ${currentModel} reached 429 Limit. Failing over...`);
        currentModelIndex++;
        if (currentModelIndex >= MODELS.length) {
          console.error("      ❌ ALL FAILOVER MODELS EXHAUSTED.");
          throw e; // Break completely if all models are dead
        }
        console.log(`      🔄 Retrying with ${MODELS[currentModelIndex]}...`);
      } else {
        console.error("      ❌ Gemini API Error:", e.message);
        return [];
      }
    }
  }
  return [];
}

// ------------------------------------------------------------------
// MAIN SCRAPER LOOP
// ------------------------------------------------------------------
async function runScraper() {
  console.log('----------------------------------------------------');
  console.log('🚀 Prabhat Khabar Multi-Model Scraper (Failover Edition)');
  console.log('----------------------------------------------------');

  let workbook = new exceljs.Workbook();
  let worksheet: exceljs.Worksheet;

  // The critical exceljs fix for keys
  const columnsDef = [
    { header: 'Newspaper', key: 'newspaper', width: 15 },
    { header: 'Edition', key: 'edition', width: 20 },
    { header: 'Date', key: 'date', width: 12 },
    { header: 'Page Number', key: 'page_number', width: 12 },
    { header: 'Company', key: 'company', width: 30 },
    { header: 'Job Title / Role', key: 'job_title', width: 30 },
    { header: 'Job Location', key: 'job_location', width: 20 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Qualification', key: 'qualification', width: 25 },
    { header: 'Deadline', key: 'deadline', width: 15 },
    { header: 'Contact Info', key: 'contact_info', width: 30 },
    { header: 'Original Advertisement Text', key: 'original_advertisement', width: 60 }
  ];

  if (fs.existsSync(EXCEL_FILE_PATH)) {
    await workbook.xlsx.readFile(EXCEL_FILE_PATH);
    worksheet = workbook.getWorksheet('Scraped Jobs')!;
    worksheet.columns = columnsDef; // CRITICAL: Re-assign columns so .addRow() works correctly!
    console.log(`✅ Loaded existing database: ${EXCEL_FILE_PATH}`);
  } else {
    worksheet = workbook.addWorksheet('Scraped Jobs');
    worksheet.columns = columnsDef;
    console.log(`✅ Excel Database initialized at: ${EXCEL_FILE_PATH}`);
  }

  const editions = [
    { slug: 'ranchi/ranchi-city', name: 'Ranchi City' },
    { slug: 'ranchi/jharkhand-state', name: 'Jharkhand State' },
    { slug: 'jamshedpur/jamshedpur-city', name: 'Jamshedpur City' },
    { slug: 'dhanbad/dhanbad-city', name: 'Dhanbad City' },
  ];

  const customStartDate = process.argv[2];
  const customEndDate = process.argv[3];
  
  let currentDate = customStartDate || START_DATE;
  const endDate = customEndDate || END_DATE;

  while (currentDate <= endDate) {
    console.log(`\n📅 Processing Date: ${currentDate}`);

    for (const edition of editions) {
      console.log(`  📍 Checking Edition: ${edition.name} (${edition.slug})`);

      for (let pageNum = 8; pageNum <= MAX_PAGES_PER_ISSUE; pageNum++) {
        const pageUrl = `https://epaper.prabhatkhabar.com/${edition.slug}/${currentDate}/${pageNum}`;
        
        process.stdout.write(`    📄 Page ${pageNum}: Extracting with ${MODELS[currentModelIndex]}... `);
        const imageBuffer = await fetchPageImage(pageUrl);
        
        if (!imageBuffer) {
          console.log('Skipped (No image found)');
          continue;
        }

        const metadata = {
          newspaper: 'Prabhat Khabar',
          edition: edition.name,
          date: currentDate,
          pageNumber: `Page ${pageNum}`
        };

        const jobs = await extractJobsFromImage(imageBuffer, metadata);
        
        if (jobs && jobs.length > 0) {
          for (const job of jobs) {
            worksheet.addRow({
              newspaper: metadata.newspaper,
              edition: metadata.edition,
              date: metadata.date,
              page_number: metadata.pageNumber,
              company: job.company || 'Unknown',
              job_title: job.job_title || 'Unknown',
              job_location: job.job_location || '',
              category: job.category || '',
              qualification: job.qualification || '',
              deadline: job.deadline || '',
              contact_info: job.contact_info || '',
              original_advertisement: job.original_advertisement || ''
            });
          }
          let saved = false;
          let retries = 5;
          while (!saved && retries > 0) {
            try {
              await workbook.xlsx.writeFile(EXCEL_FILE_PATH);
              saved = true;
            } catch (err: any) {
              if (err.code === 'EBUSY') {
                console.log(`\n      ⚠️ Excel file is locked (EBUSY). Retrying in 5 seconds... (${retries} retries left)`);
                await new Promise(resolve => setTimeout(resolve, 5000));
                retries--;
              } else {
                throw err;
              }
            }
          }
          if (saved) {
            console.log(`\n      📥 Saved ${jobs.length} jobs to Excel.`);
          } else {
            console.log(`\n      ❌ FAILED to save to Excel after multiple retries.`);
          }
        } else {
          console.log('➖ No ads.');
        }

        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_PAGES));
      }
    }
    
    currentDate = getNextDate(currentDate);
  }

  console.log('\n🎉 Scraping Completed for the specified date range.');
}

runScraper().catch(console.error);
