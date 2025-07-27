export const otpVerification = (email: string, otp: string) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 24px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.8;
          }
          .otp-box {
              margin: 20px auto;
              font-size: 28px;
              font-weight: bold;
              letter-spacing: 6px;
              background: #e8f5e9;
              color: #4CAF50;
              padding: 15px;
              text-align: center;
              border-radius: 6px;
              border: 2px dashed #4CAF50;
              width: fit-content;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Verify Your Email</div>
          <div class="content">
              <h1>Hello ${email},</h1>
              <p>You're almost ready to start organizing your thoughts with <strong>Note App</strong>.</p>
              <p>Use the OTP below to verify your email address:</p>
              <div class="otp-box">${otp}</div>
              <p>This code will expire in 5 minutes. Please do not share it with anyone.</p>
              <p>If you did not request this verification, you can safely ignore this message.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Note App. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;
