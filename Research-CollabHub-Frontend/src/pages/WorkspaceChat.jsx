import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { 
  FaComments, 
  FaFolder, 
  FaFileAlt, 
  FaVideo, 
  FaUsers,
  FaPaperPlane,
  FaClock
} from "react-icons/fa";

const BASE_URL = "http://localhost:5000/api";

const WorkspaceChat = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef();

  // 🔥 FETCH MESSAGES
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/chat/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 SEND MESSAGE (TEXT ONLY)
  const sendMessage = async () => {
    if (!text) return;

    try {
      await axios.post(
        `${BASE_URL}/chat/${workspaceId}/send`,
        { message: text },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setText("");
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 DELETE MESSAGE (RIGHT CLICK)
  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/chat/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* PROFESSIONAL NAVIGATION */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => navigate(`/workspace/${workspaceId}`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaFolder />
                Home
              </button>

              <button className="flex items-center gap-2 text-white font-semibold">
                <FaComments />
                Messages
              </button>

              <button 
                onClick={() => navigate(`/workspace/${workspaceId}/documents`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaFileAlt />
                Documents
              </button>

              <button 
                onClick={() => navigate(`/workspace/${workspaceId}/meetings`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaVideo />
                Meetings
              </button>

              <button 
                onClick={() => navigate(`/workspace/${workspaceId}/tasks`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaUsers />
                Tasks
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WHATSAPP-STYLE CHAT CONTAINER */}
      <div className="flex flex-col h-[calc(100vh-120px)] bg-[#E5DDD5]">
        
        {/* Empty State */}
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaComments className="text-gray-500 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No messages yet</h3>
              <p className="text-gray-500 text-sm">Start the conversation with a message</p>
            </div>
          </div>
        )}

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {messages.map((m, index) => (
            <div key={m._id} className="mb-3">
              
              {/* DATE SEPARATOR */}
              {index === 0 || new Date(messages[index - 1]?.createdAt).toDateString() !== new Date(m.createdAt).toDateString() ? (
                <div className="flex items-center justify-center my-4">
                  <span className="bg-gray-300 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ) : null}

              {/* MESSAGE ROW */}
              <div className="flex items-end gap-2">
                
                {/* AVATAR */}
                <img
                  src={m.sender?.profilePicture || "https://via.placeholder.com/40"}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/40";
                  }}
                />

                {/* MESSAGE BUBBLE */}
                <div className="max-w-[70%]">
                  
                  {/* SENDER NAME */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-700">
                      {m.sender?.fullName || "Unknown User"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* MESSAGE CONTENT */}
                  <div
                    onContextMenu={(e) => {
                      e.preventDefault();
                      const confirmDelete = window.confirm("Delete this message?");
                      if (confirmDelete) {
                        deleteMessage(m._id);
                      }
                    }}
                    className="bg-white rounded-2xl rounded-tl-none px-4 py-2 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                  >
                    {m.message && (
                      <p className="text-gray-800 text-sm leading-relaxed break-words">
                        {m.message}
                      </p>
                    )}

                    {/* ATTACHMENTS */}
                    {m.attachments?.map((a, i) => (
                      <div key={i} className="mt-2">
                        {a.type === "image" ? (
                          <img
                            src={a.filePath}
                            className="max-w-[200px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            alt={a.filename}
                            onClick={() => window.open(a.filePath, '_blank')}
                          />
                        ) : (
                          <a
                            href={a.filePath}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors text-gray-700 text-xs"
                          >
                            📄 {a.filename}
                          </a>
                        )}
                      </div>
                    ))}

                  </div>
                </div>
              </div>

            </div>
          ))}

          <div ref={bottomRef}></div>
        </div>

        {/* WHATSAPP-STYLE INPUT */}
        <div className="bg-white border-t border-gray-300 px-4 py-3">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            
            {/* MESSAGE INPUT */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all text-gray-800 placeholder-gray-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              
              {/* EMOJI BUTTON */}
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                😊
              </button>
            </div>

            {/* SEND BUTTON */}
            <button
              onClick={sendMessage}
              disabled={!text.trim()}
              className="bg-[#128C7E] text-white p-3 rounded-full hover:bg-[#075E54] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <FaPaperPlane className="text-sm" />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default WorkspaceChat;