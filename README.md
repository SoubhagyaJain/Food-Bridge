# Food Bridge

A static food-donation website — HTML, CSS, and JavaScript. **No Docker, no npm install, no build step required.**

## Quick start

1. Clone the repo:
   ```bash
   git clone https://github.com/SoubhagyaJain/Food-Bridge.git
   cd Food-Bridge
   ```

2. Open the site (pick one):
   - **Easiest:** double-click `index.html` to open it in your browser
   - **Recommended:** install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code or Cursor, right-click `index.html`, and choose **Open with Live Server**

3. Browse pages:
   - `index.html` — landing page
   - `login.html` / `register.html` — auth screens
   - `dashboard.html`, `donate.html`, `donations.html` — app pages

## Opening in VS Code / Cursor

- Choose **Open Folder** (not "Reopen in Container" or "Dev Container")
- If prompted to install Docker or Dev Containers, click **Don't Show Again** — this project does not use Docker
- The `src/components/` folder holds optional React components for a future framework setup; the live site runs from the HTML files

## Project structure

```
index.html          Landing page (Tailwind CDN)
login.html          Login page
css/style.css       Styles for app pages
js/script.js        Shared JavaScript
images/             Image assets
src/components/     React components (reference only)
```