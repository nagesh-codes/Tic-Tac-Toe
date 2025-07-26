// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// dotenv.config();
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'n66625763@gmail.com',
//     pass: `${process.env.APP_PASSWORD}`
//   },
// });
// const mailOptions = {
//   from: 'n66615763@gmail.com',
//   to: 'nageshcodes0143@gmail.com',
//   subject: 'Hello from Node.js!',
//   text: 'This is a test email sent from a Node.js app using nodemailer.',
// };

// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     return console.error('Error sending email:', error.message);
//   }
//   console.log('Email sent:', info.response);
// });

let ROOMS = {
  "roomA": {
    unique_id: "abc123",
    createdAt: Date.now(),
    createdBy: 'socketID',
    game_status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    users: {
      "userId1": [0, 0],
    },
    draw: 1,
    full: true
  }
};
export let USERS = {
  "socketID": {
    name: "Alice",
    roomId: "roomA",
    email: "example@gmail.com"
  },
};
console.log(USERS['socketID'].name);