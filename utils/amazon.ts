import { PriceHistoryItem, Product } from '@/types'

const NOTIFICATION = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET'
}

const THRESHOLD_PERCENTAGE = 40

export function isValidAmazonProductURL(url: string) {
  try {
    const parsedURL = new URL(url)
    const { hostname } = parsedURL

    if (!hostname.includes('amazon.com.br')) {
      return 'Por favor, forneça um link de produto Amazon do Brasil'
    }

    if (
      hostname.includes('amazon.com') ||
      hostname.includes('amazon.') ||
      hostname.endsWith('amazon')
    ) {
      return true
    }
  } catch (error) {
    return false
  }

  return false
}

export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text().trim()

    if (priceText) {
      const valueInCents =
        parseFloat(
          priceText.replace('R$', '').replace(/\./g, '').replace(',', '.')
        ) * 100

      return valueInCents || 0
    }
  }

  return ''
}

export function extractCurrency(element: any) {
  const currencyText = element.text().trim().slice(0, 2)
  return currencyText ? currencyText : ''
}

export function extractDescription($: any) {
  const selectors = ['.a-unordered-list .a-list-item', '.a-expander-content p']

  for (const selector of selectors) {
    const elements = $(selector)
    if (elements.length > 0) {
      const textContent = elements
        .map((_: any, element: any) => $(element).text().trim())
        .get()
        .join('\n')
      return textContent
    }
  }

  return ''
}

export function extractStars($: any) {
  const stars = $('#acrPopover').attr('title')
  return stars ? parseFloat(stars.split(' ')[0]) : 0
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
  const highestPrice = priceList.reduce((acc, curr) => {
    if (curr.price > acc.price) {
      return curr
    }

    return acc
  }, priceList[0])

  return highestPrice.price
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  const lowestPrice = priceList.reduce((acc, curr) => {
    if (curr.price < acc.price) {
      return curr
    }

    return acc
  }, priceList[0])

  return lowestPrice.price
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0)
  const averagePrice = sumOfPrices / priceList.length || 0

  return averagePrice
}

export const getEmailNotifType = (
  scrapedProduct: Product,
  currentProduct: Product
) => {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory)

  if (scrapedProduct.currentPrice < lowestPrice) {
    return NOTIFICATION.LOWEST_PRICE as keyof typeof NOTIFICATION
  }
  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return NOTIFICATION.CHANGE_OF_STOCK as keyof typeof NOTIFICATION
  }
  if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
    return NOTIFICATION.THRESHOLD_MET as keyof typeof NOTIFICATION
  }

  return null
}

export const formatNumber = (num: number = 0) => {
  const convertCentsToReal = num / 100

  return convertCentsToReal.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
