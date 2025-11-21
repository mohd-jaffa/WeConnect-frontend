import { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "@/config/axios";
import dayjs from "dayjs";
import UserContext from "@/context/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import { Send, MessageCircle, User, MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const socket = io("http://localhost:3400", {
    transports: ["polling", "websocket"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 10000,
});

// Debug socket connection
socket.on("connect", () => {
    console.log("✅ Socket connected globally:", socket.id);
});

socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
    console.error("🔴 Socket connection error:", error);
});

export default function ChatPage() {
    const { user } = useContext(UserContext);
    const { teacherId, studentId } = useParams();
    const navigate = useNavigate();

    const roomId = [studentId, teacherId].sort().join("_");

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [otherUserName, setOtherUserName] = useState("");
    const [otherAvatar, setOtherAvatar] = useState("");

    const bottomRef = useRef(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    // Auto-scroll when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!teacherId || !studentId || !user?._id) return;

        // Handler functions defined outside to ensure proper cleanup
        const handleReceiveMessage = (msg) => {
            console.log("📨 Received message:", msg);
            // If the message is from me, don't add it again (since we added it optimistically)
            if (msg.senderId === user._id) return;

            setMessages((prev) => [...prev, msg]);
            scrollToBottom();
        };

        // Ensure socket is connected before joining room
        const setupSocket = () => {
            console.log("🔌 Setting up socket for room:", roomId);

            // Remove any existing listeners first
            socket.off("receiveMessage", handleReceiveMessage);

            // Add new listeners
            socket.on("receiveMessage", handleReceiveMessage);

            // Join room (will work even if socket is already connected)
            socket.emit("joinRoom", roomId);
            console.log("✅ Joined room:", roomId);
        };

        // If socket is already connected, setup immediately
        if (socket.connected) {
            setupSocket();
        } else {
            // Wait for connection, then setup
            socket.on("connect", setupSocket);
            // Manually connect if not connected
            socket.connect();
        }

        // LOAD MESSAGE HISTORY
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`/chat/${studentId}/${teacherId}`);
                setMessages(res.data);
                scrollToBottom();
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
            }
        };
        fetchHistory();

        return () => {
            console.log("🧹 Cleaning up socket listeners for room:", roomId);
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("connect", setupSocket);
        };
    }, [teacherId, studentId, user, roomId]);

    // Fetch other user's details
    useEffect(() => {
        const fetchOtherUser = async () => {
            try {
                // The URL params might be swapped, so find which ID is NOT the current user's ID
                const param1 = teacherId;
                const param2 = studentId;

                let otherUserId;
                let otherUserType;

                if (param1 === user._id) {
                    // param1 is me, so param2 is the other person
                    otherUserId = param2;
                    otherUserType =
                        user.role === "student" ? "teachers" : "students";
                } else if (param2 === user._id) {
                    // param2 is me, so param1 is the other person
                    otherUserId = param1;
                    otherUserType =
                        user.role === "student" ? "teachers" : "students";
                } else {
                    // Neither matches my ID, use the original logic
                    otherUserId =
                        user?.role === "student" ? teacherId : studentId;
                    otherUserType =
                        user?.role === "student" ? "teachers" : "students";
                }

                console.log("🔍 Fetching other user:");
                console.log("  - My ID:", user?._id);
                console.log("  - Other user ID:", otherUserId);
                console.log("  - Other user type:", otherUserType);

                const res = await axios.get(`/${otherUserType}/${otherUserId}`);
                console.log("✅ Fetched user:", res.data.name);

                setOtherAvatar(res?.data?.avatar);
                setOtherUserName(res.data.name);
            } catch (error) {
                console.error("Failed to fetch user details:", error);
                setOtherUserName(
                    user?.role === "student" ? "Your Tutor" : "Your Student"
                );
            }
        };

        if (user && (teacherId || studentId)) {
            fetchOtherUser();
        }
    }, [user, teacherId, studentId]);

    const sendMessage = async () => {
        if (!text.trim()) return;

        const msg = {
            roomId,
            senderId: user._id,
            receiverId: user.role === "student" ? teacherId : studentId,
            text,
            createdAt: new Date(),
        };

        // Optimistically add to local state
        setMessages((prev) => [...prev, msg]);
        setText("");

        try {
            // Save to DB
            await axios.post("/chat/save", msg);

            // Emit to socket
            console.log("📤 Sending message via socket:", { roomId, message: msg });
            socket.emit("sendMessage", { roomId, message: msg });
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!user)
        return (
            <div className="flex items-center justify-center h-screen">
                Loading user…
            </div>
        );

    return (
        <div className="h-screen flex bg-gray-100">
            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-white max-w-5xl mx-auto shadow-xl rounded-xl p-6 m-5">
                <Button
                    className="w-[8rem] mb-3 flex"
                    variant="secondary"
                    onClick={() => navigate(-2, { replace: true })}
                >
                    <MoveLeft className="mt-[2px]" /> Back
                </Button>
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-gray-100 bg-white shadow-sm rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                            {otherAvatar ? (
                                <img
                                    src={otherAvatar}
                                    alt={otherUserName}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : otherUserName ? (
                                <span className="text-lg">
                                    {otherUserName.charAt(0).toUpperCase()}
                                </span>
                            ) : (
                                <User size={20} />
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                {otherUserName ||
                                    (user.role === "student"
                                        ? "Chat with Tutor"
                                        : "Chat with Student")}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <MessageCircle
                                size={64}
                                className="mb-4 opacity-20"
                            />
                            <p className="text-lg font-medium">
                                No messages yet
                            </p>
                            <p className="text-sm">Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isOwnMessage = msg.senderId === user._id;
                            return (
                                <div
                                    key={index}
                                    className={`flex ${isOwnMessage
                                        ? "justify-end"
                                        : "justify-start"
                                        } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                >
                                    <div
                                        className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${isOwnMessage
                                            ? "bg-yellow-50 text-gray-900 rounded-br-sm border border-yellow-200"
                                            : "bg-green-100 text-gray-900 rounded-bl-sm border border-green-200"
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed break-words">
                                            {msg.text}
                                        </p>
                                        <span className="text-xs mt-2 block text-gray-500">
                                            {dayjs(msg.createdAt).format(
                                                "hh:mm A"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-3 items-center">
                        <div className="flex-1 relative">
                            <textarea
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                                value={text}
                                rows={1}
                                placeholder="Type a message..."
                                onChange={(e) => {
                                    setText(e.target.value);
                                }}
                                onKeyPress={handleKeyPress}
                                style={{
                                    minHeight: "48px",
                                    maxHeight: "120px",
                                }}
                            />
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={!text.trim()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium h-12"
                        >
                            <Send size={18} />
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
