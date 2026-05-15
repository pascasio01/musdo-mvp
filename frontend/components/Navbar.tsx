export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 text-white">
      <div className="flex justify-around py-4 text-sm">
        <span>Home</span>
        <span>Discover</span>
        <span>Vault</span>
        <span>Market</span>
        <span>Profile</span>
      </div>
    </nav>
  )
}
