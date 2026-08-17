# Purge Pros — contact form via EmailJS

No server, no deploy pipeline, no CORS to configure. The form sends email
straight from the visitor's browser using EmailJS's free tier (200
emails/month). Total setup time: about 5 minutes.

## 1. Create an EmailJS account

Go to https://www.emailjs.com → sign up free.

## 2. Connect your email account ("Service")

1. In the EmailJS dashboard: **Email Services** → **Add New Service**.
2. Pick **Gmail** (or whatever `purgeprosremoval@gmail.com` actually is) and
   follow the prompt to connect it — this is a one-click OAuth connection,
   no app passwords needed.
3. Copy the **Service ID** it generates (looks like `service_abc1234`).

## 3. Create a template

1. **Email Templates** → **Create New Template**.
2. Set the "To email" field to `purgeprosremoval@gmail.com`.
3. In the template body, use these variable names so they match the fields
   the form sends — `{{name}}`, `{{phone}}`, `{{email}}`, `{{message}}`.
   A simple template body works fine:
   ```
   New quote request from the website:

   Name: {{name}}
   Phone: {{phone}}
   Email: {{email}}
   Details: {{message}}
   ```
4. Set "Reply To" to `{{email}}` so you can hit reply and it goes straight
   to the customer.
5. Save, and copy the **Template ID** (looks like `template_xyz9876`).

## 4. Get your Public Key

**Account** → **General** → copy the **Public Key**.

## 5. Wire it into the site

Open `script.js` and fill in the three placeholders near the top of the
"Contact form" section:

```js
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';   // from step 4
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';   // from step 2
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // from step 3
```

Commit and push. GitHub Pages redeploys automatically — no other changes
needed.

## 6. Test it

Submit the form on your live site. You should see the inline success
message, and an email should land in `purgeprosremoval@gmail.com` within
seconds. If it doesn't:
- Check the browser console for an EmailJS error — it usually names the
  problem directly (bad key, bad service/template ID, etc.).
- Check **EmailJS dashboard → Email Services / Templates** to confirm the
  IDs match exactly what's in `script.js`.

## Why this is simpler than the earlier approaches

- No server to host, so no Vercel/Render/etc. account or deploy step.
- No CORS configuration, since EmailJS's SDK handles that for you.
- Your public key is meant to be exposed in frontend code — EmailJS uses
  domain restrictions (set in your account settings) to stop abuse, not
  secrecy of the key.

## Notes

- The honeypot field (`_honey`) is still in the form and still checked in
  `script.js`, so basic bots are still filtered out before anything is sent.
- Free tier is 200 emails/month — plenty for a contact form; upgrade only
  if that's ever not enough.
