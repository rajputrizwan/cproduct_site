# cproduct_site

## Inquiry form deployment setting

The `/api/inquiry` Vercel function sends validated form submissions to Pabbly Connect. Configure the Vercel environment variable `PABBLY_WEBHOOK_URL` with the project webhook URL for Production and Preview, then redeploy. The webhook stays out of the browser bundle. The destination Google Sheets workflow should map `name`, `email`, `message`, `marketing_opt_in`, `submitted_at`, and `source`.
