# Prabhat Khabar Job Scraper

This is a standalone Node.js CLI tool that automatically extracts real job advertisements from the Prabhat Khabar e-paper across multiple city editions using the Google Gemini Vision API. 

## Features
- Scrapes the e-paper directly without rendering UI.
- Detects the correct page dimensions and extracts job sections from the "Classifieds" or "Awsar" sections.
- Bypasses local OCR entirely by passing high-res newspaper images directly to `gemini-3.5-flash` or `gemini-3.1-flash-lite`.
- Automatically outputs the job postings into a clean master spreadsheet (`Prabhat_Khabar_Real_Data.xlsx`).

## Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by copying `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key to `.env`.

## Usage

To start scraping, run the scraper script via `tsx`. You can specify a start and end date (YYYY-MM-DD):

```bash
npm run scrape -- 2024-01-01 2024-01-31
```

If no arguments are provided, it will default to a single day.

## Output

All extracted jobs are appended to `Prabhat_Khabar_Real_Data.xlsx` in the root directory. The script reads the existing file to avoid duplicate extraction.
