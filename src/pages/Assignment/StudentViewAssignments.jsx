import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "@/config/axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function StudentViewAssignments() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [assignment, setAssignment] = useState([]);
    const [answers, setAnswers] = useState(null);
    const [answeredCount, setAnsweredCount] = useState("");
    const [totalQuestions, setTotalQuestions] = useState("");
    const [progressPercent, setProgressPercent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [start, setStart] = useState(false);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axios.get(`/assignment/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });
                setAssignment(response.data);
                setAnswers(Array(response.data.questions?.length).fill(""));
            } catch (err) {
                console.log(err);
                toast.error(err.message, { theme: "error" });
            }
        };
        fetchAssignments();
    }, []);

    useEffect(() => {
        const total = assignment?.questions?.length || 0;
        const answered = answers?.filter((a) => a !== "").length || 0;
        const percent = total > 0 ? (answered / total) * 100 : 0;
        setAnsweredCount(answered);
        setTotalQuestions(total);
        setProgressPercent(percent);
    }, [answers, assignment]);

    const handleSelect = (i, option) => {
        const updated = [...answers];
        updated[i] = option;
        setAnswers(updated);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        const response = await axios.post(
            "/assignment/submit",
            { id, answers },
            {
                headers: { Authorization: localStorage.getItem("token") },
            }
        );
        toast.info(
            `Test submitted! You answered ${
                answers.filter((a) => a !== "").length
            } out of ${assignment?.questions?.length} questions.`,
            { theme: "info" }
        );
        navigate("/assignments");
        setSubmitting(false);
    };

    if (!assignment?.isCompleted) {
        if (start) {
            return (
                <div className="flex-grow min-h-screen">
                    <div className="bg-card sticky top-0 z-50">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-2xl font-bold truncate">
                                        {assignment?.topic}
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        {totalQuestions} Questions
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold">
                                        {answeredCount}/{totalQuestions}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        answered
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 h-1 bg-border rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-foreground transition-all duration-300"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {assignment?.questions?.map((ele, i) => (
                            <Card key={ele._id} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold">
                                            Question {i + 1} of {totalQuestions}
                                        </h2>
                                        {answers[i] && (
                                            <CheckCircle2 className="w-5 h-5 text-foreground" />
                                        )}
                                    </div>
                                    <p className="text-lg leading-relaxed">
                                        {ele.question}
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    {ele.options.map((elem, index) => (
                                        <label
                                            key={index}
                                            className="flex items-start gap-4 p-4 rounded-lg border border-border cursor-pointer hover:bg-card hover:border-foreground transition group"
                                        >
                                            <input
                                                type="radio"
                                                name={`q-${i}`}
                                                checked={answers[i] === elem}
                                                onChange={() =>
                                                    handleSelect(i, elem)
                                                }
                                                className="mt-1 w-4 h-4 cursor-pointer flex-shrink-0 accent-foreground"
                                            />
                                            <span className="text-base group-hover:font-medium transition">
                                                {elem}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                    <div>
                        <Card className="mt-8 p-6 bg-card space-y-6">
                            <h3 className="text-lg font-semibold">
                                Test Summary
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Total Questions
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {totalQuestions}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Answered
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {answeredCount}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Unanswered
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {totalQuestions - answeredCount}
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={submitting || answeredCount === 0}
                                className="w-full mt-4"
                                size="lg"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Test"
                                )}
                            </Button>
                        </Card>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                        Start the Test
                    </h4>
                    <Button onClick={() => setStart(true)}>Start</Button>
                </div>
            );
        }
    }

    if (assignment?.isCompleted) {
        return (
            <div className="p-6">
                <div className="text-lg font-semibold capitalize flex justify-center mx-auto mb-5">
                    Test Already submitted
                </div>
                <Card className="mx-auto max-w-4xl p-6 shadow-md border border-border rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground tracking-wide">
                                Total Questions
                            </p>
                            <p className="text-3xl font-bold text-foreground">
                                {assignment?.questions?.length}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground tracking-wide">
                                Answered
                            </p>
                            <p className="text-3xl font-bold text-green-600">
                                {assignment?.marks}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground tracking-wide">
                                Unanswered
                            </p>
                            <p className="text-3xl font-bold text-red-600">
                                {assignment?.questions?.length -
                                    assignment?.marks}
                            </p>
                        </div>
                    </div>
                </Card>
                <div className="p-6">
                    <div className="space-y-8 max-w-3xl mx-auto">
                        {assignment?.questions?.map((ele, i) => (
                            <Card
                                key={ele._id}
                                className="p-6 space-y-5 border border-border shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Question {i + 1} of {totalQuestions}
                                    </h2>
                                </div>
                                <p className="text-muted-foreground">
                                    {ele.question}
                                </p>{" "}
                                <p>
                                    Your Selected Answer:{" "}
                                    {assignment?.studentAnswers[i] ||
                                        "No answer selected"}
                                </p>
                                <div className="pt-4 border-t border-border space-y-2">
                                    <p className="text-sm font-medium text-foreground">
                                        ✅{" "}
                                        <span className="font-semibold">
                                            Correct Answer:
                                        </span>{" "}
                                        <span className="text-green-600">
                                            {ele.correctAnswer}
                                        </span>
                                    </p>

                                    {ele.explanation && (
                                        <div className="bg-muted rounded-md p-3 border border-border">
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-medium text-foreground">
                                                    Explanation:
                                                </span>{" "}
                                                {ele.explanation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}
