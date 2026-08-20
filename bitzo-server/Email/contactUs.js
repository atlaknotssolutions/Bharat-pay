function getContactMailOptions({ name, email, subject, message }) {
  return {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: `[Contact Form] ${subject || "New message from website"}`,
    replyTo: email,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f4f4f7; margin: 0; padding: 0; }
    .wrapper { width: 100%; background: #f4f4f7; padding: 40px 0; }
    .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 32px 32px 28px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 1.5rem; margin: 0; font-weight: 700; letter-spacing: -0.3px; }
    .header p { color: rgba(255,255,255,0.85); font-size: 0.9rem; margin: 6px 0 0; }
    .body { padding: 32px; }
    .section { margin-bottom: 16px; }
    .label { font-weight: 600; color: #6b7280; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .value { color: #1f2937; font-size: 0.95rem; }
    .message-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; color: #374151; font-size: 0.95rem; line-height: 1.6; margin-top: 8px; }
    .footer { padding: 20px 32px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; }
    .footer p { color: #9ca3af; font-size: 0.78rem; margin: 0; line-height: 1.5; }
    @media only screen and (max-width: 480px) {
      .wrapper { padding: 20px 0; }
      .container { margin: 0 12px; }
      .header { padding: 24px 20px 20px; }
      .body { padding: 24px 20px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Bharat Play</h1>
        <p>New Contact Message</p>
      </div>
      <div class="body">
        <div class="section">
          <div class="label">From</div>
          <div class="value">${name || "(No name)"} &lt;${email || "(No email)"}&gt;</div>
        </div>
        <div class="section">
          <div class="label">Subject</div>
          <div class="value">${subject || "(No subject)"}</div>
        </div>
        <div class="section">
          <div class="label">Message</div>
          <div class="message-box">${(message || "").replace(/\n/g, "<br />")}</div>
        </div>
      </div>
      <div class="footer">
        <p>This message was sent from the Bharat Play website contact form.</p>
      </div>
    </div>
  </div>
</body>
</html>`,
  };
}

module.exports = getContactMailOptions;
