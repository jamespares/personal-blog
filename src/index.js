/**
 * Cloudflare Email Worker
 * 
 * Handles incoming emails to your domain and either:
 * 1. Forwards them to a destination address
 * 2. Sends an auto-reply or notification using the SEND_EMAIL binding
 * 
 * To deploy: npx wrangler deploy
 */

export default {
  async email(message, env, ctx) {
    // Log incoming email (visible in Wrangler logs)
    console.log(`Received email from ${message.from} to ${message.to} | Subject: ${message.headers.get("subject") || "(no subject)"}`);

    try {
      // === OPTION 1: Forward to your personal email ===
      const forwardTo = env.FORWARD_TO_EMAIL || "jamesedpares@gmail.com";
      
      await message.forward(forwardTo);
      console.log(`Forwarded email to ${forwardTo}`);

      // === OPTION 2: Send a notification/auto-reply using SEND_EMAIL binding ===
      // Uncomment below to also send a custom email via Cloudflare
      /*
      if (env.SEND_EMAIL) {
        await env.SEND_EMAIL.send({
          from: "hi@jamespares.me",   // Your vanity email address
          to: message.from,           // Reply to the sender
          subject: "Re: " + (message.headers.get("subject") || "Your email"),
          text: "Thanks for reaching out! I've received your email and will get back to you soon.\n\n- James Pares",
          // Optional HTML version:
          // html: "<p>Thanks for reaching out!</p>"
        });
        console.log("Sent auto-reply to " + message.from);
      }
      */

    } catch (err) {
      console.error("Email handling failed:", err);
      // Still throw so Cloudflare knows delivery failed
      throw err;
    }
  }
};
