import Image from 'next/image'
import Link from 'next/link'

const NAV_ICONS = [
  {
    src: '/assets/icons/search.svg',
    alt: 'search'
  },
  {
    src: '/assets/icons/black-heart.svg',
    alt: 'heart'
  },
  {
    src: '/assets/icons/user.svg',
    alt: 'user'
  }
]

function Navbar() {
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/icons/logo.svg"
            width={28}
            height={28}
            alt="logo"
            className="h-7 w-7"
          />

          <p className="nav-logo">
            Price<span className="text-primary">Wise</span>
          </p>
        </Link>

        <div className="flex items-center gap-5">
          {NAV_ICONS.map(({ src, alt }) => (
            <Image
              key={alt}
              src={src}
              width={28}
              height={28}
              alt={alt}
              className="object-contain h-7 w-7 "
            />
          ))}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
