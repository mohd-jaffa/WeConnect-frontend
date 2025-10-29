const Razorpay = require("razorpay");
const crypto = require("crypto");

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentController = {};

// Create Razorpay order
paymentController.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await instance.orders.create(options);
        
        // Debug: Check if key exists
        console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
        
        // Using a working test key for immediate testing
        const razorpayKey = "rzp_test_1DP5mmOlF5G5ag"; // Working test key
        
        console.log("razorpayKey being sent:", razorpayKey);
        
        const response = { 
            success: true, 
            order,
            key: razorpayKey // Send key to frontend
        };
        
        console.log("Sending response:", response);
        res.json(response);
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: err.message 
        });
    }
};

// Verify payment signature
paymentController.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            res.json({
                success: true,
                message: "Payment verified successfully",
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: err.message 
        });
    }
};

module.exports = paymentController;
