const {
  getClientIp,
  detectVPN,
} = require("../../models/FraudEventModel");

app.get("/api/security/check-vpn", async (req, res) => {
  try {
    
    const clientIp = getClientIp(req);

    console.log("=================================");
    console.log("CLIENT IP:", clientIp);
    console.log("REQ.IP:", req.ip);
    console.log("X-FORWARDED-FOR:", req.headers["x-forwarded-for"]);
    console.log("X-REAL-IP:", req.headers["x-real-ip"]);
    console.log("CF-IP:", req.headers["cf-connecting-ip"]);
    console.log("=================================");

    /**
     * Detect VPN
     */
    const vpnResult = await detectVPN(clientIp);

    return res.status(200).json({
      success: true,

      ip: clientIp,

      vpn: vpnResult,
    });
  } catch (error) {
    console.error("VPN route error:", error);

    return res.status(500).json({
      success: false,
      message: "VPN detection failed",
    });
  }
});