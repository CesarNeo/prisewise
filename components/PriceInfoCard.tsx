import Image from 'next/image'

type Props = {
  title: string
  iconSrc: string
  value: string
  borderColor: string
}
function PriceInfoCard({ title, borderColor, iconSrc, value }: Props) {
  return (
    <div
      className="price-info_card border-l"
      style={{
        borderLeftColor: borderColor
      }}
    >
      <p className="text-base text-black-100">{title}</p>

      <div className="flex gap-1">
        <Image src={iconSrc} alt={title} width={24} height={24} />

        <p className="text-2xl font-bold text-secondary">{value}</p>
      </div>
    </div>
  )
}

export default PriceInfoCard
