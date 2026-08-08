export function getInduPaperUrl(job?: {
  edition?: string;
  date?: string;
  page_number?: string;
}): string {
  if (!job) {
    return 'https://www.indupaper.com/';
  }

  const editionLower = (job.edition || '').toLowerCase();
  let city = 'ranchi';
  if (editionLower.includes('dhanbad') || editionLower.includes('bokaro') || editionLower.includes('giridih')) {
    city = 'dhanbad';
  } else if (editionLower.includes('jamshedpur')) {
    city = 'jamshedpur';
  } else if (editionLower.includes('deoghar') || editionLower.includes('santhal') || editionLower.includes('dumka')) {
    city = 'deoghar';
  }

  const dateStr = job.date || '';
  const pageMatch = job.page_number ? job.page_number.match(/\d+/) : null;
  const pageNum = pageMatch ? pageMatch[0] : '1';

  // InduPaper free viewer portal link with parameters for Prabhat Khabar
  return `https://www.indupaper.com/epaper/prabhat-khabar?city=${city}&date=${dateStr}&page=${pageNum}`;
}

export function getOfficialEpaperUrl(job: {
  edition: string;
  date: string;
  page_number: string;
}): string {
  const editionLower = (job.edition || '').toLowerCase();

  let group = 'ranchi';
  let editionSlug = 'ranchi-city';

  if (editionLower.includes('dhanbad') || editionLower.includes('coalfield')) {
    group = 'dhanbad';
    editionSlug = 'dhanbad-city';
  } else if (editionLower.includes('jamshedpur')) {
    group = 'jamshedpur';
    editionSlug = 'jamshedpur-city';
  } else if (editionLower.includes('deoghar') || editionLower.includes('santhal') || editionLower.includes('dumka')) {
    group = 'deoghar';
    editionSlug = 'deoghar-city';
  } else if (editionLower.includes('bokaro')) {
    group = 'dhanbad';
    editionSlug = 'bokaro';
  } else if (editionLower.includes('hazaribagh')) {
    group = 'ranchi';
    editionSlug = 'hazaribagh';
  } else if (editionLower.includes('giridih')) {
    group = 'dhanbad';
    editionSlug = 'giridih';
  }

  // Extract page number digit
  const pageMatch = job.page_number ? job.page_number.match(/\d+/) : null;
  const pageNum = pageMatch ? pageMatch[0] : '1';

  return `https://epaper.prabhatkhabar.com/${group}/${editionSlug}/${job.date}/${pageNum}`;
}

export function getEpaperPageUrl(
  job: {
    edition: string;
    date: string;
    page_number: string;
  },
  source: 'indupaper' | 'official' = 'indupaper'
): string {
  if (source === 'indupaper') {
    return getInduPaperUrl(job);
  }
  return getOfficialEpaperUrl(job);
}

