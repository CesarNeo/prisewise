'use client'

import Image from 'next/image'
import { Carousel } from 'react-responsive-carousel'

import 'react-responsive-carousel/lib/styles/carousel.min.css'

const HERO_IMAGES = [
  {
    imgURL: '/assets/images/hero-1.svg',
    alt: 'smartwatch'
  },
  {
    imgURL: '/assets/images/hero-2.svg',
    alt: 'bag'
  },
  {
    imgURL: '/assets/images/hero-3.svg',
    alt: 'lamp'
  },
  {
    imgURL: '/assets/images/hero-4.svg',
    alt: 'air fryer'
  },
  {
    imgURL: '/assets/images/hero-5.svg',
    alt: 'chair'
  }
]

function HeroCarousel() {
  return (
    <div className="hero-carousel">
      <Carousel
        showStatus={false}
        autoPlay
        infiniteLoop
        interval={2000}
        showArrows={false}
        showThumbs={false}
      >
        {HERO_IMAGES.map(({ imgURL, alt }) => (
          <Image
            key={alt}
            src={imgURL}
            width={484}
            height={484}
            alt={alt}
            className="object-contain"
          />
        ))}
      </Carousel>

      <Image
        src="/assets/icons/hand-drawn-arrow.svg"
        alt="arrow"
        width={175}
        height={175}
        className="max-xl:hidden -left-[15%] bottom-0 z-0 absolute"
      />
    </div>
  )
}

export default HeroCarousel
