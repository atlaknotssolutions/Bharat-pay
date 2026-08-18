function getLoginMailOptions(email, name, otp) {
  const otpMarkup = otp
    ? `<p>Your login OTP is <strong>${otp}</strong>. Enter it on BharatPlay to complete your sign-in securely.</p>`
    : "<p>Your BharatPlay account was just accessed. If this was not you, please reset your password immediately.</p>";

  return {
    from: process.env.EMAIL,
    to: email,
    subject: "BharatPlay Login Verification",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>BharatPlay Login Verification</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f6f8fa; margin: 0; padding: 0; }
    .container { max-width: 520px; margin: 40px auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); padding: 32px; }
    .brand { font-size: 1.6rem; font-weight: 700; color: #d72638; letter-spacing: 0.04em; margin-bottom: 8px; text-align: center; }
    .title { font-size: 1.45rem; color: #111827; margin: 16px 0 8px; text-align: center; }
    .content { color: #374151; font-size: 1rem; margin-bottom: 24px; text-align: center; }
    .otp-box { display: inline-block; background: #fff1f2; border: 1px solid #fecdd3; color: #881337; font-weight: 700; font-size: 2rem; letter-spacing: 0.22em; padding: 14px 20px; border-radius: 10px; margin: 12px 0; }
    .footer { color: #6b7280; font-size: 0.9rem; text-align: center; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="brand">BharatPlay</div>
    <div class="title">Login Verification</div>
    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>
      ${otp ? `<p>Use the code below to continue signing in to BharatPlay.</p><div class="otp-box">${otp}</div>` : otpMarkup}
    </div>
    <div class="footer">
      &copy; 2026 BharatPlay. All rights reserved.
    </div>
  </div>
</body>
</html>`,
  };
}

module.exports = getLoginMailOptions;
