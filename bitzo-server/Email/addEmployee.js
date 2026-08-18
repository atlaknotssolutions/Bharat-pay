module.exports = function getAddEmployeeMailOptions(
  email,
  name,
  role,
  team,
  experience,
  password,
) {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: "Welcome to BharatPlay - Your Account Details",
    html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Welcome to BharatPlay</title>
        <style>
          body { font-family: Arial, sans-serif; background: #f6f8fa; margin: 0; padding: 0; }
          .container { max-width: 520px; margin: 40px auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); padding: 32px; }
          .header { text-align: center; }
          .title { font-size: 1.6rem; color: #d72638; margin: 16px 0 8px; }
          .details { background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 16px; margin: 18px 0; }
          .details p { margin: 8px 0; font-size: 1rem; color: #374151; }
          .footer { color: #6b7280; font-size: 0.9rem; text-align: center; margin-top: 32px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="title">Welcome to BharatPlay!</div>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>You have been added to BharatPlay as a new employee. Below are your account details:</p>
            <div class="details">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Role:</strong> ${role}</p>
              <p><strong>Team / Department:</strong> ${team}</p>
              <p><strong>Experience:</strong> ${experience} years</p>
              <p><strong>Temporary Password:</strong> <span style="color:#b91c1c; font-weight:700;">${password}</span></p>
            </div>
            <p>Please use these credentials to log in for the first time. You can change your password after logging in.</p>
            <p>If you have any questions, feel free to contact the admin team.</p>
          </div>
          <div class="footer">
            &copy; 2026 BharatPlay. All rights reserved.
          </div>
        </div>
      </body>
      </html>`,
  };
};
