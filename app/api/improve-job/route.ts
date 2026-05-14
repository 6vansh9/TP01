import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      )
    }

    const prompt = `You are an expert job posting writer. Improve the following job posting title and description to be more professional, detailed, and attractive to top talent.

Original title: ${title}
Original description: ${description}

Return ONLY a valid JSON object with this exact structure:
{
  "title": "improved professional title",
  "description": "improved detailed description"
}

Make the title compelling and specific. Expand the description to include:
- Clear project overview
- Specific responsibilities
- Required skills and qualifications
- What makes this opportunity attractive
- Any other relevant details that would help attract great candidates

Keep the description professional but engaging. Return ONLY the JSON, no other text.`

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Groq API error:", errorText)
      return NextResponse.json(
        { error: "Failed to improve job description" },
        { status: 500 }
      )
    }

    const data = await response.json()
    const improvedContent = JSON.parse(data.choices[0].message.content)

    return NextResponse.json(improvedContent)
  } catch (error) {
    console.error("Error improving job:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
