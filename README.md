# PromptCraft AI 🚀

PromptCraft AI is an interactive, premium single-page web application designed to act as an expert **Prompt Engineer**. It guides users through crafting high-performing prompts for Text, Image, Code, and Custom tasks using professional prompt-engineering methodologies (such as Role/Persona, Context, Constraints, and Output Format).

---

## ✨ Features

- **🤖 Interactive Chatbot Flow**: Conversations with a virtual Prompt Engineer that asks structural questions tailored to your goals.
- **📋 Live Prompt Preview**: Watch your prompt compile in real-time in a side-by-side split editor as you type answers.
- **⚡ Gemini AI Supercharger**: Optionally connect your Google Gemini API Key (stored safely client-side in `localStorage`) to refine, expand, and polish your draft using Gemini models (`gemini-2.5-flash` or `gemini-2.5-pro`).
- **🧬 Multiple Blueprints**: Custom modes configured for:
  - **General & Text**: Optimizing role-based content creation.
  - **Image Generation**: Midjourney, DALL-E, and Stable Diffusion styling parameters.
  - **Coding & Technical**: Structuring software requests, framework constraints, and inputs/outputs.
  - **Expert Mode**: Inputting raw drafts to be parsed into structured format instantly.
- **📚 Saved Prompts Library**: Store, browse, load, and delete your best designs locally inside your browser storage database.
- **💾 Export Actions**: Copy prompts to clipboard with one click (complete with animations and notifications) or download them as raw `.md` Markdown files.
- **🌌 Premium Glassmorphic Theme**: Deep space dark mode by default, supporting a glass-light theme, smooth transition micro-animations, and fully responsive layout for mobile devices.

---

## 🛠️ File Structure

The project is lightweight, structured, and modular:

```text
PromptChatbot/
├── index.html       # Landing page detailing product features and user reviews
├── auth.html        # Glassmorphic user login & registration interface
├── app.html         # Main dashboard layout housing workspace sections and controls
├── app.js           # Core client logic (chatbot flows, prompt compilation, variables)
├── server.js        # SQLite-backed Express web server for authentication storage
├── style.css        # Core stylesheet containing premium layout structures and themes
├── promptcraft.db   # Local SQLite database (auto-generated upon running)
└── package.json     # Configuration file listing scripts and npm dependencies
```

---

## 💾 Database Schema

When running the Node.js server, the system automatically initializes an SQLite database (`promptcraft.db`) with a secure hashing mechanism for developer accounts:

* **Table: `users`**
  * `id`: Integer (Auto-incrementing Primary Key)
  * `name`: Text (Full name of user)
  * `email`: Text (Unique, sanitized lowercase email index)
  * `password`: Text (Securely hashed using `bcryptjs` with salt round of 10)
  * `created_at`: Datetime (Defaults to current timestamp)

---

## 🚀 How to Run Locally

PromptCraft AI supports two modes of execution: a full-stack SQLite backed environment, or a standalone client-only mode.

### Method 1: Full-Stack Dev Server (Recommended)
To enable account creation and logging via the SQLite backend:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the application server:**
   ```bash
   npm start
   ```

3. **Open browser:**
   Navigate to `http://localhost:3000` to interact with the workspace.

### Method 2: Client-Only/Offline Launch
For immediate launch without the Express server setup:
1. Double-click the `index.html` file in your system file explorer, or drag and drop it into any modern web browser.
2. Note: Standalone client-side mode will bypass the SQLite login check and run completely in the browser sandbox.

---

## 🧠 Core Prompt Engineering Blueprint

The chatbot structures text and coding prompts based on the **CO-STAR** and **Role-Task-Context-Constraints** methodologies:

1. **Role / Persona**: Defines who the AI is acting as (e.g. *"Act as a Senior Cyber Security Analyst..."*).
2. **Objective (Task)**: The primary command and action to execute.
3. **Context / Data**: The scenario information, audience background, or input documents the AI needs.
4. **Constraints**: Formatting limits, word limits, tone, active/passive voice guidelines, and forbidden criteria.
5. **Output Format**: Structuring output elements (e.g. *"Format the final summary as a markdown table with headers..."*).

---

*Made with 💜 by Prachi Garg.*
