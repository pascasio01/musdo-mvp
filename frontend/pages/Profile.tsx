export default function Profile() {
  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* HEADER */}

      <div className="flex items-center gap-4 mb-8">

        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600" />

        <div>
          <h1 className="text-3xl font-bold">
            Emmanuel Reyes
          </h1>

          <p className="text-zinc-400">
            Composer · Bachata · Human Verified
          </p>
        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-3 gap-4 mb-8">

        <div className="rounded-2xl bg-white/10 border border-white/10 p-4 text-center">
          <h2 className="text-2xl font-bold">
            24
          </h2>

          <p className="text-zinc-400 text-sm">
            Songs
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 border border-white/10 p-4 text-center">
          <h2 className="text-2xl font-bold">
            12K
          </h2>

          <p className="text-zinc-400 text-sm">
            Streams
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 border border-white/10 p-4 text-center">
          <h2 className="text-2xl font-bold">
            8
          </h2>

          <p className="text-zinc-400 text-sm">
            Licenses
          </p>
        </div>

      </div>

      {/* SONGS */}

      <div className="space-y-4">

        <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
          <h2 className="text-xl font-semibold">
            Salgo a la calle
          </h2>

          <p className="text-zinc-400 mt-1 text-sm">
            Modern Bachata · Human Verified
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
          <h2 className="text-xl font-semibold">
            Sabor a miel
          </h2>

          <p className="text-zinc-400 mt-1 text-sm">
            Romantic Bachata · Demo Available
          </p>
        </div>

      </div>

    </div>
  )
}
