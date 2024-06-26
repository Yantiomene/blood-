const nodemailer = require('nodemailer');
const { EMAIL, PASSWORD, SERVER_URL } = require('../constants');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: EMAIL, // Replace with your email
      pass: PASSWORD, // Replace with your email app password
  },
  // For Gmail, use the following settings:
  secure: true, 
  requireTLS: true,
  port: 587, // or 465 for SSL
});

const sendVerificationEmail = (email, verificationCode) => {

    const emailContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 20px;
        }
    
        .container {
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    
        h1 {
          color: #d9534f;
        }
    
        p {
          color: #333;
        }
    
        .verification-code {
          font-size: 24px;
          font-weight: bold;
          color: #5bc0de;
        }
    
        .expire-info {
          color: #777;
        }
    
        .thank-you {
          margin-top: 20px;
          text-align: center;
          color: #5cb85c;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Email Verification</h1>
        <p>Your verification code is: <span class="verification-code">${verificationCode}</span></p>
        <p>Or click the following link to verify your email: <a href="http://localhost:8000/api/verifyEmail/${verificationCode}" target="_blank">Verify Email</a></p>
        <p class="expire-info">Note: This code will expire in 1 hour.</p>
        <div class="thank-you">Thank you, the Blood+ team</div>
      </div>
    </body>
    </html>
    `;    

    const mailOptions = {
        from: EMAIL,
        to: email,
        subject: 'Verify your email',
        html: emailContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error.message);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};


const sendNotificationEmail = async (to, subject, text, html) => {
  const mailOptions = {
      from: EMAIL,
      to,
      subject,
      text,
      html,
  };

  // Send email
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error sending email:', error.message);
    } else {
        console.log('Email sent:', info.response);
    }
  });
};


const sendPasswordResetEmail = (email, resetToken) => {
  const emailContent = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }

      .container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
  
      h1 {
        color: #d9534f;
      }
  
      p {
        color: #333;
      }
  
      .reset-code {
        font-size: 24px;
        font-weight: bold;
        color: #5bc0de;
      }
  
      .expire-info {
        color: #777;
      }
  
      .thank-you {
        margin-top: 20px;
        text-align: center;
        color: #5cb85c;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Password Reset</h1>
      <p>Your password reset code is: <span class="reset-code">${resetToken}</span></p>
      <p>Or click the following link to reset your password: <a href="http://localhost:8000/api/resetPassword/${resetToken}" target="_blank">Reset Password</a></p>
      <p class="expire-info">Note: This code will expire in 1 hour.</p>
      <div class="thank-you">Thank you, the Blood+ team</div>
    </div>
  </body>
  </html>
  `;    

  const mailOptions = {
      from: EMAIL,
      to: email,
      subject: 'Password Reset',
      html: emailContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log('Error sending email:', error.message);
      } else {
          console.log('Email sent:', info.response);
      }
  });
};


const sendDenyEmail = async (requestorEmail, reason) => {
  if (!requestorEmail || !reason) {
    throw new Error('Missing required parameters');
  }

  const emailContent = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request Denied</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }

      .container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
  
      h1 {
        color: #d9534f;
      }
  
      p {
        color: #333;
      }
  
      .reason {
        font-size: 24px;
        font-weight: bold;
        color: #d9534f;
      }
  
      .thank-you {
        margin-top: 20px;
        text-align: center;
        color: #5cb85c;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Request Denied</h1>
      <p>Your request has been denied. Donor Reason: <span class="reason">${reason}</span></p>
      <div class="thank-you">Thank you, the Blood+ team</div>
    </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: EMAIL,
    to: requestorEmail,
    subject: 'Request Denied',
    html: emailContent,
  };

  // Send email
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error sending email:', error.message);
    } else {
        console.log('Email sent:', info.response);
    }
  });
}

const sendAcceptEmail = async (requestorEmail, requestBloodType, donor) => {
  if (!requestorEmail || !requestBloodType || !donor) {
    throw new Error('Missing required parameters');
  }

  const emailContent = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request Accepted</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }

      .container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
  
      h1 {
        color: #b21f2d;
      }
  
      p {
        color: #333;
      }
  
      .reason {
        font-size: 20px;
        font-weight: bold;
        color: #green;
      }
  
      .thank-you {
        margin-top: 20px;
        text-align: center;
        color: #5cb85c;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Request Accepted</h1>
      <p>Your request of blood type ${requestBloodType} has been accepted. </br> Donor details: </br><span class="reason">Email: ${donor.email}</span></p>
      <p class="reason">Contact: ${donor.contactNumber}</p>
      <p class="reason">Name: ${donor.username}</p>
      <div class="thank-you">Thank you, the Blood+ team</div>
    </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: EMAIL,
    to: requestorEmail,
    subject: 'Request Accepted',
    html: emailContent,
  };

  // Send email
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error sending email:', error.message);
    } else {
        console.log('Email sent:', info.response);
    }
  });
}

module.exports = { 
  sendNotificationEmail, 
  sendVerificationEmail, 
  sendPasswordResetEmail,
  sendDenyEmail,
  sendAcceptEmail,
 }; 
