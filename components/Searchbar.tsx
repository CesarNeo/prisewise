'use client'

import { scrapeAndStoreProduct } from '@/lib/actions'
import { isValidAmazonProductURL } from '@/utils'
import { ElementRef, FormEvent, useRef, useState } from 'react'

function Searchbar() {
  const searchPromptRef = useRef<ElementRef<'input'>>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const searchPrompt = searchPromptRef.current?.value

    if (!searchPrompt) return

    const isValidLink = isValidAmazonProductURL(searchPrompt)

    if (!isValidLink) {
      return alert('Por favor, forneça um link de produto Amazon válido')
    }

    try {
      setIsLoading(true)

      await scrapeAndStoreProduct(searchPrompt)

      setIsLoading(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Cole o link do produto aqui, apenas produtos Amazon"
        className="searchbar-input"
        ref={searchPromptRef}
      />

      <button type="submit" className="searchbar-btn" disabled={isLoading}>
        {isLoading ? 'Analisando...' : 'Buscar'}
      </button>
    </form>
  )
}

export default Searchbar
