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
    sendAcceptEmail: (email, request) => mockEmailLogger('sendAcceptEmail', email, request),
    sendDonorInstructionEmail: (email, request) => mockEmailLogger('sendDonorInstructionEmail', email, request)
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

  // New: Send donor instruction email upon acceptance
  const sendDonorInstructionEmail = async (donorEmail, request) => {
    if (!donorEmail || !request) {
      throw new Error('Missing required parameters for donor instruction email');
    }

    const {
      bloodType,
      quantity,
      location,
      address,
      requestingEntity,
      requestingEntityId,
      requestorName,
      requestorEmail,
      requestorContactNumber,
    } = request;

    const emailContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Donation Instructions</title>
      <style>
        :root {
          --primary: #d9534f; /* red */
          --secondary: #5bc0de; /* blue */
          --success: #5cb85c; /* green */
          --text: #333;
          --muted: #6c757d;
          --bg: #f7f7fb;
          --card: #ffffff;
          --border: #e9ecef;
        }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; background-color: var(--bg); margin: 0; padding: 24px; color: var(--text); }
        .container { max-width: 760px; margin: auto; background-color: var(--card); padding: 28px; border-radius: 16px; box-shadow: 0 10px 24px rgba(0,0,0,0.08); border: 1px solid var(--border); }
        h1 { color: var(--primary); font-size: 24px; margin: 0 0 8px; }
        .subtitle { color: var(--muted); margin: 0 0 16px; }
        h2 { display: flex; align-items: center; gap: 8px; color: var(--secondary); font-size: 18px; margin: 24px 0 8px; }
        p, li { color: var(--text); line-height: 1.6; }
        .details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; background: #fcfcfd; border: 1px solid var(--border); border-radius: 12px; padding: 12px; margin-top: 12px; }
        .detail-item { background: #fff; border: 1px dashed var(--border); border-radius: 10px; padding: 10px 12px; }
        .label { font-size: 12px; color: var(--muted); }
        .value { font-weight: 600; }
        .section { background: #fbfdff; border-left: 4px solid var(--secondary); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; }
        .section ul { padding-left: 18px; margin: 8px 0; }
        .icon { font-size: 18px; }
        .thank-you { margin-top: 24px; text-align: center; color: var(--success); font-weight: 700; }
        .contact a { color: var(--secondary); text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Thank you for accepting the donation request!</h1>
        <p class="subtitle">Use this guide to prepare, donate confidently, and recover safely.</p>

        <div class="details">
          <div class="detail-item"><div class="label">Requested Blood Type</div><div class="value">${bloodType || 'N/A'}</div></div>
          <div class="detail-item"><div class="label">Quantity Needed</div><div class="value">${quantity || 'N/A'}</div></div>
          <div class="detail-item"><div class="label">Location</div><div class="value">${address || 'N/A'}</div></div>
          <div class="detail-item"><div class="label">Requesting Entity</div><div class="value">${requestingEntity || 'N/A'}${requestingEntityId ? ` (ID: ${requestingEntityId})` : ''}</div></div>
        </div>

        <h2><span class="icon">📞</span> Contact the Requestor</h2>
        <div class="section contact">
          <ul>
            <li><strong>Name:</strong> ${requestorName || 'N/A'}</li>
            <li><strong>Phone:</strong> ${requestorContactNumber ? `<a href="tel:${requestorContactNumber}">${requestorContactNumber}</a>` : 'N/A'}</li>
            <li><strong>Email:</strong> ${requestorEmail ? `<a href="mailto:${requestorEmail}">${requestorEmail}</a>` : 'N/A'}</li>
          </ul>
          <p style="color: var(--muted); font-size: 13px;">Please reach out to coordinate the donation time and any specific requirements.</p>
        </div>

        <h2><span class="icon">⏰</span> Before Your Donation</h2>
        <div class="section">
          <ul>
            <li>Bring a valid ID and any donor card if you have one.</li>
            <li>Get a good night’s sleep and eat a healthy, iron-rich meal.</li>
            <li>Stay hydrated: drink plenty of water in the hours before donation.</li>
            <li>Avoid alcohol for 24 hours before donation.</li>
            <li>Wear clothing with sleeves that can be raised above the elbow.</li>
          </ul>
        </div>

        <h2><span class="icon">🩺</span> Eligibility and Health</h2>
        <div class="section">
          <ul>
            <li>Ensure you feel well and have no cold/flu symptoms.</li>
            <li>If on medication or recently had a procedure, confirm your eligibility with the donation center.</li>
            <li>If you have donated blood recently, observe the recommended interval between donations.</li>
            <li>If unsure, contact the donation center to verify eligibility based on your health history.</li>
          </ul>
        </div>

        <h2><span class="icon">🏥</span> At the Donation Site</h2>
        <div class="section">
          <ul>
            <li>Inform staff of the request reference if needed.</li>
            <li>Relax and follow the guidance from the medical staff.</li>
            <li>Let the staff know immediately if you feel unwell at any point.</li>
          </ul>
        </div>

        <h2><span class="icon">🍎</span> After Donation</h2>
        <div class="section">
          <ul>
            <li>Rest for a short period and have a light snack provided at the center.</li>
            <li>Continue to hydrate and avoid strenuous activities for the rest of the day.</li>
            <li>Keep the bandage on for at least a few hours and avoid heavy lifting with that arm.</li>
            <li>If you feel dizzy or unwell later, sit or lie down and drink fluids.</li>
          </ul>
        </div>

        <div class="thank-you">Thank you for your life-saving contribution! — The Blood+ team</div>
      </div>
    </body>
    </html>`;

    const mailOptions = {
      from: EMAIL,
      to: donorEmail,
      subject: 'Donation Instructions',
      html: emailContent,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending donor instruction email:', error.message);
      throw new Error('Failed to send donor instruction email');
    }
  };


  exportedEmail = {
    sendVerificationEmail,
    sendNotificationEmail,
    sendPasswordResetEmail,
    sendDenyEmail,
    sendAcceptEmail,
    sendDonorInstructionEmail,
  };
} // End of else block

module.exports = exportedEmail;
