var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: "bodybuddy.reminders@gmail.com",
       pass: "mingchow"
   }
});

smtpTransport.sendMail({
   from: "Body Buddy <bodybuddy.reminder@gmail.com>", // sender address
   to: "andrew.brgs@gmail.com", // comma separated list of receivers
   subject: "Workout Tomorrow!", // Subject line
   text: "Hey you got a workout tomorrow. Go or we'll find you!"
}, function(error, response){
   if(error){
       console.log(error);
   }else{
       console.log("Message sent: " + response.message);
   }
});
