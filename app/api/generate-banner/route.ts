import { NextRequest, NextResponse } from 'next/server'

interface BannerImage {
  url: string;
  content_type: string;
}

interface BannerResponse {
  images: BannerImage[];
  prompt: string;
}

export async function POST(request: NextRequest) {
  try {
    const { theme, size, product, additionalInput } = await request.json()

    // Validate input
    if (!theme || !size || !product) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const requestBody = {
      product_name: product, // Assuming 'product' maps to 'product_name'
      theme,
      extra_input: additionalInput, // Assuming 'additionalInput' maps to 'extra_input'
      promotional_offer: size, // Assuming 'size' maps to 'promotional_offer'; adjust if this is incorrect
    };

    // Make the actual API call to generate banners
    const response = await fetch('https://ai-banner-generator-backend-74430738063.us-central1.run.app/generate-ad', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`)
    }

    const data: BannerResponse = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error generating banner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}