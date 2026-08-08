import { Router, Request, Response } from 'express';
import { extractJobsFromPageImage } from './geminiService';
import { generateExcelWorkbook } from './excelService';
import { JobAd } from '../src/types';

export const apiRouter = Router();

// POST /api/extract-jobs
apiRouter.post('/extract-jobs', async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageBase64, mimeType, newspaper, edition, date, pageNumber } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'imageBase64 parameter is required' });
      return;
    }

    const metadata = {
      newspaper: newspaper || 'Prabhat Khabar',
      edition: edition || 'Ranchi City',
      date: date || new Date().toISOString().split('T')[0],
      pageNumber: pageNumber || 'Page 1',
    };

    const extracted = await extractJobsFromPageImage(
      imageBase64,
      mimeType || 'image/jpeg',
      metadata
    );

    res.json({
      success: true,
      extractedCount: extracted.length,
      jobs: extracted.map((item: any, idx: number) => ({
        id: `extracted-${Date.now()}-${idx}`,
        newspaper: metadata.newspaper,
        edition: metadata.edition,
        date: metadata.date,
        page_number: metadata.pageNumber,
        company: item.company || 'Unknown Organization',
        job_title: item.job_title || 'Unspecified Role',
        job_location: item.job_location || 'Jharkhand',
        original_advertisement: item.original_advertisement || '',
        category: item.category || 'Classifieds / Other',
        qualification: item.qualification || '',
        deadline: item.deadline || '',
        contact_info: item.contact_info || '',
        extractedAt: new Date().toISOString(),
        confidenceScore: 0.95,
      })),
    });
  } catch (error: any) {
    console.error('Error in /api/extract-jobs:', error);
    res.status(500).json({
      error: error.message || 'Failed to extract jobs from image using Gemini Vision.',
    });
  }
});

// POST /api/export-excel
apiRouter.post('/export-excel', async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobs } = req.body as { jobs: JobAd[] };

    if (!jobs || !Array.isArray(jobs)) {
      res.status(400).json({ error: 'jobs array parameter is required' });
      return;
    }

    const excelBuffer = await generateExcelWorkbook(jobs);

    const filename = `Prabhat_Khabar_Job_Ads_2024_to_Present_${Date.now()}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(excelBuffer);
  } catch (error: any) {
    console.error('Error exporting Excel:', error);
    res.status(500).json({ error: error.message || 'Failed to generate Excel file.' });
  }
});

// GET /api/proxy-image
apiRouter.get('/proxy-image', async (req: Request, res: Response): Promise<void> => {
  try {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      res.status(400).json({ error: 'url query parameter is required' });
      return;
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
        Referer: 'https://www.indupaper.com/',
      },
    });

    if (!response.ok) {
      res.status(response.status).send(`Failed to fetch image: ${response.statusText}`);
      return;
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(buffer);
  } catch (error: any) {
    console.error('Error proxying image:', error);
    res.status(500).send(`Image proxy error: ${error.message}`);
  }
});
