"use client";

import { useState } from "react";

export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const analyzeBug = async () => {
    if (!textInput && !image) {
      alert("Please enter error text or upload a screenshot");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const formData = new FormData();
      if (textInput) formData.append("code", textInput);
      if (image) formData.append("image", image);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setResult(data.analysis);
      } else {
        setResult("Error: " + (data.error || "Something went wrong"));
      }
    } catch (error) {
      setResult("Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-6xl font-bold mb-3"> BugLens AI</h1>
          <p className="text-gray-400 text-xl">
            AI-Powered Debugging Assistant
          </p>
        </div>

        {/* Input Area */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8">
          <textarea
            rows="6"
            placeholder="Paste your error message, stack trace, or code here..."
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-5 outline-none focus:border-blue-500 text-lg resize-y"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />

          {/* Screenshot Upload */}
          <div className="mt-6">
            <p className="text-sm text-gray-400 mb-3">Or upload error screenshot</p>
            
            <label className="border-2 border-dashed border-zinc-700 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="text-4xl mb-3"></span>
              <span className="font-medium">Click to upload screenshot</span>
              <span className="text-sm text-gray-500 mt-1">PNG, JPG, WebP supported</span>
            </label>

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 rounded-xl border border-zinc-700 mx-auto"
                />
                <button
                  onClick={() => { setImage(null); setImagePreview(null); }}
                  className="text-red-400 text-sm mt-2 hover:underline"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <button
            onClick={analyzeBug}
            disabled={loading}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 py-4 rounded-xl font-semibold text-lg transition"
          >
            {loading ? "Analyzing with AI..." : " Analyze Bug"}
          </button>
        </div>

        {/* Result Area */}
        {result && (
          <div className="mt-8 bg-zinc-900 border border-zinc-700 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Analysis Result</h2>
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                 Copy
              </button>
            </div>
            
            <div className="bg-zinc-950 p-6 rounded-xl text-gray-200 whitespace-pre-line leading-relaxed">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}