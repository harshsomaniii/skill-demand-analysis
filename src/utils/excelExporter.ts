import ExcelJS from 'exceljs';
import { JobAd } from '../types';

export async function exportJobsToExcelClient(jobs: JobAd[], filename?: string): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Prabhat Khabar E-Paper Intelligence Tool';
  workbook.lastModifiedBy = 'Prabhat Khabar E-Paper Intelligence Tool';
  workbook.created = new Date();

  // Master Sheet
  const sheet1 = workbook.addWorksheet('Job Advertisements');
  sheet1.columns = [
    { header: 'Newspaper', key: 'newspaper', width: 20 },
    { header: 'Edition', key: 'edition', width: 24 },
    { header: 'Date', key: 'date', width: 14 },
    { header: 'Page Number', key: 'page_number', width: 16 },
    { header: 'Company / Organization', key: 'company', width: 36 },
    { header: 'Job Title / Designation', key: 'job_title', width: 36 },
    { header: 'Job Location', key: 'job_location', width: 24 },
    { header: 'Original Advertisement (Verbatim)', key: 'original_advertisement', width: 70 },
  ];

  const headerRow = sheet1.getRow(1);
  headerRow.height = 32;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1E3A8A' },
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
    });

    row.height = 38;
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
        horizontal: colNumber === 3 || colNumber === 4 ? 'center' : 'left',
        wrapText: true,
      };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
        right: { style: 'thin', color: { argb: 'F1F5F9' } },
      };
    });
  });

  sheet1.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: jobs.length + 1, column: 8 },
  };

  // Yearly Sheets
  const years = ['2026', '2025', '2024', '2023'];
  years.forEach((yr) => {
    const yearJobs = jobs.filter((j) => j.date && j.date.startsWith(yr));
    if (yearJobs.length > 0) {
      const yrSheet = workbook.addWorksheet(`Year ${yr}`);
      yrSheet.columns = [
        { header: 'Newspaper', key: 'newspaper', width: 18 },
        { header: 'Edition', key: 'edition', width: 22 },
        { header: 'Date', key: 'date', width: 14 },
        { header: 'Page Number', key: 'page_number', width: 14 },
        { header: 'Company / Organization', key: 'company', width: 32 },
        { header: 'Job Title / Designation', key: 'job_title', width: 32 },
        { header: 'Job Location', key: 'job_location', width: 22 },
        { header: 'Original Advertisement (Verbatim)', key: 'original_advertisement', width: 60 },
      ];

      const yrHeader = yrSheet.getRow(1);
      yrHeader.height = 28;
      yrHeader.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0F766E' } };
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFF' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      yearJobs.forEach((j) => {
        const r = yrSheet.addRow({
          newspaper: j.newspaper || 'Prabhat Khabar',
          edition: j.edition || '',
          date: j.date || '',
          page_number: j.page_number || '',
          company: j.company || '',
          job_title: j.job_title || '',
          job_location: j.job_location || '',
          original_advertisement: j.original_advertisement || '',
        });
        r.height = 32;
        r.eachCell((c) => {
          c.alignment = { vertical: 'top', wrapText: true };
        });
      });
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `Prabhat_Khabar_Job_Ads_2024_to_Present_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
