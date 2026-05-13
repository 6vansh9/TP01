import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { type, text } = await request.json()

  if (!text?.trim()) {
    return NextResponse.json({ success: false, error: "No text provided" })
  }

  const prompt = type === "linkedin"
    ? `You are extracting profile data. Given this LinkedIn profile text, return a JSON object.

TEXT: "${text}"

Return ONLY this JSON, no other text:
{
  "title": "their job title or role",
  "bio": "2-3 sentence professional summary",
  "skills": ["skill1", "skill2", "skill3"]
}`
    : `You are extracting resume data. Given this resume text, return a JSON object.

TEXT: "${text}"

Return ONLY this JSON, no other text:
{
  "title": "their job title",
  "bio": "2-3 sentence professional summary",
  "skills": ["skill1", "skill2"],
  "work_experience": [{"company": "name", "title": "role", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "description": "what they did"}],
  "education": [{"school": "name", "degree": "degree type", "field": "field of study", "startDate": "YYYY-MM", "endDate": "YYYY-MM"}]
}`

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1500,
      temperature: 0.1,
      messages: [
        { 
          role: "system", 
          content: "You are a JSON extractor. You ALWAYS respond with valid JSON only. No markdown, no backticks, no explanation. Just the JSON object." 
        },
        { role: "user", content: prompt }
      ]
    })
  })

  const data = await response.json()
  console.log("Groq response:", JSON.stringify(data, null, 2))
  
  const raw = data.choices?.[0]?.message?.content ?? "{}"
  console.log("Raw content:", raw)

  try {
    const clean = raw.replace(/```json|```/g, "").trim()
    const parsed = JSON.parse(clean)
    return NextResponse.json({ success: true, data: parsed })
  } catch {
    return NextResponse.json({ success: false, error: "Parse failed", raw })
  }
}
