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

The project is lightweight, dependencies-free, and self-contained:
```text
PromptChatbot/
├── index.html   # Main layout structure & UI controls
├── style.css    # Premium glassmorphic styles, scrollbars, & animations
├── app.js       # Conversation logic, state manager, API integrations, & storage
└── README.md    # Product documentation & instructions
```

---

## 🚀 How to Run Locally

Since the application is built entirely using vanilla frontend web technologies (HTML, CSS, and modern ES6 JavaScript), you do not need to install any heavy compiler, server, or npm database. 

### Method 1: Direct File Launch
Simply double-click the `index.html` file in your explorer directory or open it directly inside any web browser (Chrome, Edge, Firefox, or Safari).

### Method 2: SQLite-Backed Dev Server (Recommended)
To run the full application with a local SQLite database for storing developer accounts, run:
```bash
# Install dependencies:
npm install

# Start the server:
npm start
```
Then navigate to `http://localhost:3000` in your browser.

---

## 🧠 Core Prompt Engineering Blueprint

The chatbot structures text and coding prompts based on the **CO-STAR** and **Role-Task-Context-Constraints** methodologies:

1. **Role / Persona**: Defines who the AI is acting as (e.g. *"Act as a Senior Cyber Security Analyst..."*).
2. **Objective (Task)**: The primary command and action to execute.
3. **Context / Data**: The scenario information, audience background, or input documents the AI needs.
4. **Constraints**: Formatting limits, word limits, tone, active/passive voice guidelines, and forbidden criteria.
5. **Output Format**: Structuring output elements (e.g. *"Format the final summary as a markdown table with headers..."*).
