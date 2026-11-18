# cproduct_site

## Inquiry form deployment setting

The `/api/inquiry` Vercel function validates submissions and sends them to Pabbly Connect. Configure the Vercel environment variable `PABBLY_WEBHOOK_URL` with the project webhook URL for Production and Preview, then redeploy. The webhook stays out of the browser bundle.

After the Pabbly webhook trigger, add a Google Sheets **Add New Row** action and map these incoming fields to the sheet columns:

| Google Sheets column | Pabbly webhook field |
| --- | --- |
| Name | `name` |
| Email | `email` |
| Product Question | `question` |
| Marketing Consent (`Y` or `N`) | `marketing_consent` |
| Submission date (if provided) | `date` |

The endpoint also sends `source` (`landing_page`) for attribution. The website confirmation means Pabbly accepted the webhook request; Google Sheets will receive rows only after the Google Sheets action is connected and the workflow is switched on.
