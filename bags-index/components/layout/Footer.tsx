export default function Footer() {
  return (
    <footer className="border-t border-[#222222] py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[#888888] text-sm font-mono">
          Built for the <span className="text-[#00FF87]">Bags Hackathon</span>
        </p>
        <div className="flex items-center gap-6 text-sm text-[#888888]">
          <a href="https://bags.fm" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">bags.fm</a>
          <a href="https://docs.bags.fm" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Docs</a>
          <a href="https://discord.gg/bags" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Discord</a>
          <a href="https://twitter.com/bagsfm" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  )
}
