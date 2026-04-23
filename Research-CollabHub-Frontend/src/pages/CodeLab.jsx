import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import axios from "../api/axios";
import Editor from "@monaco-editor/react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  FaFolder,
  FaFile,
  FaPlay,
  FaSave,
  FaTerminal,
  FaChevronRight,
  FaChevronDown,
  FaJs,
  FaPython,
  FaJava,
  FaCode,
  FaPlus,
  FaEllipsisV,
  FaSearch,
  FaCog,
  FaBug,
  FaRocket,
  FaDownload
} from "react-icons/fa";

const CodeLab = () => {
  const { workspaceId } = useParams();

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [output, setOutput] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});

  const fetchLab = async () => {
    try {
      const res = await axios.get(`/codelab/${workspaceId}`);
      setFiles(res.data.files);
      setActiveFile(res.data.files[0]);
      setCode(res.data.files[0].content);
      setLanguage(res.data.files[0].language);
    } catch (err) {
      console.error("Failed to fetch Code Lab:", err);
    }
  };

  useEffect(() => {
    fetchLab();
  }, []);

  const saveCode = async () => {
    try {
      await axios.put(`/codelab/${workspaceId}`, { files });
      setOutput(prev => [...prev, { type: 'success', message: 'Code saved successfully!' }]);
    } catch (err) {
      setOutput(prev => [...prev, { type: 'error', message: 'Failed to save code' }]);
    }
  };

  const runCode = async () => {
    try {
      setOutput([{ type: 'info', message: 'Running...' }]);

      const languageIds = {
        'javascript': 63,
        'python': 71,
        'java': 62,
        'cpp': 54
      };

      const res = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": "YOUR_API_KEY",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
          },
          body: JSON.stringify({
            language_id: languageIds[language] || 63,
            source_code: code
          })
        }
      );

      const data = await res.json();

      const result = data.stdout || data.stderr || data.compile_output || "No Output";
      setOutput(prev => [...prev, { type: 'log', message: result }]);

    } catch (error) {
      setOutput(prev => [...prev, { type: 'error', message: 'Execution failed' }]);
    }
  };

  const createFile = () => {
    const name = prompt("Enter file name");
    
    if (!name) return;

    const newFile = {
      name,
      content: "",
      language: "javascript"
    };

    setFiles([...files, newFile]);
  };

  const deleteFile = (name) => {
    setFiles(files.filter(f => f.name !== name));
  };

  const renameFile = (oldName) => {
    const newName = prompt("New file name");
    
    if (!newName) return;

    setFiles(
      files.map(f =>
        f.name === oldName
          ? { ...f, name: newName }
          : f
      )
    );
  };

  const downloadZip = async () => {
    const zip = new JSZip();

    files.forEach(file => {
      zip.file(file.name, file.content);
    });

    const blob = await zip.generateAsync({
      type: "blob"
    });

    saveAs(blob, "workspace-project.zip");
  };

  const selectFile = (file) => {
    setActiveFile(file);
    setCode(file.content);
    setLanguage(file.language);
  };

  const updateActiveFileContent = (newContent) => {
    setCode(newContent);
    if (activeFile) {
      setFiles(prev => prev.map(f => 
        f.name === activeFile.name 
          ? { ...f, content: newContent }
          : f
      ));
    }
  };

  const toggleFolder = (folder) => {
    setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const getLanguageIcon = (lang) => {
    switch(lang) {
      case 'javascript': return <FaJs className="text-yellow-500" />;
      case 'python': return <FaPython className="text-blue-500" />;
      case 'java': return <FaJava className="text-red-500" />;
      case 'css': return <FaCode className="text-blue-400" />;
      case 'json': return <FaCode className="text-gray-500" />;
      case 'markdown': return <FaCode className="text-gray-600" />;
      default: return <FaCode className="text-gray-500" />;
    }
  };

  const clearOutput = () => {
    setOutput([]);
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <div className="flex h-screen pt-16">
        {/* LEFT SIDEBAR - ENHANCED FILE EXPLORER */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-black text-sm uppercase tracking-wide">Explorer</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={createFile}
                  className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition-colors"
                  title="New File"
                >
                  <FaPlus className="text-sm" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition-colors">
                  <FaCog className="text-sm" />
                </button>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* File Tree */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="mb-2">
              <button 
                onClick={() => toggleFolder('src')}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-black font-medium mb-2 transition-colors"
              >
                {expandedFolders.src ? <FaChevronDown className="text-xs" /> : <FaChevronRight className="text-xs" />}
                <FaFolder className="text-yellow-500" />
                <span>src</span>
                <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  {filteredFiles.length}
                </span>
              </button>
              
              {expandedFolders.src && (
                <div className="ml-6 space-y-1">
                  {filteredFiles.map((file, index) => (
                    <div
                      key={index}
                      className="group relative"
                    >
                      <button
                        onClick={() => selectFile(file)}
                        className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg hover:bg-gray-200 transition-all duration-150 ${
                          activeFile && activeFile.name === file.name ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-gray-700'
                        }`}
                      >
                        {getLanguageIcon(file.language)}
                        <span className="text-sm font-medium">{file.name}</span>
                        <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              renameFile(file.name);
                            }}
                            className="p-0.5 hover:bg-blue-100 rounded text-gray-400 hover:text-blue-500 transition-colors"
                            title="Rename file"
                          >
                            <FaEllipsisV className="text-xs" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFile(file.name);
                            }}
                            className="p-0.5 hover:bg-red-100 rounded text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete file"
                          >
                            <FaEllipsisV className="text-xs" />
                          </button>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col bg-white">
          {/* TOP BAR - ENHANCED FILE TABS */}
          <div className="bg-gray-50 border-b border-gray-200 flex items-center">
            <div className="flex flex-1 overflow-x-auto">
              {files.map((file, index) => (
                <button
                  key={index}
                  onClick={() => selectFile(file)}
                  className={`flex items-center gap-2 px-4 py-2.5 border-r border-gray-200 hover:bg-gray-100 transition-all duration-150 whitespace-nowrap ${
                    activeFile && activeFile.name === file.name ? 'bg-white text-black border-b-2 border-b-blue-500' : 'text-gray-600'
                  }`}
                >
                  {getLanguageIcon(file.language)}
                  <span className="text-sm font-medium">{file.name}</span>
                  {activeFile && activeFile.name !== file.name && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.name);
                      }}
                      className="ml-1 p-0.5 hover:bg-red-100 rounded text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FaEllipsisV className="text-xs" />
                    </button>
                  )}
                </button>
              ))}
            </div>
            
            {/* Action Bar */}
            <div className="flex items-center gap-2 px-4 py-2 border-l border-gray-200 bg-gray-50">
              {/* Language Dropdown */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="css">CSS</option>
                <option value="html">HTML</option>
                <option value="json">JSON</option>
                <option value="markdown">Markdown</option>
              </select>
              
              {/* Action Buttons */}
              <button
                onClick={runCode}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition-all duration-150 shadow-sm hover:shadow-md"
                title="Run Code (Ctrl+Enter)"
              >
                <FaRocket className="text-sm" />
                <span className="text-sm font-medium">Run</span>
              </button>
              
              <button
                onClick={saveCode}
                className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 transition-all duration-150 shadow-sm hover:shadow-md"
                title="Save (Ctrl+S)"
              >
                <FaSave className="text-sm" />
                <span className="text-sm font-medium">Save</span>
              </button>

              <button
                onClick={downloadZip}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-all duration-150 shadow-sm hover:shadow-md"
                title="Download ZIP"
              >
                <FaDownload className="text-sm" />
                <span className="text-sm font-medium">Download</span>
              </button>
            </div>
          </div>

          {/* EDITOR AREA */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => updateActiveFileContent(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true
                },
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                parameterHints: { enabled: true }
              }}
            />
          </div>

          {/* BOTTOM PANEL - ENHANCED OUTPUT CONSOLE */}
          <div className="h-56 border-t border-gray-200 bg-black flex flex-col">
            <div className="flex items-center justify-between bg-gray-900 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <FaTerminal className="text-green-400" />
                <span className="text-white text-sm font-medium">OUTPUT</span>
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                  {output.length} messages
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOutput(prev => prev.filter(item => item.type !== 'log'))}
                  className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors"
                >
                  Clear Logs
                </button>
                <button
                  onClick={clearOutput}
                  className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-1">
              {output.length === 0 ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <FaTerminal className="text-xs" />
                  <span>Ready to run code... Press Run or Ctrl+Enter</span>
                </div>
              ) : (
                output.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2 py-0.5 rounded ${
                      item.type === 'error' ? 'text-red-400 bg-red-900/20' :
                      item.type === 'success' ? 'text-green-400 bg-green-900/20' :
                      item.type === 'warning' ? 'text-yellow-400 bg-yellow-900/20' :
                      'text-gray-300'
                    }`}
                  >
                    <span className="text-xs mt-1 opacity-60">
                      {item.type === 'error' && '❌'}
                      {item.type === 'success' && '✅'}
                      {item.type === 'warning' && '⚠️'}
                      {item.type === 'log' && '📝'}
                      {item.type === 'info' && 'ℹ️'}
                    </span>
                    <span className="flex-1 break-all">
                      {item.message}
                    </span>
                    <span className="text-xs text-gray-500 opacity-60">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeLab;
