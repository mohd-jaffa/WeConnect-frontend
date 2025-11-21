import { useContext, useEffect, useState } from "react";
import axios from "@/config/axios";
import UserContext from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Loader2 } from "lucide-react";
import io from "socket.io-client";
import dayjs from "dayjs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const socket = io("http://localhost:3400", {
    transports: ["websocket", "polling"],
});

export default function InboxPage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [inbox, setInbox] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ----------------------------------------
    //  ASK BROWSER NOTIFICATION PERMISSION ONCE
    // ----------------------------------------
    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    // ----------------------------------------
    //  FETCH INBOX FROM API
    // ----------------------------------------
    const fetchInbox = async () => {
        if (!user?._id) return;

        try {
            const res = await axios.get(`/chat/inbox/${user._id}`);
            const rawChats = res.data;

            // Enrich with other user details
            const enrichedChats = await Promise.all(
                rawChats.map(async (chat) => {
                    let otherId;

                    if (
                        chat._id &&
                        typeof chat._id === "string" &&
                        chat._id.includes("_")
                    ) {
                        const ids = chat._id.split("_");
                        otherId = ids.find((id) => id !== user._id);
                    }

                    if (!otherId) return chat;

                    try {
                        const otherUserType =
                            user.role === "student" ? "teachers" : "students";
                        const userRes = await axios.get(
                            `/${otherUserType}/${otherId}`
                        );
                        return { ...chat, otherUser: userRes.data, otherId };
                    } catch (e) {
                        return { ...chat, otherId };
                    }
                })
            );

            const sorted = enrichedChats.sort(
                (a, b) =>
                    new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
            );

            setInbox(sorted);
            setError(null);
        } catch (err) {
            console.error("Failed to load inbox:", err);
            setError("Failed to load conversations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInbox();
    }, [user]);

    // --------------------------------------------------------
    //  SOCKET LISTENER FOR NEW MESSAGES + SHOW NOTIFICATION
    // --------------------------------------------------------
    useEffect(() => {
        if (!user) return;

        const handleNewMessage = (msg) => {
            console.log("Message Arrived:", msg);

            // ------------------------------------------------------------------
            // SHOW BROWSER NOTIFICATION IF MESSAGE RECEIVED BY CURRENT USER
            // ------------------------------------------------------------------
            if (msg.receiverId === user._id) {
                if (Notification.permission === "granted") {
                    new Notification("New Message", {
                        body: msg.text,
                        icon: "/chat-icon.png",
                    });
                    console.log(msg.text);
                }
            }

            // ----------------------------
            // UPDATE INBOX LIST IMMEDIATELY
            // ----------------------------
            setInbox((prev) => {
                const updated = [...prev];
                const index = updated.findIndex(
                    (chat) =>
                        chat.participants.includes(msg.senderId) &&
                        chat.participants.includes(msg.receiverId)
                );

                if (index !== -1) {
                    // Update existing chat
                    const chat = { ...updated[index] };
                    chat.lastMessage = msg.text;
                    chat.lastMessageTime = msg.createdAt;

                    // Increase unread count only if message is for current user
                    if (msg.receiverId === user._id) {
                        chat.unreadCount = (chat.unreadCount || 0) + 1;
                    }

                    // Move chat to top
                    updated.splice(index, 1);
                    updated.unshift(chat);

                    return updated;
                }

                // If chat doesn't exist in list → reload inbox
                fetchInbox();
                return prev;
            });
        };

        socket.on("receiveMessage", handleNewMessage);

        return () => {
            socket.off("receiveMessage", handleNewMessage);
        };
    }, [user]);

    // --------------------------------------------------------
    //  LOADING / ERROR / EMPTY STATES
    // --------------------------------------------------------
    if (loading)
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
            </div>
        );

    if (error)
        return (
            <div className="flex flex-col items-center justify-center h-screen text-red-500">
                <MessageCircle size={60} className="opacity-20 mb-4" />
                <p className="text-xl font-medium">{error}</p>
                <button
                    onClick={fetchInbox}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );

    if (inbox.length === 0)
        return (
            <div className="flex flex-col items-center justify-center h-screen text-gray-400">
                <MessageCircle size={60} className="opacity-20 mb-4" />
                <p className="text-xl font-medium">No conversations yet</p>
            </div>
        );

    // --------------------------------------------------------
    //  OPEN CHAT
    // --------------------------------------------------------
    const openChat = (chat) => {
        const otherId = chat.otherId || chat.otherUser?._id;

        if (!otherId) return;

        const teacherId = user.role === "student" ? otherId : user._id;
        const studentId = user.role === "student" ? user._id : otherId;

        setInbox((prev) =>
            prev.map((c) => (c._id === chat._id ? { ...c, unreadCount: 0 } : c))
        );

        navigate(`/chat/${teacherId}/${studentId}`);
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>

            <div className="space-y-3">
                {inbox.map((chat) => {
                    const otherUser = chat.otherUser;
                    const unread = chat.unreadCount > 0;

                    return (
                        <div
                            key={chat._id}
                            onClick={() => openChat(chat)}
                            className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${unread
                                    ? "bg-blue-50 border-blue-200 shadow-md"
                                    : "bg-white border-gray-100 shadow-sm hover:shadow-md"
                                }`}
                        >
                            <div className="relative">
                                <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                                    <AvatarImage src={otherUser?.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                        {otherUser?.name
                                            ?.charAt(0)
                                            ?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>

                                {unread && (
                                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3
                                        className={`text-base truncate ${unread
                                                ? "font-bold text-gray-900"
                                                : "font-semibold text-gray-800"
                                            }`}
                                    >
                                        {otherUser?.name || "Unknown User"}
                                    </h3>

                                    <span
                                        className={`text-xs whitespace-nowrap ${unread
                                                ? "text-blue-600 font-semibold"
                                                : "text-gray-400"
                                            }`}
                                    >
                                        {dayjs(chat.lastMessageTime).format(
                                            "hh:mm A"
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <p
                                        className={`text-sm truncate max-w-[85%] ${unread
                                                ? "font-semibold text-gray-900"
                                                : "text-gray-500"
                                            }`}
                                    >
                                        {chat.lastMessage || "No messages yet"}
                                    </p>

                                    {unread && (
                                        <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] px-2 h-5 flex items-center justify-center rounded-full min-w-[20px]">
                                            {chat.unreadCount}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
