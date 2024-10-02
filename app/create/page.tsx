'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface BannerImage {
  url: string;
  content_type: string;
}

interface BannerResponse {
  images: BannerImage[];
  prompt: string;
}

export default function CreatePage() {
  const [product, setProduct] = useState('')
  const [theme, setTheme] = useState('')
  const [customTheme, setCustomTheme] = useState('')
  const [additionalInput, setAdditionalInput] = useState('')
  const [size, setSize] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBanners, setGeneratedBanners] = useState<BannerResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-banner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: theme === 'custom' ? customTheme : theme,
          size,
          product,
          additionalInput,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate banner')
      }

      const data: BannerResponse = await response.json()
      setGeneratedBanners(data)
    } catch (error) {
      console.error('Error generating images:', error)
      setError('An error occurred while generating the banners. Showing placeholder images.')
      // Set placeholder data if the API call fails
      setGeneratedBanners({
        images: Array(4).fill({
          url: '/coke/1.png',
          content_type: 'image/png'
        }),
        prompt: 'Placeholder prompt for demonstration purposes'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-6 px-4 bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">AI Banner Generator</Link>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="/#features" className="text-white hover:text-gray-200 transition-colors">Features</Link></li>
              <li><Link href="/#how-it-works" className="text-white hover:text-gray-200 transition-colors">How It Works</Link></li>
              <li><Link href="/#pricing" className="text-white hover:text-gray-200 transition-colors">Pricing</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Create Your Banner</h1>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white p-8 rounded-lg shadow-md">
            <div>
              <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
                Product
              </label>
              <Select value={product} onValueChange={setProduct}>
                <SelectTrigger id="product" className="w-full">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coca-cola">Coca Cola</SelectItem>
                  <SelectItem value="mirinda">Mirinda</SelectItem>
                  <SelectItem value="cadbury">Cadbury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <div className="flex space-x-4">
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme" className="w-full">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diwali">Diwali</SelectItem>
                    <SelectItem value="holi">Holi</SelectItem>
                    <SelectItem value="christmas">Christmas</SelectItem>
                    <SelectItem value="republic-day">Republic Day</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {theme === 'custom' && (
                  <Input
                    type="text"
                    placeholder="Enter custom theme"
                    value={customTheme}
                    onChange={(e) => setCustomTheme(e.target.value)}
                    className="flex-grow"
                  />
                )}
              </div>
            </div>

            <div>
              <label htmlFor="additional-input" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Input
              </label>
              <Textarea
                id="additional-input"
                placeholder="Enter any additional information"
                value={additionalInput}
                onChange={(e) => setAdditionalInput(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger id="size" className="w-full">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                  <SelectItem value="portrait">Portrait</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              disabled={isGenerating} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Create Banner'}
            </Button>
          </form>

          {generatedBanners && (
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Generated Banners</h2>
              <p className="text-center text-gray-600 mb-6">Prompt: {generatedBanners.prompt}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {generatedBanners.images.map((image, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                    <img src={image.url} alt={`Generated banner ${index + 1}`} className="w-full h-auto rounded" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2023 AI Banner Generator. All rights reserved.</p>
          <nav className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors">Contact</a></li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  )
}