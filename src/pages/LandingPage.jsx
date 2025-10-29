import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Navigation */}
            {/* <nav className="border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link to="/">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                                <BookOpen color="#ffffff" size={18} />
                            </div>
                            <span className="text-xl font-bold">WeConnect</span>
                        </div>
                    </Link> */}

            {/* <div className="hidden md:flex items-center gap-8">
                        <a
                            href="#features"
                            className="text-sm hover:text-muted-foreground transition"
                        >
                            Features
                        </a>
                        <a
                            href="#pricing"
                            className="text-sm hover:text-muted-foreground transition"
                        >
                            Pricing
                        </a>
                        <a
                            href="#about"
                            className="text-sm hover:text-muted-foreground transition"
                        >
                            About
                        </a>
                    </div> */}

            {/* <div className="flex items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost" size="sm">
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav> */}

            {/* Hero Section */}
            <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card">
                        <span className="w-2 h-2 bg-foreground rounded-full"></span>
                        <span className="text-sm font-medium">
                            Live tutoring, reimagined
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance leading-tight">
                        Learn from the best,{" "}
                        <span className="relative">
                            anytime
                            <span className="absolute bottom-2 left-0 right-0 h-1 bg-foreground opacity-20"></span>
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Connect with expert tutors in real-time. Get
                        personalized guidance, instant feedback, and achieve
                        your learning goals faster than ever before.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/register">
                            <Button size="lg" className="gap-2">
                                Start Learning Now
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-4 md:gap-8 pt-12 border-t border-border">
                        <div className="space-y-2">
                            <p className="text-2xl md:text-3xl font-bold">
                                10K+
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Active Students
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-2xl md:text-3xl font-bold">
                                500+
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Expert Tutors
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-2xl md:text-3xl font-bold">
                                4.9★
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Average Rating
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section
                id="features"
                className="border-t border-border px-4 sm:px-6 lg:px-8 py-20"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold">
                            Why choose WeConnect?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Everything you need for effective online learning
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-4 p-6 rounded-lg border border-border hover:border-foreground transition">
                            <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-background"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4 
                  -4-4-4 1.79-4 4 1.79 4 
                  4 4zm0 2c-2.67 0-8 
                  1.34-8 4v2h16v-2c0-2.66
                  -5.33-4-8-4z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">Expert Tutors</h3>
                            <p className="text-muted-foreground">
                                Vetted professionals with years of experience in
                                their fields
                            </p>
                        </div>

                        <div className="space-y-4 p-6 rounded-lg border border-border hover:border-foreground transition">
                            <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-background"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">
                                Real-time Sessions
                            </h3>
                            <p className="text-muted-foreground">
                                Live video tutoring with interactive tools and
                                instant feedback
                            </p>
                        </div>

                        <div className="space-y-4 p-6 rounded-lg border border-border hover:border-foreground transition">
                            <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-background"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">
                                Flexible Learning
                            </h3>
                            <p className="text-muted-foreground">
                                Schedule sessions at your convenience, learn at
                                your own pace
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t border-border px-4 sm:px-6 lg:px-8 py-20 bg-card">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold">
                        Ready to transform your learning?
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Join thousands of students already achieving their goals
                        with WeConnect
                    </p>
                    <Link to="/register">
                        <Button size="lg" className="gap-2">
                            Get Started Free
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </Button>
                    </Link>
                </div>
            </section>

            {/* steps Section */}
            <section className="border-t border-border px-4 sm:px-6 lg:px-8 py-20">
                {" "}
                <div className="max-w-6xl mx-auto">
                    {" "}
                    <div className="text-center mb-16 space-y-4">
                        {" "}
                        <h2 className="text-4xl md:text-5xl font-bold">
                            How it works
                        </h2>{" "}
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Get started in just 5 simple steps
                        </p>{" "}
                    </div>{" "}
                    <div className="grid md:grid-cols-5 gap-4 md:gap-2">
                        {" "}
                        {/* Step 1 */}{" "}
                        <div className="flex flex-col items-center text-center space-y-4">
                            {" "}
                            <div className="w-14 h-14 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-lg">
                                {" "}
                                1{" "}
                            </div>{" "}
                            <h3 className="font-semibold text-lg">
                                Search & Discover
                            </h3>{" "}
                            <p className="text-sm text-muted-foreground">
                                {" "}
                                Find the session, subject, category, or
                                instructor you're looking for{" "}
                            </p>{" "}
                        </div>{" "}
                        {/* Step 2 */}{" "}
                        <div className="flex flex-col items-center text-center space-y-4">
                            {" "}
                            <div className="w-14 h-14 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-lg">
                                {" "}
                                2{" "}
                            </div>{" "}
                            <h3 className="font-semibold text-lg">
                                Select Session
                            </h3>{" "}
                            <p className="text-sm text-muted-foreground">
                                {" "}
                                Choose the tutoring session that matches your
                                learning goals{" "}
                            </p>{" "}
                        </div>{" "}
                        {/* Step 3 */}{" "}
                        <div className="flex flex-col items-center text-center space-y-4">
                            {" "}
                            <div className="w-14 h-14 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-lg">
                                {" "}
                                3{" "}
                            </div>{" "}
                            <h3 className="font-semibold text-lg">
                                Pick Your Slot
                            </h3>{" "}
                            <p className="text-sm text-muted-foreground">
                                Choose a time slot as per your comfort and
                                availability
                            </p>{" "}
                        </div>{" "}
                        {/* Step 4 */}{" "}
                        <div className="flex flex-col items-center text-center space-y-4">
                            {" "}
                            <div className="w-14 h-14 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-lg">
                                {" "}
                                4{" "}
                            </div>{" "}
                            <h3 className="font-semibold text-lg">
                                Make Payment
                            </h3>{" "}
                            <p className="text-sm text-muted-foreground">
                                Secure payment to confirm your tutoring session
                            </p>{" "}
                        </div>{" "}
                        {/* Step 5 */}{" "}
                        <div className="flex flex-col items-center text-center space-y-4">
                            {" "}
                            <div className="w-14 h-14 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-lg">
                                {" "}
                                5{" "}
                            </div>{" "}
                            <h3 className="font-semibold text-lg">
                                Start Learning
                            </h3>{" "}
                            <p className="text-sm text-muted-foreground">
                                {" "}
                                Be ready when it's time for the class and start
                                your session{" "}
                            </p>{" "}
                        </div>{" "}
                    </div>{" "}
                </div>{" "}
            </section>

            {/* testimonials Section */}
            <section className="border-t border-border px-4 sm:px-6 lg:px-8 py-20 bg-card">
                {" "}
                <div className="max-w-6xl mx-auto">
                    {" "}
                    <div className="text-center mb-16 space-y-4">
                        {" "}
                        <h2 className="text-4xl md:text-5xl font-bold">
                            Loved by students
                        </h2>{" "}
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {" "}
                            See what our learners have to say about their
                            experience{" "}
                        </p>{" "}
                    </div>{" "}
                    <div className="grid md:grid-cols-3 gap-8">
                        {" "}
                        {/* Testimonial 1 */}{" "}
                        <div className="space-y-4 p-6 rounded-lg border border-border bg-background">
                            {" "}
                            <div className="flex items-center gap-1">
                                {" "}
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-lg">
                                        {" "}
                                        ★{" "}
                                    </span>
                                ))}{" "}
                            </div>{" "}
                            <p className="text-muted-foreground leading-relaxed">
                                {" "}
                                "WeConnect completely transformed my learning
                                experience. The tutors are incredibly
                                knowledgeable and patient. I've improved my
                                grades significantly!"{" "}
                            </p>{" "}
                            <div className="space-y-1 pt-2 flex gap-3">
                                {" "}
                                <Avatar className="mt-[7px]">
                                    <AvatarImage src="https://github.com/evilrabbit.png" />
                                    <AvatarFallback>SJ</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">
                                        Sarah Johnson
                                    </p>{" "}
                                    <p className="text-sm text-muted-foreground">
                                        Mathematics Student
                                    </p>{" "}
                                </div>
                            </div>{" "}
                        </div>{" "}
                        {/* Testimonial 2 */}{" "}
                        <div className="space-y-4 p-6 rounded-lg border border-border bg-background">
                            {" "}
                            <div className="flex items-center gap-1">
                                {" "}
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-lg">
                                        {" "}
                                        ★{" "}
                                    </span>
                                ))}{" "}
                            </div>{" "}
                            <p className="text-muted-foreground leading-relaxed">
                                {" "}
                                "The flexibility to choose my own schedule was a
                                game-changer. I can now balance my studies with
                                my part-time job perfectly."{" "}
                            </p>{" "}
                            <div className="space-y-1 pt-8 flex gap-3">
                                {" "}
                                <Avatar className="mt-[7px]">
                                    <AvatarImage src="https://github.com/maxleiter.png" />
                                    <AvatarFallback>MC</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">
                                        Michael Chen
                                    </p>{" "}
                                    <p className="text-sm text-muted-foreground">
                                        Physics Learner
                                    </p>{" "}
                                </div>
                            </div>{" "}
                        </div>{" "}
                        {/* Testimonial 3 */}{" "}
                        <div className="space-y-4 p-6 rounded-lg border border-border bg-background">
                            {" "}
                            <div className="flex items-center gap-1">
                                {" "}
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-lg">
                                        {" "}
                                        ★{" "}
                                    </span>
                                ))}{" "}
                            </div>{" "}
                            <p className="text-muted-foreground leading-relaxed">
                                {" "}
                                "The real-time interaction with tutors makes
                                learning so much more effective. I finally
                                understand concepts that were confusing before!"{" "}
                            </p>{" "}
                            <div className="space-y-1 pt-2 flex gap-3">
                                {" "}
                                <Avatar className="mt-[7px] grayscale">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>ER</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">
                                        Emma Rodriguez
                                    </p>{" "}
                                    <p className="text-sm text-muted-foreground">
                                        English Literature
                                    </p>{" "}
                                </div>
                            </div>{" "}
                        </div>{" "}
                    </div>{" "}
                </div>{" "}
            </section>

            {/* Footer Section */}
        </div>
    );
}
