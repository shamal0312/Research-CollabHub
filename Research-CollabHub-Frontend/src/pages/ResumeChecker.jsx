import { useState } from "react";
import Header from "../components/Header";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker?url";
import { FaFileUpload, FaCheckCircle, FaTimesCircle, FaChartLine, FaStar, FaExclamationTriangle, FaRegFileAlt } from "react-icons/fa";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const ResumeChecker = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const extractPDFText = async (file) => {
    const buffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: buffer
    }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      text += content.items.map((item) => item.str).join(" ");
      text += " ";
    }

    return text;
  };

  const analyzeResume = (text) => {
    text = text.toLowerCase();

    let score = 0;
    const checks = [];
    const suggestions = [];

    const rules = [
      ["skills", 15],
      ["education", 15],
      ["experience", 15],
      ["project", 15],
      ["github", 10],
      ["linkedin", 10],
      ["certificate", 10],
      ["@", 5]
    ];

    rules.forEach(([word, points]) => {
      const found = text.includes(word);

      checks.push({
        label: `${word} found`,
        passed: found
      });

      if (found) score += points;
      else suggestions.push(`Add ${word}`);
    });

    if (score > 100) score = 100;

    let status = "Needs Improvement";

    if (score >= 80) status = "Excellent Resume";
    else if (score >= 60) status = "Good Resume";

    return { score, status, checks, suggestions };
  };

  const handleCheck = async () => {
    if (!file) return alert("Choose PDF");

    try {
      setLoading(true);

      const text = await extractPDFText(file);
      const data = analyzeResume(text);

      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Could not read PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* HEADER SECTION */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-6">
            <FaRegFileAlt className="text-white text-3xl" />
          </div>
          <h1 className="text-5xl font-bold text-black mb-4">
            Resume Score Checker
          </h1>
          <p className="text-xl text-gray-600">
            Upload your resume to get instant feedback and improvement suggestions
          </p>
        </div>

        {/* UPLOAD SECTION */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 mb-8">
          <div className="mb-6">
            <label className="block text-lg font-semibold text-black mb-3">
              Upload Resume (PDF)
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="flex items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-black transition-colors bg-gray-50 hover:bg-gray-100"
              >
                {file ? (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                      <FaFileUpload className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-black">{file.name}</p>
                      <p className="text-sm text-gray-600">PDF Selected</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <FaFileUpload className="text-gray-600 text-2xl" />
                    </div>
                    <p className="text-lg font-semibold text-black mb-2">Click to upload PDF</p>
                    <p className="text-sm text-gray-600">or drag and drop</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <button
            onClick={handleCheck}
            disabled={!file || loading}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              !file || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Checking Resume...
              </>
            ) : (
              <>
                <FaChartLine />
                Check Resume
              </>
            )}
          </button>
        </div>

        {/* RESULTS SECTION */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
            {/* SCORE HEADER */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${result.score >= 80 ? 'bg-green-100' : result.score >= 60 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                <span className={`text-3xl font-bold ${result.score >= 80 ? 'text-green-600' : result.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {result.score}%
                </span>
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${result.score >= 80 ? 'text-green-600' : result.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {result.status}
              </h2>
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-xl ${i < Math.floor(result.score / 20) ? (result.score >= 80 ? 'text-green-500' : result.score >= 60 ? 'text-yellow-500' : 'text-red-500') : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            {/* CHECKS LIST */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                Resume Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.checks.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.passed ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {item.passed ? (
                        <FaCheckCircle className="text-green-600 text-sm" />
                      ) : (
                        <FaTimesCircle className="text-red-600 text-sm" />
                      )}
                    </div>
                    <span className={`font-medium ${
                      item.passed ? 'text-black' : 'text-gray-600'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SUGGESTIONS */}
            {result.suggestions.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                  <FaExclamationTriangle className="text-yellow-600" />
                  Improvement Suggestions
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <ul className="space-y-3">
                    {result.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-yellow-700 text-sm font-bold">{i + 1}</span>
                        </div>
                        <span className="text-gray-800">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeChecker;