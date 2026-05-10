export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">

      <h1 className="text-5xl font-bold mb-3">
        BugLens AI 
      </h1>

      <p className="text-gray-400 mb-8 text-center">
        AI-powered debugging assistant for developers
      </p>

      <textarea
        placeholder="Paste error or code here..."
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-xl p-4 outline-none focus:border-blue-500"
      />

      <button className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition">
        Analyze Bug
      </button>

      <div className="w-full max-w-2xl mt-8 bg-zinc-900 border border-zinc-700 rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-3">
          AI Result
        </h2>
        <p className="text-gray-400">
          Your AI response will appear here...
        </p>
      </div>

    </div>
  );
}