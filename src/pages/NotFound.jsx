import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center space-y-8">
                    <div className="space-y-4">
                        <div className="text-9xl font-bold text-black tracking-tighter">
                            404
                        </div>
                        <h1 className="text-4xl font-bold text-black">
                            Page Not Found
                        </h1>
                        <p className="text-lg text-gray-600">
                            Sorry, we couldn't find the page you're looking for.
                            It might have been moved or deleted.
                        </p>
                    </div>

                    <div className="h-px bg-black/10 w-full" />

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="block w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-black/90 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>

                    <div className="pt-4">
                        <p className="text-sm text-gray-500">
                            Lost? Try visiting our{" "}
                            <Link
                                to="/"
                                className="text-black font-medium hover:underline"
                            >
                                Main Page
                            </Link>{" "}
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
