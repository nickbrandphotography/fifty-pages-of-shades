# Deploy Bodyscapes to Vercel (GitHub method)

You have Node, GitHub and Vercel ready, so this takes about 10 minutes. Commands are shown for **Windows PowerShell**.
Run them inside the site folder.

---

## 0. Open a terminal in the site folder

In File Explorer, go to `C:\Project BS\Body Scapes\site`, then in the address bar type `powershell` and press Enter.
(You should now have a terminal already pointed at the site folder.)

## 1. Remove the leftover `.git` folder

My sandbox left an empty, broken `.git` folder. Delete it so you start clean:

```powershell
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue
```

## 2. Check it runs locally (optional but reassuring)

```powershell
npm install
npm run dev
```

Open http://localhost:3000 in your browser. Click around — gallery, an artwork page (try the floating/frame toggle and size/frame
buttons), the journal. When happy, press `Ctrl + C` in the terminal to stop it.

## 3. Put it on GitHub

```powershell
git init
git add -A
git commit -m "Bodyscapes website"
```

Now create an **empty** repository on GitHub:
1. Go to https://github.com/new
2. Name it `bodyscapes` (or anything). **Do not** tick "Add a README" / .gitignore / licence — leave it empty.
3. Click **Create repository**. GitHub shows you a URL like `https://github.com/yourname/bodyscapes.git`.

Push your code to it (replace the URL with yours):

```powershell
git branch -M main
git remote add origin https://github.com/yourname/bodyscapes.git
git push -u origin main
```

## 4. Import into Vercel

1. Go to https://vercel.com/new
2. Under **Import Git Repository**, pick your `bodyscapes` repo (authorise GitHub if asked).
3. Vercel auto-detects **Next.js** — leave every setting as-is.
4. Click **Deploy**.

In ~1–2 minutes you'll get a live URL like `https://bodyscapes.vercel.app`. That's it — you're live.

## 5. (Optional now) Turn on real enquiry emails

The contact form works immediately — until you do this step, it opens the visitor's email app. To have enquiries
emailed to you instead:

1. Sign up at https://resend.com, add and verify your domain (`bodyscapes.com.au`), and create an API key.
2. In Vercel → your project → **Settings → Environment Variables**, add:
   - `RESEND_API_KEY` = your key
   - `ENQUIRY_TO` = `hello@bodyscapes.com.au` (where you want enquiries sent)
   - `ENQUIRY_FROM` = `Bodyscapes <enquiries@bodyscapes.com.au>` (must be on your verified domain)
3. Redeploy (Vercel → Deployments → ⋯ → Redeploy), or just push any change.

## 6. Connect your domain

1. Vercel → your project → **Settings → Domains** → add `bodyscapes.com.au` (and `www.bodyscapes.com.au`).
2. Vercel shows the DNS records to set. Add them at whoever manages your domain's DNS (the registrar).
3. SSL is automatic. Once DNS propagates (minutes to a few hours), the site is live on your domain.

> Note: `bodyscapes.com.au` currently points at the temporary site. Switching the DNS to Vercel replaces it — so
> only do step 6 when you're happy with the new site.

---

## Making changes later

Edit files in the `site` folder, then:

```powershell
git add -A
git commit -m "what you changed"
git push
```

Vercel automatically rebuilds and redeploys every push. Common edits:
- **Prices / artworks:** edit `..\artworks\pricing.csv` or `artworks.csv`, then run `node scripts/build-data.mjs`
  (and `python scripts/build_images.py` if you changed images), then commit + push.
- **New journal articles:** add to `lib/journal.ts`.
- **Exhibitions / press / testimonials:** add to `lib/authority.ts`.
