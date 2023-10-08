'use server'

import { getAveragePrice, getHighestPrice, getLowestPrice } from '@/utils'
import Product from '../models/product.model'
import { connectToDatabase } from '../mongoose'
import { scrapeAmazonProduct } from '../scraper'
import { revalidatePath } from 'next/cache'
import { Product as ProductType, User } from '@/types'
import { generateEmailBody, sendEmail } from '../nodemailer'

export async function scrapeAndStoreProduct(productURL: string) {
  if (!productURL) return

  try {
    connectToDatabase()

    const scrapedProduct = await scrapeAmazonProduct(productURL)

    if (!scrapedProduct) return

    let product = scrapedProduct

    const existingProduct = await Product.findOne({ url: scrapedProduct.url })

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice }
      ]

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory)
      }
    }

    const newProduct = await Product.findOneAndUpdate(
      {
        url: scrapedProduct.url
      },
      product,
      {
        new: true,
        upsert: true
      }
    )

    revalidatePath(`/products/${newProduct._id}`)
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`)
  }
}

export async function getProductById(
  id: string
): Promise<ProductType | undefined> {
  try {
    connectToDatabase()

    const product = await Product.findOne({ _id: id })

    if (!product) return

    return product
  } catch (error) {
    console.error(error)
  }
}

export async function getAllProducts(): Promise<ProductType[] | undefined> {
  try {
    connectToDatabase()

    const products = await Product.find()

    return products
  } catch (error) {
    console.error(error)
  }
}

export async function getSimilarProducts(
  productId: string
): Promise<ProductType[] | undefined> {
  try {
    connectToDatabase()

    const currentProduct = await Product.findById(productId)

    if (!currentProduct) return

    const similarProducts = await Product.find({
      _id: { $ne: productId }
    }).limit(3)

    return similarProducts
  } catch (error) {
    console.error(error)
  }
}

export async function addUserEmailToProduct(
  productId: string,
  userEmail: string
) {
  try {
    const product = await Product.findById(productId)

    if (!product) return

    const userExists = product.users.some(
      (user: User) => user.email === userEmail
    )

    if (!userExists) {
      product.users.push({ email: userEmail })

      await product.save()

      const emailContent = await generateEmailBody(product, 'WELCOME')
      await sendEmail(emailContent, [userEmail])
    }
  } catch (error) {
    console.error(error)
  }
}
