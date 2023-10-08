import Product from '@/lib/models/product.model'
import { connectToDatabase } from '@/lib/mongoose'
import { generateEmailBody, sendEmail } from '@/lib/nodemailer'
import { scrapeAmazonProduct } from '@/lib/scraper'
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice
} from '@/utils'
import { User } from '@/types'
import { NextResponse } from 'next/server'

export const maxDuration = 300 // 5 minutes
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    connectToDatabase()

    const products = await Product.find({})

    if (!products) throw new Error('No products found')

    const updatedProducts = await Promise.all(
      products.map(async product => {
        const scrapedProduct = await scrapeAmazonProduct(product.url)

        if (!scrapedProduct) throw new Error('No product found')

        const updatedPriceHistory = [
          ...product.priceHistory,
          { price: scrapedProduct.currentPrice }
        ]

        const newProduct = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory)
        }

        const updatedProduct = await Product.findOneAndUpdate(
          {
            url: newProduct.url
          },
          newProduct
        )

        const emailNotificationType = getEmailNotifType(scrapedProduct, product)

        if (emailNotificationType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url
          }

          const emailContent = await generateEmailBody(
            productInfo,
            emailNotificationType
          )

          const userEmails = updatedProduct.users.map(
            (user: User) => user.email
          )

          await sendEmail(emailContent, userEmails)
        }

        return updatedProduct
      })
    )

    return NextResponse.json({
      message: 'OK',
      data: updatedProducts
    })
  } catch (error) {
    throw new Error(`Error in GET: ${error}`)
  }
}
