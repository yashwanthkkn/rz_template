const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const app = express()
const razor = require('./Rz/razor')
const Razorpay = require('razorpay')

const instance = new Razorpay({
    key_id: razor.config.RAZOR_PAY_KEY_ID,
    key_secret: razor.config.RAZOR_PAY_KEY_SECRET,
});
app.use(cors())
app.set('view engine','ejs')
app.use(bodyparser.urlencoded({extended:true}))
app.get("/order", (req, res) => {
    const options = {
    amount: 10 * 100, 
    currency: "INR",
    receipt: "receipt#1",
    payment_capture: 1,
    };
    instance.orders.create(options, async function (err, order) {
      if (err) {
        return res.render('payment',{msg:"Something went wrong"})
      }
    
    return res.render('payment',{msg:null,order:order,id:razor.config.RAZOR_PAY_KEY_ID});
   });
});


app.post('/callback/:oid',(req,res)=>{
    var oid = req.params.oid;
    var rz_payment_id = req.body.razorpay_payment_id;
    var rz_order_id = req.body.razorpay_order_id;
    var rz_sign = req.body.razorpay_signature;
    if(rz_payment_id && rz_order_id && rz_sign){
      // payment partially success
      var data = `${oid}|${rz_payment_id}`
      var hash = razor.getHash(data,razor.config.RAZOR_PAY_KEY_SECRET)
      console.log(rz_sign);
      console.log(hash)
      // Checking for tampering
      if(rz_sign == hash){
        res.send("Cool")
      }else{
        res.send("Not Cool")
      }

    }else{
      // payment Failed
      res.send('/paymentFailed')
    }
})

app.listen(3000,()=>{
    console.log("Server running on port 3000");
})