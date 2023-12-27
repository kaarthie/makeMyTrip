const router = require('express').Router();
const razorpay = require('razorpay')
const crypto = require('crypto');

router.post('/order' , (req , res) => {
    try {
        const instance = new razorpay({
            key_id : "rzp_test_lxRT5NF1Dopxfd",
            key_secret : "sEGonS41awMadqWt68JeOl4O"
        })

        const opts = {
            amount : req.body.amount * 100,
            currency : 'INR',
            receipt : "sample_receipt"
        }

        instance.orders.create(opts , (err , order) => {
            if(err){
                console.log(err);
                res.status(500).json({message : "Something went wrong"})
            } else {
                res.status(200).json({ data : order})
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Something went wrong"})
    }
})

router.post("/verify", async (req, res) => {
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			req.body;
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256","sEGonS41awMadqWt68JeOl4O")
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {
			return res.status(200).json({ message: "Payment verified successfully" });
		} else {
			return res.status(400).json({ message: "Invalid signature sent!" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
});

module.exports = router;