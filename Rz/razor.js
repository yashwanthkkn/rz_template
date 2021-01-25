var CryptoJS = require("crypto-js");

const config = {
    RAZOR_PAY_KEY_ID:'rzp_test_ESgS7RA5Iy5Hno',
    RAZOR_PAY_KEY_SECRET:'6zn82Qxu4wI3mLg9lRTYmKi8',
}

module.exports.config = config

module.exports.getHash = (data,secret)=>{
    if(data && secret){
        return CryptoJS.HmacSHA256(data,secret);
    }else{
        return null;
    }
}