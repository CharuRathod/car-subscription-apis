import nodemailer from "nodemailer";


const sendMail = async (options) => {

    const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 465,

    secure: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    tls: {
        rejectUnauthorized: false
    }

});

    console.log("Checking Gmail connection...");


    await transporter.verify();


    console.log("Gmail connected successfully");


    const info = await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: options.email,

        subject: options.subject,

        html: options.html

    });


    console.log("Email sent successfully:", info.messageId);

};


export default sendMail;