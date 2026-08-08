import ExcelJS from 'exceljs';
import { JobAd } from '../src/types';

export async function generateExcelWorkbook(jobs: JobAd[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'InduPaper Prabhat Khabar Scraper';
  workbook.lastModifiedBy = 'InduPaper Research Tool';
  workbook.created = new Date();

  // -------------------------------------------------------------
  // Sheet 1: All Job Advertisements (Main Master Sheet)
  // -------------------------------------------------------------
  const sheet1 = workbook.addWorksheet('Job Advertisements 2024-Present');

  sheet1.columns = [
    { header: 'Newspaper', key: 'newspaper', width: 18 },
    { header: 'Edition', key: 'edition', width: 20 },
    { header: 'Date', key: 'date', width: 14 },
    { header: 'Page Number', key: 'page_number', width: 14 },
    { header: 'Company / Organization', key: 'company', width: 32 },
    { header: 'Job Title / Designation', key: 'job_title', width: 32 },
    { header: 'Job Location', key: 'job_location', width: 24 },
    { header: 'Original Advertisement (Verbatim)', key: 'original_advertisement', width: 55 },
    { header: 'Category / Sector', key: 'category', width: 22 },
    { header: 'Qualification & Experience', key: 'qualification', width: 30 },
    { header: 'Deadline / Interview Date', key: 'deadline', width: 18 },
    { header: 'Contact / Website / Phone', key: 'contact_info', width: 32 },
  ];

  // Header Styling
  const headerRow = sheet1.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1E3A8A' }, // Deep Blue
    };
    cell.font = {
      name: 'Calibri',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFF' },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'medium', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } },
    };
  });

  // Populate Rows
  jobs.forEach((job, index) => {
    const row = sheet1.addRow({
      newspaper: job.newspaper || 'Prabhat Khabar',
      edition: job.edition || 'Ranchi City',
      date: job.date || '',
      page_number: job.page_number || '',
      company: job.company || '',
      job_title: job.job_title || '',
      job_location: job.job_location || '',
      original_advertisement: job.original_advertisement || '',
      category: job.category || 'Classifieds / Other',
      qualification: job.qualification || 'N/A',
      deadline: job.deadline || 'N/A',
      contact_info: job.contact_info || 'N/A',
    });

    row.height = 38;

    // Zebra Striping
    const isEven = index % 2 === 0;
    row.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEven ? 'F8FAFC' : 'FFFFFF' },
      };
      cell.font = { name: 'Calibri', size: 10 };
      cell.alignment = {
        vertical: 'top',
        horizontal: colNumber === 3 || colNumber === 4 || colNumber === 11 ? 'center' : 'left',
        wrapText: true,
      };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
        right: { style: 'thin', color: { argb: 'F1F5F9' } },
      };
    });
  });

  // Enable Auto-filter on Sheet 1
  sheet1.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: jobs.length + 1, column: 12 },
  };

  // -------------------------------------------------------------
  // Sheet 2: Yearly Tabs (2026, 2025, 2024)
  // -------------------------------------------------------------
  const years = ['2026', '2025', '2024'];
  years.forEach((yr) => {
    const yearJobs = jobs.filter((j) => j.date && j.date.startsWith(yr));
    if (yearJobs.length > 0) {
      const yrSheet = workbook.addWorksheet(`Year ${yr}`);
      yrSheet.columns = [
        { header: 'Date', key: 'date', width: 14 },
        { header: 'Edition', key: 'edition', width: 20 },
        { header: 'Page', key: 'page_number', width: 12 },
        { header: 'Company', key: 'company', width: 30 },
        { header: 'Job Title', key: 'job_title', width: 30 },
        { header: 'Location', key: 'job_location', width: 22 },
        { header: 'Original Advertisement', key: 'original_advertisement', width: 50 },
        { header: 'Category', key: 'category', width: 20 },
      ];

      const yrHeader = yrSheet.getRow(1);
      yrHeader.height = 26;
      yrHeader.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0F766E' } }; // Teal
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFF' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      yearJobs.forEach((j) => {
        const r = yrSheet.addRow({
          date: j.date,
          edition: j.edition,
          page_number: j.page_number,
          company: j.company,
          job_title: j.job_title,
          job_location: j.job_location,
          original_advertisement: j.original_advertisement,
          category: j.category || '',
        });
        r.height = 30;
        r.eachCell((c) => {
          c.alignment = { vertical: 'top', wrapText: true };
        });
      });
    }
  });

  // -------------------------------------------------------------
  // Sheet 3: Summary Analytics & Statistics
  // -------------------------------------------------------------
  const analyticsSheet = workbook.addWorksheet('Summary & Analytics');
  
  // Title
  analyticsSheet.mergeCells('A1:E1');
  const titleCell = analyticsSheet.getCell('A1');
  titleCell.value = 'Prabhat Khabar Jharkhand Recruitment Extraction Summary (2024 - Present)';
  titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: '1E3A8A' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };

  analyticsSheet.addRow([]);

  // Stats table
  analyticsSheet.addRow(['Metric / Parameter', 'Count']);
  const statsHeader = analyticsSheet.getRow(3);
  statsHeader.eachCell((c) => {
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '334155' } };
    c.font = { color: { argb: 'FFFFFF' }, bold: true };
  });

  analyticsSheet.addRow(['Total Job Advertisements Extracted', jobs.length]);
  analyticsSheet.addRow(['Year 2026 Records', jobs.filter((j) => j.date?.startsWith('2026')).length]);
  analyticsSheet.addRow(['Year 2025 Records', jobs.filter((j) => j.date?.startsWith('2025')).length]);
  analyticsSheet.addRow(['Year 2024 Records', jobs.filter((j) => j.date?.startsWith('2024')).length]);
  analyticsSheet.addRow(['Ranchi Edition Records', jobs.filter((j) => j.edition?.toLowerCase().includes('ranchi')).length]);
  analyticsSheet.addRow(['Dhanbad Edition Records', jobs.filter((j) => j.edition?.toLowerCase().includes('dhanbad')).length]);
  analyticsSheet.addRow(['Jamshedpur Edition Records', jobs.filter((j) => j.edition?.toLowerCase().includes('jamshedpur')).length]);
  analyticsSheet.addRow(['Deoghar / Santhal Pargana Records', jobs.filter((j) => j.edition?.toLowerCase().includes('deoghar')).length]);
  analyticsSheet.addRow(['Bokaro / Steel City Records', jobs.filter((j) => j.edition?.toLowerCase().includes('bokaro')).length]);

  analyticsSheet.getColumn(1).width = 40;
  analyticsSheet.getColumn(2).width = 20;

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
