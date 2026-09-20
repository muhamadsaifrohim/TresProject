type PagePlaceholderProps = {
  title: string
  description: string
}

// Tampilan sementara untuk halaman yang designnya belum dikerjakan
export default function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-5 pb-20 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-xl text-lg text-white/80">{description}</p>
    </section>
  )
}