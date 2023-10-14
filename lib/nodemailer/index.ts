'use server'

import nodemailer from 'nodemailer'

import { EmailContent, EmailProductInfo, NotificationType } from '@/types'

const NOTIFICATION = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET'
}

const transporter = nodemailer.createTransport({
  pool: true,
  service: 'hotmail',
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  maxConnections: 1
})

export async function generateEmailBody(
  product: EmailProductInfo,
  type: NotificationType
) {
  const THRESHOLD_PERCENTAGE = 40
  const shortenedTitle =
    product.title.length > 20
      ? `${product.title.substring(0, 20)}...`
      : product.title

  let subject = ''
  let body = ''

  switch (type) {
    case NOTIFICATION.WELCOME:
      subject = `Bem-vindo ao Rastreamento de Preços para ${shortenedTitle}`
      body = `
        <div>
          <h2>Bem-vindo ao PriceWise 🚀</h2>
          <p>Agora você está rastreando ${product.title}.</p>
          <p>Aqui está um exemplo de como você receberá atualizações:</p>
          <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
            <h3>${product.title} está de volta ao estoque!</h3>
            <p>Estamos animados em informar que ${product.title} agora está de volta ao estoque.</p>
            <p>Não perca - <a href="${product.url}" target="_blank" rel="noopener noreferrer">compre agora</a>!</p>
            <img src="https://i.ibb.co/pwFBRMC/Screenshot-2023-09-26-at-1-47-50-AM.png" alt="Imagem do Produto" style="max-width: 100%;" />
          </div>
          <p>Fique atento para mais atualizações sobre ${product.title} e outros produtos que você está rastreando.</p>
        </div>
      `
      break

    case NOTIFICATION.CHANGE_OF_STOCK:
      subject = `${shortenedTitle} is now back in stock!`
      body = `
        <div>
          <h4>Hey, ${product.title} is now restocked! Grab yours before they run out again!</h4>
          <p>See the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `
      break

    case NOTIFICATION.LOWEST_PRICE:
      subject = `Lowest Price Alert for ${shortenedTitle}`
      body = `
        <div>
          <h4>Hey, ${product.title} has reached its lowest price ever!!</h4>
          <p>Grab the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a> now.</p>
        </div>
      `
      break

    case NOTIFICATION.THRESHOLD_MET:
      subject = `Discount Alert for ${shortenedTitle}`
      body = `
        <div>
          <h4>Hey, ${product.title} is now available at a discount more than ${THRESHOLD_PERCENTAGE}%!</h4>
          <p>Grab it right away from <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `
      break

    default:
      throw new Error('Invalid notification type.')
  }

  return { subject, body }
}

export async function sendEmail(emailContent: EmailContent, sendTo: string[]) {
  const emailOptions = {
    from: process.env.EMAIL_USER,
    to: sendTo,
    html: emailContent.body,
    subject: emailContent.subject
  }

  transporter.sendMail(emailOptions, (err, info) => {
    if (err) {
      return console.error(err)
    }
  })
}
