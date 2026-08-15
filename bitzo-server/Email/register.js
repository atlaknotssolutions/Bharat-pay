function getRegisterMailOptions(email, name) {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: "Welcome to BharatPay",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to BharatPay</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f6f8fa; margin: 0; padding: 0; }
    .container { max-width: 520px; margin: 40px auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); padding: 32px; }
    .brand { font-size: 1.6rem; font-weight: 700; color: #d72638; letter-spacing: 0.04em; margin-bottom: 8px; text-align: center; }
    .title { font-size: 1.45rem; color: #111827; margin: 16px 0 8px; text-align: center; }
    .content { color: #374151; font-size: 1rem; margin-bottom: 24px; text-align: center; }
    .footer { color: #6b7280; font-size: 0.9rem; text-align: center; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="brand">BharatPay</div>
    <div class="title">Registration Successful</div>
    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your BharatPay account has been created successfully. You can now sign in and continue using your dashboard securely.</p>
    </div>
    <div class="footer">
      &copy; 2026 BharatPay. All rights reserved.
    </div>
  </div>
</body>
</html>`,
  };
}

module.exports = getRegisterMailOptions;
