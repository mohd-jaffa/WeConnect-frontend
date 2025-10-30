import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarClock, Users, Info, Hourglass } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeTeachers } from "@/slices/teacherSlice";
import { fetchHomeSessions } from "@/slices/sessionSlice";
import { fetchHomeBookings } from "@/slices/bookingSlice";

export default function Home() {
    const dispatch = useDispatch();
    const { homeTeachersData, homeTeachersLoading, homeTeachersError } =
        useSelector((state) => state.teacher);

    const { homeSessionsData, homeSessionsLoading, homeSessionsError } =
        useSelector((state) => state.session);

    const { homeBookingData, homeBookingLoading, homeBookingError } =
        useSelector((state) => state.booking);

    useEffect(() => {
        dispatch(fetchHomeTeachers());
        dispatch(fetchHomeSessions());
        dispatch(fetchHomeBookings());
    }, []);

    const Carousel = () => {
        const [currentSlide, setCurrentSlide] = useState(0);
        const slides = [
            {
                title: "Welcome back!",
                subtitle: "Continue your learning journey",
                description: `You have ${homeBookingData?.upcomingBookings} upcoming sessions!`,
                color: "bg-card",
                image: "https://i.ibb.co/DHzhsHm0/Screenshot-2025-10-29-234332-removebg-preview.png",
            },
            {
                title: "Master New Skills",
                subtitle: "Explore trending subjects",
                description: "Discover courses from top-rated tutors",
                color: "bg-card",
                image: "https://i.ibb.co/MQQFQB6/Screenshot-2025-10-29-234716-removebg-preview.png",
            },
            {
                title: "Achieve Your Goals",
                subtitle: "Track your progress",
                description: "See how far you've come in your learning",
                color: "bg-card",
                image: "https://i.ibb.co/QFPDbxsT/5259881-20616.jpg",
            },
        ];

        useEffect(() => {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 5000);
            return () => clearInterval(interval);
        }, [slides.length]);

        const nextSlide = () =>
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        const prevSlide = () =>
            setCurrentSlide(
                (prev) => (prev - 1 + slides.length) % slides.length
            );

        const variants = {
            enter: { opacity: 0, x: 100 },
            center: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -100 },
        };

        return (
            <section className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-6xl mx-auto bg-gray-50">
                    <div className="relative overflow-hidden rounded-lg border border-border">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    duration: 0.8,
                                    ease: "easeInOut",
                                }}
                                className={`${slides[currentSlide].color} p-8 md:p-12 flex justify-between bg-gray-50`}
                            >
                                <div className="relative z-10 space-y-4">
                                    <h2 className="text-4xl md:text-5xl font-bold">
                                        {slides[currentSlide].title}
                                    </h2>
                                    <p className="text-lg text-muted-foreground">
                                        {slides[currentSlide].subtitle}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {slides[currentSlide].description}
                                    </p>
                                    <Button className="mt-4">
                                        Explore Now
                                    </Button>
                                </div>
                                <img
                                    src={slides[currentSlide].image}
                                    alt="carousel image"
                                    className="w-auto size-50"
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Controls */}
                        <div className="flex items-center justify-between px-6 py-4">
                            <button
                                onClick={prevSlide}
                                className="p-2 hover:bg-foreground hover:text-background rounded-lg transition"
                                aria-label="Previous slide"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>

                            <div className="flex items-center gap-2">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`w-2 h-2 rounded-full transition ${
                                            index === currentSlide
                                                ? "bg-foreground w-8"
                                                : "bg-muted-foreground"
                                        }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={nextSlide}
                                className="p-2 hover:bg-foreground hover:text-background rounded-lg transition"
                                aria-label="Next slide"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    const Progress = () => (
        <section className="border-t border-border px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">
                    Your Learning Stats
                </h2>
                <div className="grid md:grid-cols-4 gap-6">
                    {[
                        {
                            label: "Hours Learned",
                            value: homeBookingData?.successfullBookings,
                            icon: <CalendarClock />,
                        },
                        ,
                        {
                            label: "Sessions Completed",
                            value: homeBookingData?.successfullBookings,
                            icon: <Users />,
                        },
                        {
                            label: "Upcoming Sessions",
                            value: homeBookingData?.upcomingBookings,
                            icon: <Hourglass />,
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="p-6 rounded-lg border border-border hover:border-foreground transition space-y-3 bg-gray-50"
                        >
                            <div className="text-3xl">{stat.icon}</div>
                            <p className="text-muted-foreground text-sm">
                                {stat.label}
                            </p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    const SessionsSection = () => {
        const SessionCard = ({
            _id,
            title,
            teachersId,
            description,
            category,
            amount,
        }) => (
            <div className="p-6 rounded-lg border border-border hover:border-foreground transition space-y-4 group cursor-pointer bg-gray-50">
                <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                        <h3 className="font-bold text-lg group-hover:text-foreground transition">
                            {title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            by {teachersId.name}
                        </p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-card border border-border rounded-full">
                        {category}
                    </span>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Info size={16} className="mt-[2px]" />
                        {description}
                    </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="font-bold">₹{amount}</p>

                    <Link to={`/session/${_id}`}>
                        <Button size="sm" variant="outline">
                            View Details
                        </Button>
                    </Link>
                </div>
            </div>
        );

        return (
            <section className="border-t border-border px-4 sm:px-6 lg:px-8 py-12 bg-card">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold capitalize">
                            some of our Sessions
                        </h2>
                        <Link
                            to="/sessions"
                            className="text-sm hover:text-muted-foreground transition"
                        >
                            View All →
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {homeSessionsData.map((ele) => (
                            <SessionCard key={ele.title} {...ele} />
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    const TeachersSection = () => {
        const TeacherCard = ({ _id, name, skills, avatar, createdAt }) => (
            <div className="p-6 rounded-lg border border-border hover:border-foreground transition space-y-4 group cursor-pointer bg-gray-50">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-foreground flex items-center justify-center text-background font-bold text-xl">
                    {avatar ? (
                        <img
                            src={avatar}
                            alt="Teacher Avatar"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        "T"
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="font-bold text-lg group-hover:text-foreground transition">
                        {name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {skills?.join(", ") || "No skills listed"}
                    </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <span>Since {createdAt?.slice(0, 10)}</span>
                    </div>
                </div>

                <Link to={`/teacher/${_id}`}>
                    <Button size="sm" className="w-full">
                        View Profile
                    </Button>
                </Link>
            </div>
        );
        return (
            <section className="border-t border-border px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold capitalize">
                            Some of our tutors
                        </h2>
                        <Link
                            to="/teachers"
                            className="text-sm hover:text-muted-foreground transition"
                        >
                            View All →
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {homeTeachersData.map((ele) => (
                            <TeacherCard key={ele.name} {...ele} />
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    return (
        <div>
            <Carousel />
            <Progress />
            <SessionsSection />
            <TeachersSection />
        </div>
    );
}
