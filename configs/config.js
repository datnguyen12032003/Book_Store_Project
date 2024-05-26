module.exports = {
  secretKey: "12345-67890-09876-54321",
  url: "mongodb://localhost:27017/bookStore",
  //vnpay
  vnp_TmnCode: "87O1J1BN",
  vnp_HashSecret: "PVNIKJYAEJFSMROEIQOHXOMYKZCSRYGZ",
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  vnp_ReturnUrl: "http://localhost:3000/api/orders/vnpay_info",
};
