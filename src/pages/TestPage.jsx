import axios from "@/config/axios";
import { useState } from "react";

export default function TestPage() {
    const [amount, setAmount] = useState(100);
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        try {
            setLoading(true);

            // Validate amount
            if (amount < 1) {
                alert("Minimum amount is ₹1");
                return;
            }

            console.log(
                "Creating order with amount:",
                amount,
                "paise:",
                amount * 100
            );

            // Step 1: Create Razorpay order from backend
            const { data } = await axios.post("/payment/create", {
                amount: amount, // Convert to paise
            });

            console.log("Backend response:", data);

            // Check if we have the required fields from backend
            if (!data.orderId || !data.key) {
                console.error("Order creation failed - missing fields:", data);
                alert("Order creation failed - missing orderId or key");
                return;
            }

            const { orderId, key } = data;

            // Step 2: Configure Razorpay options
            const options = {
                key: key,
                amount: amount, // Use the amount we sent (in paise)
                currency: "INR",
                name: "Test Payment",
                description: "Payment Test",
                order_id: orderId,
                prefill: {
                    name: "Test User",
                    email: "test@example.com",
                    contact: "9999999999",
                },
                handler: async function (response) {
                    try {
                        // Step 3: Verify payment on backend
                        const verifyRes = await axios.post("/payment/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verifyRes.data.success) {
                            alert("Payment successful!");
                        } else {
                            alert("Payment verification failed!");
                        }
                    } catch (error) {
                        console.error("Verification error:", error);
                        alert("Payment verification failed!");
                    }
                },
                modal: {
                    ondismiss: function () {
                        console.log("Payment cancelled");
                    },
                },
            };

            // Step 4: Open Razorpay payment popup
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Payment error:", err);

            // More specific error handling
            if (err.response) {
                // Server responded with error status
                console.error("Server error:", err.response.data);
                alert(
                    `Server error: ${
                        err.response.data?.message || err.response.statusText
                    }`
                );
            } else if (err.request) {
                // Request was made but no response received
                console.error("Network error:", err.request);
                alert("Network error: Unable to connect to server");
            } else {
                // Something else happened
                console.error("Error:", err.message);
                alert(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
            <h2>Payment Test</h2>

            <div style={{ marginBottom: "20px" }}>
                <label
                    style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "bold",
                    }}
                >
                    Enter Amount (₹):
                </label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="1"
                    step="1"
                    style={{
                        padding: "8px 12px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "16px",
                        width: "100%",
                    }}
                    placeholder="Enter amount"
                />
            </div>

            <button
                onClick={handlePayment}
                disabled={amount < 1 || loading}
                style={{
                    padding: "12px 24px",
                    backgroundColor: amount < 1 || loading ? "#ccc" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "16px",
                    cursor: amount < 1 || loading ? "not-allowed" : "pointer",
                    width: "100%",
                }}
            >
                {loading ? "Processing..." : `Pay ₹${amount}`}
            </button>
        </div>
    );
}
