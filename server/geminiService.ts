import { GoogleGenAI, Type } from "@google/genai";

export async function extractJobsFromPageImage(
  imageBase64: string,
  mimeType: string,
  metadata: { newspaper: string; edition: string; date: string; pageNumber: string }
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const promptText = `You are an expert newspaper document parser specializing in Indian e-papers (specifically Prabhat Khabar, Dainik Jagran, etc.).
Analyze this newspaper page image from ${metadata.newspaper} (${metadata.edition} edition, Date: ${metadata.date}, ${metadata.pageNumber}).

Identify ALL job advertisements, recruitment notices, walk-in interview calls, government recruitment notifications, school/college faculty vacancies, banking jobs, PSU employment alerts, hospital/medical vacancies, and classified job postings on this page.

For EACH job advertisement found on the page, extract:
1. company: Organization, Department, School, University, Company, PSU, or Firm name publishing the ad.
2. job_title: Specific post(s), designation, role(s), or title(s) mentioned (e.g. Assistant Professor, Junior Overman, PGT Teachers, Staff Nurse, Software Engineer).
3. job_location: City, district, or address where the job is located. If state is Jharkhand, mention city/Jharkhand.
4. original_advertisement: The full, verbatim or exact text snippet of the advertisement as printed in the newspaper in Hindi or English.
5. category: One of ['Government / PSU', 'Private Sector', 'Education & Academic', 'Healthcare & Hospitals', 'Banking & Finance', 'Classifieds / Other'].
6. qualification: Required education, experience, degrees, or certifications mentioned.
7. deadline: Last date for application or walk-in interview date.
8. contact_info: Phone number, email address, physical address, or website mentioned.

If NO job advertisements exist on this newspaper page, return an empty array.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: imageBase64,
          },
        },
        {
          text: promptText,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        description: "List of extracted recruitment job advertisements from the page",
        items: {
          type: Type.OBJECT,
          properties: {
            company: { type: Type.STRING, description: "Name of the hiring organization" },
            job_title: { type: Type.STRING, description: "Job designations / roles" },
            job_location: { type: Type.STRING, description: "Location / City / Address" },
            original_advertisement: { type: Type.STRING, description: "Complete text content of advertisement" },
            category: { 
              type: Type.STRING, 
              enum: [
                'Government / PSU', 
                'Private Sector', 
                'Education & Academic', 
                'Healthcare & Hospitals', 
                'Banking & Finance', 
                'Classifieds / Other'
              ]
            },
            qualification: { type: Type.STRING, description: "Required qualification or experience" },
            deadline: { type: Type.STRING, description: "Last date or interview date" },
            contact_info: { type: Type.STRING, description: "Phone, email, or website" },
          },
          required: ["company", "job_title", "job_location", "original_advertisement"],
        },
      },
    },
  });

  const jsonText = response.text ? response.text.trim() : "[]";
  try {
    const parsed = JSON.parse(jsonText);
    return parsed;
  } catch (e) {
    console.error("Failed to parse Gemini output as JSON:", jsonText);
    return [];
  }
}
