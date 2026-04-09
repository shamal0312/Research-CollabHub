import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { 
  FaComments,
  FaUserCircle,
  FaPaperPlane,
  FaCheck,
  FaCheckDouble,
  FaEllipsisV,
  FaSearch,
  FaPhone,
  FaVideo,
  FaSmile,
  FaPaperclip,
  FaTimes,
  FaInbox,
  FaCircle
} from "react-icons/fa";

const Messages = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [receiver, setReceiver] = useState(null);

  // 🔥 GET CONVERSATIONS
  const fetchConversations = async () => {
    try {
      const res = await axios.get("/conversations");
      setConversations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 GET MESSAGES
  const fetchMessages = async (conversationId) => {
    try {
      const res = await axios.get(`/messages/${conversationId}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 OPEN CHAT
  const openChat = async (receiverId) => {
    try {
      const res = await axios.post("/conversations", {
        receiverId
      });

      setConversation(res.data);
      fetchMessages(res.data._id);

      const userRes = await axios.get(`/profile/public/${receiverId}`);
      setReceiver(userRes.data.user);

      navigate(`/messages/${receiverId}`);

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 LOAD
  useEffect(() => {
    if (!user) return;
    fetchConversations();
  }, [user]);

  // 🔥 SEND MESSAGE
  const sendMessage = async () => {
    if (!text.trim() || !conversation) return;

    try {
      await axios.post("/messages", {
        conversationId: conversation._id,
        messageText: text
      });

      setText("");
      fetchMessages(conversation._id);
      fetchConversations();

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 DELETE MESSAGE (RIGHT CLICK)
  const handleDelete = async (messageId) => {
    try {
      await axios.delete(`/messages/${messageId}`);
      fetchMessages(conversation._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header />

      <div className="flex flex-1 overflow-hidden">

        {/* LEFT SIDE - CONVERSATIONS LIST */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          {/* CHAT LIST HEADER */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <FaComments className="text-black text-xl" />
              <h2 className="font-bold text-lg text-black">Messages</h2>
            </div>
          </div>

          {/* CONVERSATION ITEMS */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => {
              const otherUser = c.members?.find(
                (m) => m?._id !== user?._id
              );

              if (!otherUser) return null;

              return (
                <div
                  key={c._id}
                  onClick={() => openChat(otherUser._id)}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
                >
                  <div className="relative">
                    <img
                      src={otherUser.profilePicture || "https://via.placeholder.com/40"}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-800 rounded-full border-2 border-white"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-black text-sm">{otherUser.fullName}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {c.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE - CHAT WINDOW */}
        <div className="flex-1 flex flex-col bg-white">

          {!conversation && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FaUserCircle className="text-gray-400 text-6xl mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a chat from the left to start messaging</p>
              </div>
            </div>
          )}

          {conversation && (
            <>
              {/* CHAT HEADER */}
              <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={receiver?.profilePicture || "https://via.placeholder.com/40"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gray-800 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-black">{receiver?.fullName || "User"}</p>
                    <p className="text-xs text-gray-600">Online</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FaPhone className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FaVideo className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* MESSAGES AREA */}
              <div className="flex-1 overflow-y-auto p-4 bg-white">
                {messages.map((m, index) => {
                  const isMe = m.senderId?._id === user?._id;
                  const showDate = index === 0 || new Date(m.createdAt).toDateString() !== new Date(messages[index - 1]?.createdAt).toDateString();

                  return (
                    <div key={m._id}>
                      {/* DATE SEPARATOR */}
                      {showDate && (
                        <div className="flex items-center justify-center my-4">
                          <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                            {new Date(m.createdAt).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        </div>
                      )}

                      {/* MESSAGE BUBBLE */}
                      <div
                        onContextMenu={(e) => {
                          e.preventDefault();
                          if (isMe) handleDelete(m._id);
                        }}
                        className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        {!isMe && (
                          <div className="flex flex-col items-end mr-2">
                            <img
                              src={m.senderId?.profilePicture || "https://via.placeholder.com/40"}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          </div>
                        )}

                        <div className={`max-w-xs lg:max-w-md ${isMe ? "order-first" : "order-last"}`}>
                          {!isMe && (
                            <p className="text-xs text-gray-500 mb-1 ml-10">
                              {m.senderId?.fullName}
                            </p>
                          )}

                          <div
                            className={`relative px-4 py-2 rounded-2xl ${
                              isMe
                                ? "bg-black text-white rounded-br-xl rounded-tl-xl"
                                : "bg-gray-100 text-black border border-gray-200 rounded-bl-xl rounded-tr-xl"
                            }`}
                          >
                            <p className="text-sm leading-relaxed break-words">{m.messageText}</p>
                            
                            {/* MESSAGE STATUS */}
                            {isMe && (
                              <div className="flex items-center justify-end gap-1 mt-1">
                                <span className="text-xs text-gray-300">
                                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {m.isRead ? (
                                  <FaCheckDouble className="text-gray-300 text-xs" />
                                ) : (
                                  <FaCheck className="text-gray-300 text-xs" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* MESSAGE INPUT */}
              <div className="bg-white border-t border-gray-200 px-4 py-3">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FaSmile className="text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FaPaperclip className="text-gray-500" />
                  </button>
                  
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="Type a message..."
                  />

                  <button
                    onClick={sendMessage}
                    disabled={!text.trim()}
                    className={`p-2 rounded-full transition-colors ${
                      text.trim() 
                        ? "bg-black hover:bg-gray-800 text-white" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <FaPaperPlane className="text-sm" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Messages;