export default function Market() {
  const songs = [
    {
      title: 'Midnight Bachata',
      genre: 'Modern Bachata',
      type: 'Exclusive License',
      price: '$499'
    },
    {
      title: 'Broken Halo',
      genre: 'Latin Pop',
      type: 'Non-Exclusive License',
      price: '$149'
    },
    {
      title: 'Noches Sin Ti',
      genre: 'Romantic Bachata',
      type: 'Demo Available',
      price: '$299'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-3xl font-bold mb-2">
        MUSDO Market
      </h1>

      <p className="text-zinc-400 mb-8">
        Discover human-created songs ready for licensing.
      </p>

      <div className="space-y-4">
        {songs.map((song) => (
          <div
            key={song.title}
            className="rounded-2xl bg-white/10 border border-white/10 p-5"
          >
            <h2 className="text-xl font-semibold">
              {song.title}
            </h2>

            <p className="text-zinc-400 text-sm mt-1">
              {song.genre} · {song.type}
            </p>

            <div className="flex items-center justify-between mt-4">
              <span className="font-semibold">
                {song.price}
              </span>

              <button className="px-4 py-2 rounded-xl bg-white text-black font-medium">
                Request License
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
