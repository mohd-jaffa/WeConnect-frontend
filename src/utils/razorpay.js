import axios from "@/config/axios";
import UserContext from "@/context/UserContext";
import { useContext } from "react";
import { toast } from "sonner";

export default function useRazorpayPayment() {
    const { user } = useContext(UserContext);

    const handlePayment = async (sessionId) => {
        return new Promise(async (resolve) => {
            try {
                const { data } = await axios.post(
                    "/payment/create",
                    {
                        sessionId: sessionId,
                    },
                    {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    }
                );
                console.log("Backend response:", data);
                if (!data.orderId || !data.key) {
                    console.error(
                        "Order creation failed - missing fields:",
                        data
                    );
                    toast.error(
                        "Order creation failed - missing orderId or key"
                    );
                    return resolve(false);
                }
                const { orderId, key, amount } = data;
                const options = {
                    key: key,
                    amount: amount,
                    currency: "INR",
                    name: "WeConnect",
                    description: "Slot Booking Payment",
                    order_id: orderId,
                    prefill: {
                        name: user.name,
                        email: user.email,
                        contact: "9999999999",
                    },
                    handler: async function (response) {
                        try {
                            const verifyRes = await axios.post(
                                "/payment/verify",
                                {
                                    razorpay_order_id:
                                        response.razorpay_order_id,
                                    razorpay_payment_id:
                                        response.razorpay_payment_id,
                                    razorpay_signature:
                                        response.razorpay_signature,
                                },
                                {
                                    headers: {
                                        Authorization:
                                            localStorage.getItem("token"),
                                    },
                                }
                            );
                            if (verifyRes.data.success) {
                                toast.success("Payment successful!");
                                await axios.post(
                                    "/payment/history",
                                    {
                                        amount: amount / 100,
                                        orderId: orderId,
                                        userId: user._id,
                                        sessionId: sessionId,
                                        status: "success",
                                    },
                                    {
                                        headers: {
                                            Authorization:
                                                localStorage.getItem("token"),
                                        },
                                    }
                                );
                                return resolve(true);
                            } else {
                                toast.error("Payment verification failed!");
                                await axios.post(
                                    "/payment/history",
                                    {
                                        amount: amount / 100,
                                        orderId: orderId,
                                        userId: user._id,
                                        sessionId: sessionId,
                                        status: "failed",
                                    },
                                    {
                                        headers: {
                                            Authorization:
                                                localStorage.getItem("token"),
                                        },
                                    }
                                );
                                return resolve(false);
                            }
                        } catch (error) {
                            console.error("Verification error:", error);
                            toast.error("Payment verification failed!");
                            await axios.post(
                                "/payment/history",
                                {
                                    amount: amount / 100,
                                    orderId: orderId,
                                    userId: user._id,
                                    sessionId: sessionId,
                                    status: "failed",
                                },
                                {
                                    headers: {
                                        Authorization:
                                            localStorage.getItem("token"),
                                    },
                                }
                            );
                            return resolve(false);
                        }
                    },
                    modal: {
                        ondismiss: async function () {
                            console.log("Payment cancelled");
                            await axios.post(
                                "/payment/history",
                                {
                                    amount: amount / 100,
                                    orderId: orderId,
                                    userId: user._id,
                                    sessionId: sessionId,
                                    status: "failed",
                                },
                                {
                                    headers: {
                                        Authorization:
                                            localStorage.getItem("token"),
                                    },
                                }
                            );
                            return resolve(false);
                        },
                    },
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            } catch (err) {
                console.error("Payment error:", err);
                await axios.post(
                    "/payment/history",
                    {
                        amount: "-",
                        orderId: orderId,
                        userId: user._id,
                        sessionId: sessionId,
                        status: "success",
                    },
                    {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    }
                );
                return resolve(false);
            }
        });
    };
    return { handlePayment };
}
