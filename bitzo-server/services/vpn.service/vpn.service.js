const axios = require("axios");

async function detectVPN(ip) {
  if (!ip || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return { isVPN: false, isProxy: false, isHosting: false };
  }

  try {
    // Free tier – production me IPQualityScore / ipinfo.io recommend
    const { data } = await axios.get(
      `http://ip-api.com/json/${ip}?fields=status,proxy,hosting,mobile,query,country,city`,
      { timeout: 3000 }
    );

    if (data.status !== "success") {
      return { isVPN: false, isProxy: false, isHosting: false };
    }

    return {
      isVPN: Boolean(data.proxy || data.hosting),
      isProxy: Boolean(data.proxy),
      isHosting: Boolean(data.hosting),
      isMobile: Boolean(data.mobile),
      country: data.country,
      city: data.city,
      ip: data.query,
    };
  } catch (err) {
    console.warn("VPN detection failed:", err.message);
    return { isVPN: false, isProxy: false, isHosting: false, error: true };
  }
}

module.exports = { detectVPN };