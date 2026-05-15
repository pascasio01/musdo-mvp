export default function Vault() {
  return (
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-3xl font-bold mb-2">
        Composer Vault
      </h1>

      <p className="text-zinc-400 mb-8">
        Secure demos, lyrics and song licensing.
      </p>

      {/* Upload Cards */}

      <div className="space-y-4">

        <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
          <h2 className="text-xl font-semibold">
            Upload Demo
          </h2>

          <p className="text-zinc-400 mt-2 text-sm">
            Upload MP3, WAV or demo recordings.
          </p>

          <button className="mt-4 px-4 py-2 rounded-xl bg-white text-black font-medium">
            Upload Audio
          </button>
        </div>

        <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
          <h2 className="text-xl font-semibold">
            Upload Lyrics
          </h2>

          <p className="text-zinc-400 mt-2 text-sm">
            Protect and store your lyrics securely.
          </p>

          <button className="mt-4 px-4 py-2 rounded-xl bg-white text-black font-medium">
            Upload Lyrics
          </button>
        </div>

        <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
          <h2 className="text-xl font-semibold">
            Song Passport
          </h2>

          <p className="text-zinc-400 mt-2 text-sm">
            Generate proof of ownership and timestamps.
          </p>

          <button className="mt-4 px-4 py-2 rounded-xl bg-white text-black font-medium">
            Generate Passport
          </button>
        </div>

      </div>

    </div>
  )
}
