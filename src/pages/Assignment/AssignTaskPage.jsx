import axios from "@/config/axios";
import { useState } from "react";

export default function AssignTaskPage() {
    const [topic, setTopic] = useState("");
    const [studentId, setStudentId] = useState("68f1089d5cbb5620d684eba3");
    const [message, setMessage] = useState("");

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setMessage("Please enter a topic.");
            return;
        }

        try {
            const res = await axios.post(
                "/assignment/generate",
                {
                    topic,
                    studentId: "68f1089d5cbb5620d684eba3",
                    instructorId: "68fd1491ce4dd9ed6d3035ba",
                    bookingId: "69026e19ed95a398d002dc0c",
                },
                { headers: { Authorization: localStorage.getItem("token") } }
            );

            if (res.data.success)
                setMessage("✅ Assignment generated successfully!");
            else
                setMessage(
                    res.data.message || "Failed to generate assignment."
                );
        } catch (err) {
            const serverMsg =
                err?.response?.data?.message ||
                err?.response?.data ||
                err.message;
            setMessage(`Error: ${serverMsg}`);
            console.log(err);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Assign Task</h2>
            <textarea
                className="form-control"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic (e.g. Algebra, Trigonometry)"
            />
            <button className="btn btn-primary mt-3" onClick={handleGenerate}>
                Generate & Assign
            </button>
            <p className="mt-3">{message}</p>
        </div>
    );
}
