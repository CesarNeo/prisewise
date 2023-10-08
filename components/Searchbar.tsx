'use client'

import { scrapeAndStoreProduct } from '@/lib/actions'
import { isValidAmazonProductURL } from '@/utils'
import { FormEvent, useState } from 'react'

function Searchbar() {
  const [searchPrompt, setSearchPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const isValidLink = isValidAmazonProductURL(searchPrompt)

    if (!isValidLink) {
      return alert('Please provide a valid Amazon product link')
    }

    try {
      setIsLoading(true)

      const product = await scrapeAndStoreProduct(searchPrompt)
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
        placeholder="Enter product link"
        className="searchbar-input"
        onChange={({ target: { value } }) => setSearchPrompt(value)}
        value={searchPrompt}
      />

      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchPrompt === ''}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}

export default Searchbar
