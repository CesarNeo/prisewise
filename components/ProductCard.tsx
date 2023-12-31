import { Product } from '@/types'
import { formatNumber } from '@/utils'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  product: Product
}

function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product._id}`} className="product-card">
      <div className="product-card_img-container">
        <Image
          src={product.image}
          alt={product.title}
          width={200}
          height={200}
          className="product-card_img"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="product-title">{product.title}</h3>

        <div className="flex justify-between gap-2">
          <p className="text-black/50 text-lg capitalize truncate">
            {product.category}
          </p>

          <p className="text-lg text-black font-semibold">
            <span>{product?.currency}</span>
            <span>{formatNumber(product?.currentPrice)}</span>
          </p>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
