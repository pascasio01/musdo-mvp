export default function Login() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <div className="w-full max-w-md rounded-3xl bg-white/10 border border-white/10 backdrop-blur-xl p-8">

        <h1 className="text-3xl font-bold mb-2">
          Welcome Back
        </h1>

        <p className="text-zinc-400 mb-8">
          Login to access MUSDO.
        </p>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 outline-none"
          />

          <button className="w-full py-4 rounded-2xl bg-white text-black font-semibold">
            Login
          </button>

        </div>

      </div>

    </div>
  )
}
