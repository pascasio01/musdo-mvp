export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl p-10 w-[90%] max-w-md shadow-2xl">
        
        <h1 className="text-4xl font-bold mb-4">
          MUSDO
        </h1>

        <p className="text-zinc-400 mb-8">
          Human music platform for composers.
        </p>

        <button className="w-full py-3 rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition">
          Enter Platform
        </button>

      </div>
    </div>
  )
}
