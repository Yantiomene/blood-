const nodemailer = require('nodemailer');
const { EMAIL, PASSWORD, SERVER_URL } = require('../constants');

let exportedEmail;

// In test environment, skip email sending to avoid hanging Jest
if (process.env.NODE_ENV === 'test') {
  const mockEmailLogger = (operation, ...args) => {
    console.log(`[TEST] ${operation} called with:`, args);
  };

  exportedEmail = {
    sendVerificationEmail: (email, code) => mockEmailLogger('sendVerificationEmail', email, code),
    sendPasswordResetEmail: (email, token) => mockEmailLogger('sendPasswordResetEmail', email, token),
    sendNotificationEmail: (to, subject, text, html) => mockEmailLogger('sendNotificationEmail', to, subject),
    sendDenyEmail: (email, reason) => mockEmailLogger('sendDenyEmail', email, reason),
    sendAcceptEmail: (email, request) => mockEmailLogger('sendAcceptEmail', email, request)
  };
} else {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL, // Replace with your email
        pass: PASSWORD, // Replace with your email app password
    },
    // For Gmail, use the following settings:
    secure: false,
    requireTLS: true,
    port: 587,
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
          <p>Or click the following link to verify your email: <a href="${SERVER_URL}/api/verifyEmail/${verificationCode}" target="_blank">Verify Email</a></p>
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
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.log('Error sending email:', error.message);
      throw error;
    }
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
        <p>Or click the following link to reset your password: <a href="${SERVER_URL}/api/resetPassword/${resetToken}" target="_blank">Reset Password</a></p>
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
          font-size: 18px;
          color: #d9534f;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Donation Request Denied</h1>
        <p>We regret to inform you that your donation request has been denied.</p>
        <p class="reason">Reason: ${reason}</p>
        <p>If you have any questions, please contact our support team.</p>
        <div class="thank-you">Thank you, the Blood+ team</div>
      </div>
    </body>
    </html>
    `;
  
    const mailOptions = {
      from: EMAIL,
      to: requestorEmail,
      subject: 'Donation Request Denied',
      html: emailContent,
    };
  
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending deny email:', error.message);
      throw new Error('Failed to send deny email');
    }
  };
  
  const sendAcceptEmail = async (requestorEmail, bloodType, donor) => {
    if (!requestorEmail || !bloodType || !donor) {
      throw new Error('Missing required parameters');
    }

    const donationDetails = {
      donorName: donor.username || donor.name,
      contact: donor.contactNumber || donor.email,
      dateTime: new Date().toLocaleString()
    };

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
          color: #5cb85c;
        }
  
        p {
          color: #333;
        }
  
        .details {
          font-size: 18px;
          color: #5bc0de;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Donation Request Accepted</h1>
        <p>Good news! Your donation request has been accepted.</p>
        <div class="details">
          <p><strong>Donor Name:</strong> ${donationDetails.donorName}</p>
          <p><strong>Contact:</strong> ${donationDetails.contact}</p>
          <p><strong>Date and Time:</strong> ${donationDetails.dateTime}</p>
        </div>
        <p>Please reach out to the donor to coordinate further details.</p>
        <div class="thank-you">Thank you, the Blood+ team</div>
      </div>
    </body>
    </html>
    `;
  
    const mailOptions = {
      from: EMAIL,
      to: requestorEmail,
      subject: 'Donation Request Accepted',
      html: emailContent,
    };
  
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending accept email:', error.message);
      throw new Error('Failed to send accept email');
    }
  }; // End of sendAcceptEmail function


  exportedEmail = {
    sendVerificationEmail,
    sendNotificationEmail,
    sendPasswordResetEmail,
    sendDenyEmail,
    sendAcceptEmail,
  };
} // End of else block

module.exports = exportedEmail;
