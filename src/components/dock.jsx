import React, { useState } from "react";

const sampleApps = [
    {
        id: "Home",
        name: "Home",
        icon: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",
    },
    {
        id: "Search",
        name: "Search",
        icon: "M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z M21 21l-4.35-4.35",
    },
    {
        id: "Mail",
        name: "Mail",
        icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
    },
    {
        id: "Profile",
        name: "Profile",
        icon: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    },
    {
        id: "Settings",
        name: "Settings",
        icon: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    },
];

export default function ModernMinimalDock() {
    const [hoveredApp, setHoveredApp] = useState(null);

    const handleAppClick = (appId) => {
        setActiveApp(appId);
        console.log("App clicked:", appId);
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-50">
            <div className="relative">
                {/* Dock container */}
                <div className="bg-white rounded-2xl shadow-lg px-12 py-3 flex items-center gap-16">
                    {sampleApps.map((app) => {
                        const isHovered = hoveredApp === app.name;

                        return (
                            <div key={app.id} className="relative">
                                {/* Label above icon */}
                                {isHovered && (
                                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap">
                                        {app.name}
                                    </div>
                                )}

                                <button
                                    onClick={() => handleAppClick(app.id)}
                                    onMouseEnter={() => setHoveredApp(app.name)}
                                    onMouseLeave={() => setHoveredApp(null)}
                                    className="relative transition-all duration-300 ease-out"
                                    style={{
                                        transform: isHovered
                                            ? "scale(1.2)"
                                            : "scale(1)",
                                    }}
                                >
                                    {/* Icon */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-gray-900"
                                    >
                                        <path d={app.icon} />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
