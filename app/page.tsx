import HeroCarousel from '@/components/HeroCarousel'
import ProductCard from '@/components/ProductCard'
import Searchbar from '@/components/Searchbar'
import { getAllProducts } from '@/lib/actions'
import Image from 'next/image'

async function Home() {
  const products = await getAllProducts()

  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              A compra inteligente começa aqui:
              <Image
                src="/assets/icons/arrow-right.svg"
                width={16}
                height={16}
                alt="arrow-right"
              />
            </p>
            <h1 className="head-text">
              Use o poder do
              <span className="text-primary"> PriceWise</span>
            </h1>
            <p className="mt-6">
              Acompanhe os preços dos produtos sem esforço e economize dinheiro
              em suas compras online.
            </p>

            <Searchbar />
          </div>

          <HeroCarousel />
        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-text">Produtos em destaque</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {products?.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  )
}

export default Home
