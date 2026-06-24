# foodbridge

**Bridging surplus food to people who need it.**

foodbridge is an open-source web app that connects **donors**, **NGOs**, and **volunteers** so good food does not go to waste. This guide explains how to run the project on your computer and how to contribute using GitHub — even if you have never used GitHub before.

---

## Table of contents

1. [What this project does](#what-this-project-does)
2. [What you need installed](#what-you-need-installed)
3. [Run the project on your computer](#run-the-project-on-your-computer)
4. [GitHub basics (first time?)](#github-basics-first-time)
5. [How to contribute step by step](#how-to-contribute-step-by-step)
6. [What to work on](#what-to-work-on)
7. [Project structure](#project-structure)
8. [Before you submit a Pull Request](#before-you-submit-a-pull-request)
9. [Common problems](#common-problems)
10. [Get help](#get-help)

---

## What this project does

| Role | What they do on foodbridge |
|------|---------------------------|
| **Donor** | Posts surplus food available for pickup |
| **NGO** | Browses donations and claims food for their community |
| **Volunteer** | Helps with pickups and delivery |

**Public pages:** landing site, login, register  
**App pages:** role-based dashboards (`/donor`, `/ngo`, `/volunteer`)

**Tech stack:** Next.js 15 · TypeScript · Tailwind CSS · Supabase · Zod

---

## What you need installed

Install these once on your computer:

| Tool | Why you need it | Download |
|------|-----------------|----------|
| **Node.js** (v18 or newer) | Runs the app | [nodejs.org](https://nodejs.org) |
| **Git** | Saves and shares code changes | [git-scm.com](https://git-scm.com) |
| **A code editor** | Cursor or VS Code recommended | [cursor.com](https://cursor.com) or [code.visualstudio.com](https://code.visualstudio.com) |
| **A GitHub account** | Free — where the code lives | [github.com/join](https://github.com/join) |

After installing, open a terminal and check everything works:

```bash
node -v
git --version
```

You should see version numbers, not errors.

---

## Run the project on your computer

### Step 1 — Copy the project from GitHub

```bash
git clone https://github.com/SoubhagyaJain/Food-Bridge.git
cd Food-Bridge
```

### Step 2 — Install dependencies

```bash
npm install
```

This downloads the libraries the project needs. It may take a minute.

### Step 3 — Set up environment variables (optional for now)

```bash
copy .env.example .env.local
```

Open `.env.local` in your editor. For basic UI work you can leave the placeholder values. To connect a real database later, add your Supabase URL and key from [supabase.com](https://supabase.com).

### Step 4 — Start the app

```bash
npm run dev
```

Open your browser and go to: **http://localhost:3000**

You should see the foodbridge landing page.

### Useful commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start development server (use while coding) |
| `npm run build` | Check that the project builds without errors |
| `npm run lint` | Check code style |
| `npm run typecheck` | Check TypeScript types |

Press `Ctrl + C` in the terminal to stop the dev server.

---

## GitHub basics (first time?)

Think of GitHub like **Google Docs for code**, with a full history of every change.

### Words you will hear

| Word | Plain English |
|------|---------------|
| **Repository (repo)** | The project folder on GitHub — [Food-Bridge](https://github.com/SoubhagyaJain/Food-Bridge) |
| **Clone** | Download a copy of the repo to your computer |
| **Fork** | Your own copy of the repo on *your* GitHub account |
| **Branch** | A separate workspace for one feature or fix |
| **Commit** | A saved snapshot of your changes with a short message |
| **Push** | Upload your commits from your computer to GitHub |
| **Pull Request (PR)** | Asking the team to review and merge your changes into the main project |

### How changes flow

```
Your computer  →  your branch on GitHub  →  Pull Request  →  main project
   (edit)            (push)                  (review)         (merged!)
```

You never edit the main `main` branch directly. You always work on a **branch**, then open a **Pull Request**.

---

## How to contribute step by step

Follow this every time you add a feature or fix a bug.

### Step 1 — Fork the repository

A **fork** is your personal copy of foodbridge on GitHub.

1. Go to [github.com/SoubhagyaJain/Food-Bridge](https://github.com/SoubhagyaJain/Food-Bridge)
2. Click the **Fork** button (top right)
3. Click **Create fork**

You now have `https://github.com/YOUR-USERNAME/Food-Bridge`.

### Step 2 — Clone your fork to your computer

Replace `YOUR-USERNAME` with your real GitHub username:

```bash
git clone https://github.com/YOUR-USERNAME/Food-Bridge.git
cd Food-Bridge
```

### Step 3 — Connect to the original project (upstream)

This lets you pull the latest updates from the main repo later:

```bash
git remote add upstream https://github.com/SoubhagyaJain/Food-Bridge.git
```

Check it worked:

```bash
git remote -v
```

You should see `origin` (your fork) and `upstream` (the main repo).

### Step 4 — Create a new branch

Never code directly on `main`. Always create a branch with a clear name:

```bash
git checkout main
git pull upstream main
git checkout -b fix/header-nav-links
```

**Good branch name examples:**

- `feature/donor-donation-form`
- `fix/footer-typo`
- `docs/update-readme`

Use lowercase, hyphens, and a short description.

### Step 5 — Make your changes

1. Open the `Food-Bridge` folder in Cursor or VS Code  
2. Edit the files you need  
3. Save your work  
4. Run `npm run dev` and check **http://localhost:3000**  
5. Run `npm run build` before you finish — it should pass with no errors

### Step 6 — Commit your changes

A **commit** is a saved checkpoint with a message describing what you did.

```bash
git status
```

This shows which files you changed. Then:

```bash
git add .
git commit -m "Add volunteer signup link to footer"
```

**Good commit messages:**

- `Fix mobile menu not closing on link click`
- `Update README with contribution guide`
- `Add donation form validation for quantity field`

**Avoid vague messages** like `fix stuff` or `update`.

### Step 7 — Push to your fork on GitHub

```bash
git push origin fix/header-nav-links
```

The first time you push a new branch, Git may show a command to copy — run that if needed.

### Step 8 — Open a Pull Request

1. Go to **your fork** on GitHub (`github.com/YOUR-USERNAME/Food-Bridge`)
2. You will see a yellow banner: **Compare & pull request** — click it  
   Or: click **Pull requests** → **New pull request**
3. Set:
   - **base repository:** `SoubhagyaJain/Food-Bridge` → branch `main`
   - **head repository:** `YOUR-USERNAME/Food-Bridge` → your branch
4. Write a clear title and description:

```markdown
## What I changed
- Added Impact link to mobile navigation

## Why
- Footer and header nav were inconsistent

## How I tested
- Opened localhost:3000 on desktop and mobile view
- Clicked all nav links — they scroll to the right sections
```

5. Click **Create pull request**

A maintainer will review your code. They may ask for small changes — that is normal. Update your branch, push again, and the PR updates automatically.

### Step 9 — Keep your fork up to date

Before starting new work, sync with the main project:

```bash
git checkout main
git pull upstream main
git push origin main
```

---

## What to work on

Not sure where to start? Try one of these:

| Good first tasks | Where to look |
|------------------|---------------|
| Fix typos or improve README | `README.md`, `legacy/` |
| Improve landing page UI | `components/features/marketing/` |
| Navigation links | `lib/navigation.ts`, `MarketingHeader.tsx` |
| Login / register forms | `app/(auth)/` |
| Donor dashboard UI | `app/(donor)/`, `components/features/donor/` |

**Before you start:** check [Issues](https://github.com/SoubhagyaJain/Food-Bridge/issues) on GitHub. If someone is already working on something, pick a different task or comment on the issue to say you want to help.

**Want to propose a new feature?** Open a new Issue first with:

- What you want to build  
- Why it helps foodbridge  
- A rough idea of which files you would change  

---

## Project structure

```
foodbridge/
├── app/                        # Pages and routes
│   ├── (marketing)/            # Public landing page → /
│   ├── (auth)/                 # Login & register
│   ├── (donor)/donor/          # Donor dashboard & donations
│   ├── (ngo)/ngo/              # NGO browse & claims
│   └── (volunteer)/volunteer/  # Volunteer pickups
├── components/
│   ├── ui/                     # Buttons, inputs, cards
│   ├── shared/                 # Reused across roles
│   └── features/               # Marketing, donor, ngo, volunteer
├── lib/                        # Supabase, validations, navigation
├── server/                     # Server actions & database queries
├── types/                      # TypeScript types
├── middleware.ts               # Route protection by role
├── legacy/                     # Old static HTML prototype (reference)
└── public/images/              # Image assets
```

**Main URLs:**

| URL | Page |
|-----|------|
| `/` | Landing page |
| `/login` | Sign in |
| `/register` | Create account |
| `/donor/dashboard` | Donor home |
| `/donor/donations/new` | Post a donation |
| `/ngo/donations` | Browse available food |
| `/volunteer/pickups` | Pickup assignments |

---

## Before you submit a Pull Request

Use this checklist:

- [ ] The app runs: `npm run dev` — no crashes on http://localhost:3000
- [ ] The project builds: `npm run build` — finishes without errors
- [ ] You only changed files related to your task (no unrelated cleanup)
- [ ] Commit messages are clear and describe *what* and *why*
- [ ] Your PR description explains what you changed and how you tested it
- [ ] You did **not** commit `.env.local` or passwords (those stay on your machine only)

---

## Common problems

### `npm install` fails

- Make sure Node.js v18+ is installed: `node -v`
- Delete `node_modules` and try again:
  ```bash
  rmdir /s /q node_modules
  npm install
  ```

### `npm run dev` — port already in use

Another app is using port 3000. Stop the other terminal or run:

```bash
npx kill-port 3000
npm run dev
```

### Git asks for username and password

GitHub no longer accepts account passwords in the terminal. Use a **Personal Access Token**:

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens**
2. Generate a token with `repo` access
3. Use the token as your password when Git asks

Or install [GitHub CLI](https://cli.github.com) and run `gh auth login`.

### `git push` rejected

Someone updated the main branch. Sync first:

```bash
git checkout main
git pull upstream main
git checkout your-branch-name
git merge main
# fix any conflicts if prompted
git push origin your-branch-name
```

### Docker or Dev Containers popup in Cursor

Click **Don't Show Again**. This project does **not** use Docker. Just use **Open Folder** and run `npm run dev`.

---

## Get help

- **Bug or idea?** [Open an Issue](https://github.com/SoubhagyaJain/Food-Bridge/issues/new)
- **Stuck on Git?** [GitHub Docs — Quickstart](https://docs.github.com/en/get-started/quickstart)
- **Stuck on Next.js?** [Next.js Docs](https://nextjs.org/docs)

---

## Code of conduct

Be kind, patient, and respectful. Everyone was a beginner once. Ask questions — they are welcome.

---

## License & maintainer

Maintained by [SoubhagyaJain](https://github.com/SoubhagyaJain).  
Repository: [github.com/SoubhagyaJain/Food-Bridge](https://github.com/SoubhagyaJain/Food-Bridge)

**Thank you for contributing to foodbridge. Every pull request helps feed more people.** 🌱