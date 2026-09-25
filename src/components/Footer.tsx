import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Logo size={22} />
          <p className="max-w-md text-[13px] leading-relaxed text-muted">
            AgriSense provides market estimates, not guaranteed selling prices. Actual prices may
            vary by location, quality, buyer, transportation costs, and market conditions.
          </p>
        </div>
        <div className="mt-6 border-t border-line pt-6 text-[12px] text-muted">
          © {new Date().getFullYear()} AgriSense. Sample data shown for demonstration.
        </div>
      </div>
    </footer>
  )
}
