# BudgetPro — Full-Stack Setup & Deployment Guide

Complete production-ready website for selling Excel budget templates.
- Monthly Template: ₹19
- Yearly Template: ₹49
- Real Razorpay payments → MongoDB orders → Resend email → Secure download

---

## Project Structure

```
mywebsite/
├── src/
│   ├── App.jsx          ← Full React app (6 pages + admin)
│   └── index.js         ← Entry point
├── public/
│   └── index.html       ← Has Razorpay checkout.js script tag
├── api/                 ← Vercel Serverless Functions (backend)
│   ├── create-order.js  ← POST: create Razorpay order + DB row
│   ├── verify-payment.js← POST: HMAC verify + mark completed
│   ├── send-email.js    ← POST: Resend purchase confirmation
│   ├── settings.js      ← GET/PATCH: live pricing
│   ├── admin-login.js   ← POST: JWT login
│   ├── admin-stats.js   ← GET: sales/revenue (JWT protected)
│   ├── admin-resend.js  ← POST: resend email to customer
│   ├── health.js        ← GET: env var status check
│   ├── download/
│   │   └── [token].js   ← GET: secure file delivery
│   └── lib/
│       ├── db.js         ← MongoDB connection
│       ├── auth.js       ← JWT helpers
│       └── cors.js       ← CORS headers
├── product-files/
│   ├── Monthly_Budget_Template_.xlsx
│   └── Yearly_Budget_Template.xlsx
├── scripts/
│   └── setup-db.js      ← Run once: creates indexes
├── vercel.json           ← Build config (NO runtime key!)
├── package.json
└── .env.example          ← All required env vars
```

---

## Step 1 — MongoDB Atlas (Free)

1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Create free M0 cluster → any region
3. Database Access → Add User → username + strong password
4. Network Access → Add IP → `0.0.0.0/0` (allow all — needed for Vercel)
5. Connect → Drivers → copy connection string
6. Replace `<password>` in the string with your password
7. That string is your `MONGODB_URI`

---

## Step 2 — Razorpay

1. You already have an account
2. Settings → API Keys → Generate Test Key
3. Copy `Key ID` → `RAZORPAY_KEY_ID`
4. Copy `Key Secret` → `RAZORPAY_KEY_SECRET`
5. Use test keys first. When ready for live: complete KYC, switch to live keys

---

## Step 3 — Resend (Email)

1. Sign up: https://resend.com (free: 3,000 emails/month)
2. Domains → Add Domain → verify your domain (or use @resend.dev for testing)
3. API Keys → Create Key → copy it → `RESEND_API_KEY`
4. Set `EMAIL_FROM` = `BudgetPro <noreply@yourdomain.com>`

---

## Step 4 — Upload Your Excel Files

The two `.xlsx` files are in `product-files/`. Upload them to any public host:

**Option A — Vercel Blob (easiest)**
```bash
npm i -g vercel
vercel blob put product-files/Monthly_Budget_Template_.xlsx --public
vercel blob put product-files/Yearly_Budget_Template.xlsx --public
```
Copy the two URLs → `MONTHLY_FILE_URL` and `YEARLY_FILE_URL`

**Option B — Supabase Storage (free)**
1. supabase.com → New project → Storage → New bucket (public)
2. Upload both files → copy public URLs

---

## Step 5 — Deploy to Vercel

```bash
# Install Vercel CLI if needed
npm install -g vercel

# From inside the project folder:
vercel

# Follow prompts:
# - Link to existing project OR create new
# - Framework: Create React App
# - Build command: npm run build  (already in vercel.json)
# - Output directory: build       (already in vercel.json)
```

---

## Step 6 — Add Environment Variables in Vercel

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add ALL of these:

| Variable | Value |
|---|---|
| `RAZORPAY_KEY_ID` | `rzp_test_xxxxx` |
| `RAZORPAY_KEY_SECRET` | `your_secret` |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster...` |
| `MONGODB_DB` | `budgetpro` |
| `RESEND_API_KEY` | `re_xxxxx` |
| `EMAIL_FROM` | `BudgetPro <noreply@yourdomain.com>` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `(choose strong password)` |
| `JWT_SECRET` | `(run: openssl rand -base64 32)` |
| `MONTHLY_FILE_URL` | `https://your-host.com/monthly.xlsx` |
| `YEARLY_FILE_URL` | `https://your-host.com/yearly.xlsx` |
| `SITE_URL` | `https://your-project.vercel.app` |

Then redeploy: `vercel --prod`

---

## Step 7 — Initialize Database

Run once after first deploy (with `.env.local` containing your MONGODB_URI):
```bash
cp .env.example .env.local
# Fill in MONGODB_URI in .env.local
node scripts/setup-db.js
# OR: npm run setup-db
```

This creates indexes and seeds the default prices (₹19/₹49).

---

## Step 8 — Test Everything

1. Visit `/checkout?plan=monthly` → test payment with Razorpay test card:
   - Card: `4111 1111 1111 1111`
   - Expiry: any future date
   - CVV: any 3 digits
2. Confirm `/success` page shows with Download button
3. Click Download → file should download
4. Check email for confirmation with download link
5. Visit `/admin` → login → confirm order appears in Orders tab
6. Try changing price in Pricing tab → reload checkout → price updates live
7. Check `/api/health` → all env vars should show `true`

---

## Going Live (Real Money)

1. Complete Razorpay KYC/activation (takes 1-3 days)
2. Switch `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` to live keys (`rzp_live_...`)
3. Update `SITE_URL` to your real domain
4. Redeploy: `vercel --prod`

---

## Admin Panel

URL: `yourdomain.com/admin`

| Tab | What it does |
|---|---|
| Overview | Total revenue, orders, downloads |
| Orders | Customer list with Resend Email button |
| Pricing | Change ₹19/₹49 live without redeploy |

---

## Common Issues

**Build fails on Vercel**: Make sure `vercel.json` has NO `functions.runtime` key.
The correct `vercel.json` is just:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Payment succeeds but download fails**: Check `MONTHLY_FILE_URL` and
`YEARLY_FILE_URL` are set and publicly accessible.

**Email not received**: Check spam folder. Verify your Resend domain.
Check `EMAIL_FROM` matches your verified Resend domain.

**Admin login fails**: Double-check `ADMIN_USERNAME`, `ADMIN_PASSWORD`,
and `JWT_SECRET` are all set in Vercel environment variables.
