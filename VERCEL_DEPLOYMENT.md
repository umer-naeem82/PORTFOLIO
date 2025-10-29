# Vercel Deployment Guide

## 📋 Pre-Deployment Checklist

✅ Your project structure is ready
✅ `vercel.json` configuration file created
✅ `requirements.txt` at root level created
✅ API entry point created at `api/index.py`

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Push Changes to GitHub

```bash
cd "/home/umer/Desktop/Example Testing/Portfolio"
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### Step 2: Sign Up/Login to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### Step 3: Import Your Project

1. After logging in, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"PORTFOLIO"** (umer-naeem82/PORTFOLIO)
4. Click **"Import"** next to it

### Step 4: Configure Project Settings

**Framework Preset:** Other (Vercel will auto-detect)

**Root Directory:** Leave as `./` (root)

**Build Settings:**
- Build Command: Leave empty or use default
- Output Directory: Leave empty
- Install Command: `pip install -r requirements.txt`

### Step 5: Add Environment Variables ⚠️ IMPORTANT

Before deploying, you MUST add your Gemini API key:

1. In the project configuration page, find **"Environment Variables"** section
2. Add the following variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** `your_actual_gemini_api_key_here`
   - **Environment:** Select all (Production, Preview, Development)

**How to get Gemini API Key:**
- Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- Sign in with your Google account
- Click "Create API Key"
- Copy the key and paste it in Vercel

### Step 6: Deploy

1. Click **"Deploy"** button
2. Wait for the build process (usually 1-3 minutes)
3. Once complete, you'll see "🎉 Congratulations!" message
4. Your site will be live at: `https://your-project-name.vercel.app`

### Step 7: Custom Domain (Optional)

1. Go to your project dashboard on Vercel
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

## 🔧 Important Configuration Details

### What We Did:

1. **Created `api/index.py`** - Entry point for Vercel serverless functions
2. **Updated `vercel.json`** - Routing configuration for static files and API
3. **Added root `requirements.txt`** - Python dependencies for Vercel

### File Structure for Vercel:
```
Portfolio/
├── api/
│   └── index.py           # Vercel serverless function entry
├── backend/
│   ├── app/
│   │   └── main.py        # FastAPI application
│   └── data/
│       ├── portfolio.json
│       └── ai_context.txt
├── static/
│   ├── css/
│   ├── js/
│   └── images/
├── templates/
│   └── index.html
├── requirements.txt       # Root level for Vercel
├── vercel.json           # Vercel configuration
└── README.md
```

## 🐛 Troubleshooting

### Build Fails
- Check that `requirements.txt` is at root level
- Verify all Python package versions are compatible
- Check build logs in Vercel dashboard

### 500 Internal Server Error
- Verify `GEMINI_API_KEY` environment variable is set correctly
- Check function logs in Vercel dashboard → "Functions" tab

### Static Files Not Loading
- Ensure `static/` folder structure is correct
- Check that images are committed to Git (not in `.gitignore`)
- Verify routes in `vercel.json` are correct

### AI Chatbot Not Working
- Confirm `GEMINI_API_KEY` is valid and has quota
- Check that `backend/data/ai_context.txt` exists
- Review function logs for API errors

## 📊 Post-Deployment

### Monitor Your Site:
1. **Analytics:** Vercel Dashboard → Your Project → Analytics
2. **Logs:** Vercel Dashboard → Your Project → Functions → View Logs
3. **Performance:** Check Speed Insights in dashboard

### Update Your Site:
Simply push changes to GitHub:
```bash
git add .
git commit -m "Update portfolio"
git push origin main
```
Vercel will automatically redeploy!

## 🎯 Next Steps After Deployment

1. **Test all features:**
   - Homepage loads correctly
   - Projects display properly
   - AI chatbot responds
   - Static files (CSS, JS, images) load

2. **Share your portfolio:**
   - Update your resume with the Vercel URL
   - Add it to your LinkedIn profile
   - Share on social media

3. **Optional improvements:**
   - Set up custom domain
   - Enable Vercel Analytics
   - Configure performance monitoring

## 📞 Need Help?

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: support@vercel.com
- GitHub Issues: Create issue in your repository

---

**Your deployment URL will be:** `https://portfolio-[random-string].vercel.app`

You can customize this in Vercel project settings!
