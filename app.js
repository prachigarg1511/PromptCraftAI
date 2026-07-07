/* ==========================================
   PromptCraft AI - JavaScript Application
   ========================================== */

// --- Global App State ---
const state = {
    currentMode: 'text', // 'text', 'image', 'code', 'expert'
    currentStepIndex: 0,
    formData: {},
    variables: {}, // Dynamically parsed {{placeholders}}
    history: [],
    apiKey: '',
    selectedModel: 'gemini-2.5-flash',
    theme: 'dark'
};

// --- Upgraded Blueprint Configurations (Ultra-Detailed) ---
const BLUEPRINTS = {
    text: {
        title: "✍️ General Prompt Builder",
        subtitle: "Perfecting role, context, examples, and rules step-by-step.",
        steps: [
            {
                key: 'role',
                label: 'Role / Persona',
                question: "What <strong>Role or Persona</strong> should the AI adopt? (e.g., Senior Copywriter, Career Coach, UX Consultant, Bio-tech Specialist)",
                placeholder: "Type the persona/role or select a suggestion below...",
                suggestions: ["Senior Copywriter", "Expert Python Developer", "UI/UX Consultant", "SEO Specialist", "Academic Researcher", "Financial Analyst"]
            },
            {
                key: 'task',
                label: 'Objective (Task)',
                question: "What is the primary **Objective or Task**? Be specific about what you need created.",
                placeholder: "e.g., Write a 600-word article about {{topic}}, draft a raise request email...",
                suggestions: ["Write a weekly newsletter about {{topic}}", "Refactor a complex database query", "Draft a raise request email for {{job_title}}", "Summarize research papers about {{subject}}"]
            },
            {
                key: 'context',
                label: 'Context & Data',
                question: "Provide the **Context, Background, or Source Data** the AI should analyze.",
                placeholder: "e.g., Target audience is {{audience}}, using Node.js v20, raw statistics attached...",
                suggestions: ["Target audience: {{audience}}", "Brand tone is casual & witty", "For absolute beginners in {{subject}}", "Running on custom Node.js system"]
            },
            {
                key: 'examples',
                label: 'Few-Shot Examples',
                question: "Provide **Few-Shot Examples** of desired inputs and outputs. (Crucial for high accuracy)",
                placeholder: "e.g., Input: 'X' -> Output: 'Y'. Or describe: 'Include a hook, followed by 3 tips'...",
                suggestions: ["Input: 'Python code' -> Output: 'Formatted table'", "Structure: Introduction, 3 paragraphs, CTA", "Example: 'Save time' -> 'Maximize hourly returns'"]
            },
            {
                key: 'negatives',
                label: 'Negative Constraints',
                question: "What should the AI **strictly avoid**? (Negative instructions prevent hallucinations)",
                placeholder: "e.g., Do not use jargon, do not mention competitors, do not make assumptions...",
                suggestions: ["No technical jargon", "Do not mention competitors", "Do not write conversational intros", "Strictly avoid passive voice"]
            },
            {
                key: 'tone',
                label: 'Tone & Style',
                question: "What **Tone, Style, or Reading Level** is required? (e.g. conversational, authoritative, Grade 8 level)",
                placeholder: "e.g., Professional, empathetic, highly technical, encouraging, casual...",
                suggestions: ["Professional & authoritative", "Empathetic & encouraging", "Casual & conversational", "Witty & punchy"]
            },
            {
                key: 'format',
                label: 'Output Format',
                question: "What is the desired **Output Format and Structure**?",
                placeholder: "e.g., Markdown table with columns A & B, raw JSON object, bulleted checklist...",
                suggestions: ["Markdown Table with columns: {{columns}}", "Raw JSON Schema", "Step-by-step checklist", "Two-column comparison"]
            }
        ]
    },
    image: {
        title: "🎨 Image Prompt Builder",
        subtitle: "Generate visually rich, technical prompts for Midjourney, DALL-E, and Stable Diffusion.",
        steps: [
            {
                key: 'subject',
                label: 'Subject',
                question: "What is the primary **Subject** of the image? Describe the action and characters.",
                placeholder: "e.g., A majestic ancient library carved inside a giant hollow redwood tree trunk...",
                suggestions: ["Cyberpunk alleyway at night", "Fluffy white kitten wearing wizard robes", "Surreal floating island", "Astronaut in a fields of lavender", "Minimalist glass mountain cabin"]
            },
            {
                key: 'style',
                label: 'Art Style / Medium',
                question: "What **Artistic Style or Medium**? (e.g., 3D Render, Watercolor, Photorealistic, Anime)",
                placeholder: "e.g., Studio Ghibli anime style, 8K photorealistic DSLR, surreal digital painting...",
                suggestions: ["Photorealistic 8K DSLR", "Studio Ghibli Anime", "3D Unreal Engine Render", "Vintage Watercolor painting", "Cyberpunk synthwave style"]
            },
            {
                key: 'composition',
                label: 'Composition',
                question: "Describe **Composition, Camera Lens, or Angle**.",
                placeholder: "e.g., Close-up portrait shot on 85mm lens, shallow depth of field, wide angle...",
                suggestions: ["Shallow depth of field, 85mm lens", "Wide-angle landscape view", "Extreme close-up macro shot", "Low-angle dramatic perspective", "Symmetrical composition"]
            },
            {
                key: 'lighting',
                label: 'Lighting & Atmosphere',
                question: "What **Lighting and Atmospheric Mood** should the scene have?",
                placeholder: "e.g., Warm sunset golden hour, moody neon glow, dramatic chiaroscuro, volumetric sunbeams...",
                suggestions: ["Golden hour sunset glow", "Moody neon backlight", "Dramatic cinematic shadows", "Volumetric sunbeams through foliage"]
            },
            {
                key: 'negatives',
                label: 'Negative Keywords',
                question: "What **elements or styles** should be excluded? (Negative prompt)",
                placeholder: "e.g., ugly, blurry, low-res, text, signatures, modern objects, humans...",
                suggestions: ["blurry, low resolution, artifacts", "text, signatures, watermarks", "modern technology, plastic chairs", "extra limbs, deformed anatomy"]
            },
            {
                key: 'parameters',
                label: 'Parameters',
                question: "Specify **Aspect Ratio, Engine Version, or Midjourney Parameters**.",
                placeholder: "e.g., aspect ratio 16:9, Midjourney parameters like --ar 16:9 --v 6.0...",
                suggestions: ["--ar 16:9 --v 6.0", "--ar 4:5 --v 6.0 --stylize 250", "--ar 1:1 --v 6.0 --style raw", "--ar 9:16 --v 6.0"]
            }
        ]
    },
    code: {
        title: "💻 Code Prompt Builder",
        subtitle: "Build comprehensive development specifications for robust programming outputs.",
        steps: [
            {
                key: 'tech',
                label: 'Technology',
                question: "What **Programming Languages, Frameworks, and Libraries** are you targeting?",
                placeholder: "e.g., Python 3.11 with FastAPI, React v18 and TypeScript...",
                suggestions: ["Python 3.11 & FastAPI", "React 18 & TypeScript", "Node.js & Express", "Rust (System Programming)", "HTML5 & Tailwind CSS"]
            },
            {
                key: 'codeTask',
                label: 'Coding Task',
                question: "Describe the **Coding Task** in detail. What must the logic or script accomplish?",
                placeholder: "e.g., Write an asynchronous background task to fetch API data and cache it in redis...",
                suggestions: ["Create redis caching middleware", "Optimize database query", "Write comprehensive unit tests", "Parse custom JSON payload"]
            },
            {
                key: 'ioDetails',
                label: 'Inputs / Outputs',
                question: "What are the expected **Inputs, Outputs, and Data Formats**?",
                placeholder: "e.g., Accepts latitude and longitude floats, returns JSON weather payload...",
                suggestions: ["Accepts request object payload", "Returns JSON dictionary", "Handles null/empty inputs", "Reads local config file"]
            },
            {
                key: 'examples',
                label: 'Few-Shot / Test Cases',
                question: "Provide **Few-Shot Examples or Test Cases** representing the input-output behavior.",
                placeholder: "e.g., Example: fetch_weather(lat=40.7, lon=-74) -> weather dict payload...",
                suggestions: ["assert weather(40.7, -74) == expected_json", "Input: null -> Output: Throw HTTP 400", "Includes weather test mocking"]
            },
            {
                key: 'security',
                label: 'Security & Validation',
                question: "What are the rules for **Validation, Error Handling, and Security**?",
                placeholder: "e.g., Implement input schemas validation, catch rate limits, use environment variables...",
                suggestions: ["Validate input schemas with pydantic", "Handle all database exceptions", "Use secure environment variables", "Implement API rate limit filters"]
            },
            {
                key: 'codeStyle',
                label: 'Coding Style',
                question: "What **Coding Standards, Architecture, and Formatting guidelines** apply?",
                placeholder: "e.g., Modular DRY principles, async/await syntax, PEP-8 compliance, comments...",
                suggestions: ["Strict PEP-8 compliance", "Clean DRY modular code", "Strictly async/await syntax", "Use standard ESLint configurations"]
            }
        ]
    },
    expert: {
        title: "🎯 Expert Prompt Mode",
        subtitle: "Input your raw thoughts, and PromptCraft AI will structure it using prompt engineering guidelines.",
        steps: [
            {
                key: 'rawDraft',
                label: 'Draft Prompt',
                question: "Type or paste your <strong>raw draft or thought</strong>. I will automatically format and expand it into a structural system-level prompt.",
                placeholder: "Type what you want to achieve, e.g., 'Write a blog outline about clean energy'...",
                suggestions: ["Write an outline for a tech blog", "Draft a professional email asking for a raise", "Write a Python script to fetch stock prices", "Create a gym workout schedule"]
            }
        ]
    }
};

// --- Preset Mega-Prompts Database ---
const PRESETS = [
    {
        title: "✍️ SEO Content Copywriter",
        mode: "text",
        formData: {
            role: "Elite SEO Copywriter and Conversion Marketing Specialist",
            task: "Write a high-converting, deeply educational 800-word blog post about '{{blog_topic}}'",
            context: "Target audience is {{audience}}. The goal of the article is to establish our brand as a trusted authority and drive sign-ups to our service.",
            examples: "Introduction: Hook with a surprising statistic, outline the primary problems, present a checklist solution.\nBody Sections: Break down the checklist into 3 actionable subsections with key takeaways.\nConclusion: Summarize key benefits and include a strong call to action.",
            negatives: "Avoid passive voice, avoid corporate jargon, do not make unverified claims, do not use boilerplate introductory remarks.",
            tone: "Authoritative yet conversational, empathetic, encouraging, and clear.",
            format: "Markdown format with semantic H2/H3 titles, short readable paragraphs (under 3 lines), bullet lists, and a meta description at the end."
        }
    },
    {
        title: "💻 Python Backend Architect",
        mode: "code",
        formData: {
            tech: "Python 3.11, FastAPI framework, and SQLAlchemy v2.0 ORM",
            codeTask: "Design and implement a thread-safe, asynchronous database helper class that manages weather data sync updates for {{city_name}}.",
            ioDetails: "Input: CITY_ID (string) and payload (JSON weather values).\nOutput: Sync status schema { status: 'success' | 'failed', records_updated: int }.",
            examples: "sync_city_weather('NY', {'temp': 72}) -> updates weather_log table, returns {'status': 'success', 'records_updated': 1}.",
            security: "Use Pydantic v2 schemas for payload validation, catch all database operational errors and log them, run connection retries with exponential back-off.",
            codeStyle: "Follow strict PEP-8 standards, use type annotations everywhere, write detailed Google-style docstrings, keep methods modular and DRY."
        }
    },
    {
        title: "🎨 Cinematic Midjourney Pro",
        mode: "image",
        formData: {
            subject: "A majestic ancient library built inside a massive hollow redwood tree trunk, warm sunlight rays cutting through green tree foliage and illuminating floating dust particles",
            style: "Cinematic, photorealistic style",
            composition: "Wide angle view, shot on 35mm lens, rule of thirds layout",
            lighting: "Dreamy golden hour, warm sunset glowing highlights and dramatic volumetric shadows",
            negatives: "ugly, blurry, low resolution, computer monitors, plastic furniture, signatures, watermarks",
            parameters: "--ar 16:9 --v 6.0 --stylize 300"
        }
    }
];

// --- DOM Element References ---
const sidebar = document.getElementById('sidebar');
const menuToggleBtn = document.getElementById('menu-toggle-btn');
const mobileCloseBtn = document.getElementById('mobile-close-btn');
const previewPanel = document.getElementById('preview-panel');
const previewToggleBtn = document.getElementById('preview-toggle-btn');
const currentModeTitle = document.getElementById('current-mode-title');
const currentModeSubtitle = document.getElementById('current-mode-subtitle');
const chatMessages = document.getElementById('chat-messages');
const chatInputForm = document.getElementById('chat-input-form');
const chatInputField = document.getElementById('chat-input-field');
const stepIndicator = document.getElementById('step-indicator');
const suggestionChips = document.getElementById('suggestion-chips');
const criteriaChecklist = document.querySelector('.criteria-checklist');
const promptOutputPre = document.getElementById('prompt-output-pre');
const promptBadge = document.getElementById('prompt-badge');
const toastNotification = document.getElementById('toast-notification');

// Action Buttons
const newChatBtn = document.getElementById('new-chat-btn');
const resetFlowBtn = document.getElementById('reset-flow-btn');
const copyPromptBtn = document.getElementById('copy-prompt-btn');
const superchargeBtn = document.getElementById('supercharge-btn');
const downloadPromptBtn = document.getElementById('download-prompt-btn');
const savePromptBtn = document.getElementById('save-prompt-btn');
const historyList = document.getElementById('history-list');
const presetList = document.getElementById('preset-list');

// Blueprint selection buttons
const blueprints = {
    text: document.getElementById('blueprint-text'),
    image: document.getElementById('blueprint-image'),
    code: document.getElementById('blueprint-code'),
    expert: document.getElementById('blueprint-expert')
};

// Settings Modal elements
const settingsToggleBtn = document.getElementById('settings-toggle-btn');
const settingsModal = document.getElementById('settings-modal');
const settingsCloseBtn = document.getElementById('settings-close-btn');
const settingsSaveBtn = document.getElementById('settings-save-btn');
const settingsResetBtn = document.getElementById('settings-reset-btn');
const geminiKeyInput = document.getElementById('gemini-key-input');
const geminiModelSelect = document.getElementById('gemini-model-select');
const themeBtnDark = document.getElementById('theme-btn-dark');
const themeBtnLight = document.getElementById('theme-btn-light');

// Tab control components
const tabBtnPreview = document.getElementById('tab-btn-preview');
const tabBtnVariables = document.getElementById('tab-btn-variables');
const tabBtnSandbox = document.getElementById('tab-btn-sandbox');
const tabBtnRewrite = document.getElementById('tab-btn-rewrite');
const contentPreview = document.getElementById('content-preview');
const contentVariables = document.getElementById('content-variables');
const contentSandbox = document.getElementById('content-sandbox');
const contentRewrite = document.getElementById('content-rewrite');
const variablesFormContainer = document.getElementById('variables-form-container');
const varsCountBadge = document.getElementById('vars-count');

// Sandbox test components
const sandboxUserMessage = document.getElementById('sandbox-user-message');
const sandboxRunBtn = document.getElementById('sandbox-run-btn');
const sandboxOutputPre = document.getElementById('sandbox-output-pre');

// --- Initialization & Setup ---
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadSavedPrompts();
    setupEventListeners();
    setupTabControls();
    renderPresetHub();
    initMode(state.currentMode);
});

// --- Event Listeners ---
function setupEventListeners() {
    // Responsive layout toggles
    menuToggleBtn.addEventListener('click', () => sidebar.classList.add('active'));
    mobileCloseBtn.addEventListener('click', () => sidebar.classList.remove('active'));
    previewToggleBtn.addEventListener('click', () => {
        previewPanel.classList.toggle('active');
        const isVisible = previewPanel.classList.contains('active');
        previewToggleBtn.querySelector('.preview-mobile-text').textContent = isVisible ? 'Hide Preview' : 'Show Preview';
    });

    // Blueprint category switching (codetoprompt has its own listener in setupCodeToPromptListeners)
    Object.keys(blueprints).forEach(mode => {
        blueprints[mode].addEventListener('click', () => {
            if (state.currentMode !== mode) {
                if (Object.keys(state.formData).length > 0) {
                    if (confirm("Switching modes will discard your current draft. Do you want to continue?")) {
                        initMode(mode);
                    }
                } else {
                    initMode(mode);
                }
                sidebar.classList.remove('active');
            }
        });
    });

    // Chat form submit
    chatInputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleUserInput();
    });

    // Textarea key actions
    chatInputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatInputForm.dispatchEvent(new Event('submit'));
        }
    });

    // Auto-grow input
    chatInputField.addEventListener('input', () => {
        chatInputField.style.height = 'auto';
        chatInputField.style.height = (chatInputField.scrollHeight) + 'px';
    });

    // Action button clicks
    newChatBtn.addEventListener('click', () => {
        if (confirm("Reset current builder session?")) {
            initMode(state.currentMode);
        }
    });
    resetFlowBtn.addEventListener('click', () => {
        initMode(state.currentMode);
    });

    copyPromptBtn.addEventListener('click', copyPromptToClipboard);
    downloadPromptBtn.addEventListener('click', downloadPromptAsMarkdown);
    savePromptBtn.addEventListener('click', savePromptToLibrary);
    superchargeBtn.addEventListener('click', superchargePromptWithAI);

    // Modal toggles
    settingsToggleBtn.addEventListener('click', () => {
        geminiKeyInput.value = state.apiKey;
        geminiModelSelect.value = state.selectedModel;
        settingsModal.classList.add('active');
    });
    settingsCloseBtn.addEventListener('click', () => settingsModal.classList.remove('active'));
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) settingsModal.classList.remove('active');
    });

    themeBtnDark.addEventListener('click', () => setTheme('dark'));
    themeBtnLight.addEventListener('click', () => setTheme('light'));

    settingsSaveBtn.addEventListener('click', saveSettings);
    settingsResetBtn.addEventListener('click', () => {
        geminiKeyInput.value = '';
        state.apiKey = '';
        localStorage.removeItem('promptcraft_gemini_key');
        showToast('API Key cleared successfully');
    });

    // Sandbox Trigger
    sandboxRunBtn.addEventListener('click', runSandboxTest);
}

// --- Tab Controls Implementation ---
function setupTabControls() {
    const tabs = [
        { btn: tabBtnPreview, content: contentPreview },
        { btn: tabBtnVariables, content: contentVariables },
        { btn: tabBtnSandbox, content: contentSandbox },
        { btn: tabBtnRewrite, content: contentRewrite }
    ].filter(t => t.btn && t.content); // guard against missing elements

    tabs.forEach(tab => {
        tab.btn.addEventListener('click', () => {
            tabs.forEach(t => {
                t.btn.classList.toggle('active', t.btn === tab.btn);
                t.content.classList.toggle('active', t.content === tab.content);
            });
            // Sync Sandbox UI when switching to that tab
            if (tab.btn === tabBtnSandbox) syncSandboxUI();
        });
    });
}

// --- Theme Management ---
function setTheme(theme) {
    state.theme = theme;
    if (theme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        themeBtnLight.classList.add('active');
        themeBtnDark.classList.remove('active');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeBtnDark.classList.add('active');
        themeBtnLight.classList.remove('active');
    }
    localStorage.setItem('promptcraft_theme', theme);
}

// --- Local Storage & Settings ---
function loadSettings() {
    state.apiKey = localStorage.getItem('promptcraft_gemini_key') || '';
    state.selectedModel = localStorage.getItem('promptcraft_gemini_model') || 'gemini-2.5-flash';
    const savedTheme = localStorage.getItem('promptcraft_theme') || 'dark';
    setTheme(savedTheme);
}

function saveSettings() {
    state.apiKey = geminiKeyInput.value.trim();
    state.selectedModel = geminiModelSelect.value;
    localStorage.setItem('promptcraft_gemini_key', state.apiKey);
    localStorage.setItem('promptcraft_gemini_model', state.selectedModel);
    settingsModal.classList.remove('active');
    showToast('Configuration settings saved!');
}

// --- Mode Switching & State Initialization ---
function initMode(mode) {
    // Guard: if switching away from codetoprompt, restore normal layout
    if (state.currentMode === 'codetoprompt' && mode !== 'codetoprompt') {
        const chatEl = document.querySelector('.chat-container');
        const codeEl = document.getElementById('code-optimizer-container');
        if (chatEl) chatEl.style.display = '';
        if (codeEl) codeEl.style.display = 'none';
    }

    state.currentMode = mode;
    state.currentStepIndex = 0;
    state.formData = {};
    state.variables = {};

    // Reset tabs
    tabBtnPreview.click();

    // Reset Blueprints UI highlighter
    Object.keys(blueprints).forEach(m => {
        blueprints[m].classList.toggle('active', m === mode);
    });
    // Also clear codetoprompt button active state
    const ctpBtn = document.getElementById('blueprint-codetoprompt');
    if (ctpBtn) ctpBtn.classList.remove('active');

    const activeBlueprint = BLUEPRINTS[mode];
    if (!activeBlueprint) return; // Safety guard
    currentModeTitle.textContent = activeBlueprint.title;
    currentModeSubtitle.textContent = activeBlueprint.subtitle;

    // Reset Chat messages
    chatMessages.innerHTML = '';
    addBotMessage(`Welcome to **${activeBlueprint.title}**! Let's build your optimized prompt.`);

    // Clear input
    chatInputField.value = '';
    chatInputField.disabled = false;
    chatInputField.placeholder = activeBlueprint.steps[0].placeholder;
    chatInputField.style.height = 'auto';

    buildCriteriaChecklist();
    askStepQuestion();
    updateLivePreview();
    // Sync Sandbox layout dynamically
    syncSandboxUI();
}

// --- Preset Hub Implementation ---
function renderPresetHub() {
    presetList.innerHTML = '';
    PRESETS.forEach(preset => {
        const btn = document.createElement('button');
        btn.className = 'preset-item';
        btn.innerHTML = `<span>${preset.title}</span>`;
        btn.addEventListener('click', () => {
            if (confirm(`Load preset: "${preset.title}"? This will overwrite your current workspace.`)) {
                loadPresetData(preset);
            }
        });
        presetList.appendChild(btn);
    });
}

function loadPresetData(preset) {
    state.currentMode = preset.mode;
    state.formData = JSON.parse(JSON.stringify(preset.formData));
    state.variables = {};
    
    // Set index to completed
    const activeBlueprint = BLUEPRINTS[preset.mode];
    state.currentStepIndex = activeBlueprint.steps.length;
    
    // UI configuration
    currentModeTitle.textContent = activeBlueprint.title;
    currentModeSubtitle.textContent = activeBlueprint.subtitle;
    
    Object.keys(blueprints).forEach(m => {
        blueprints[m].classList.toggle('active', m === preset.mode);
    });

    chatMessages.innerHTML = '';
    addBotMessage(`Loaded Preset mega-prompt: **${preset.title}**.`);
    addBotMessage(`You can test this prompt in the **Sandbox** or fill in placeholder bindings in the **Variables** tab.`);

    buildCriteriaChecklist();
    updateLivePreview();
    updateChecklistUI();
    
    stepIndicator.textContent = "Preset Mega-Prompt Active";
    chatInputField.placeholder = "Preset loaded. Access Sandbox or copy editor.";
    chatInputField.disabled = true;
    chatInputField.value = '';
    suggestionChips.innerHTML = '<span class="empty-history">Preset session active</span>';
    // Sync Sandbox layout dynamically
    syncSandboxUI();
}

// --- Dynamic Variables Extractor & Form Generator ---
// NOTE: Full implementation (with select dropdown support) is at the bottom of the file.
// This stub ensures the function name resolves during early compilation.
function detectAndRenderVariables() {
    // Deferred to the upgraded version below — this body is intentionally empty.
    // The real implementation (supporting {{name:select[A|B|C]}} syntax) is defined
    // later in the file and overrides this declaration due to JS function hoisting.
}

function getProcessedPrompt() {
    let text = promptOutputPre.textContent;
    // Replace all occurrences of {{key}} with state.variables[key]
    Object.keys(state.variables).forEach(key => {
        const val = state.variables[key] || `{{${key}}}`;
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        text = text.replace(regex, val);
    });
    return text;
}

// --- Conversational Message Rendering Helpers ---
function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.innerHTML = `
        <div class="bot-avatar">🤖</div>
        <div class="message-content">
            <p>${formatMessageText(text)}</p>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `
        <div class="user-avatar">👤</div>
        <div class="message-content">
            <p>${escapeHtml(text)}</p>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.id = 'typing-indicator-msg';
    messageDiv.innerHTML = `
        <div class="bot-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator-msg');
    if (indicator) indicator.remove();
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatMessageText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

// --- Criteria checklist Rendering ---
function buildCriteriaChecklist() {
    criteriaChecklist.innerHTML = '';
    const activeBlueprint = BLUEPRINTS[state.currentMode];
    
    activeBlueprint.steps.forEach(step => {
        const item = document.createElement('div');
        item.className = 'criteria-item';
        item.id = `crit-${step.key}`;
        item.innerHTML = `
            <span class="status-dot"></span>
            <span class="name">${step.label}</span>
        `;
        criteriaChecklist.appendChild(item);
    });
}

function askStepQuestion() {
    const activeBlueprint = BLUEPRINTS[state.currentMode];
    const step = activeBlueprint.steps[state.currentStepIndex];

    if (!step) {
        handleConversationComplete();
        return;
    }

    addBotMessage(step.question);

    stepIndicator.textContent = `Step ${state.currentStepIndex + 1} of ${activeBlueprint.steps.length}: ${step.label}`;
    chatInputField.placeholder = step.placeholder;
    chatInputField.value = '';
    chatInputField.style.height = 'auto';

    if (window.innerWidth > 768) {
        chatInputField.focus();
    }

    renderSuggestionChips(step.suggestions);
    updateChecklistUI();
}

function renderSuggestionChips(chips) {
    suggestionChips.innerHTML = '';
    if (!chips || chips.length === 0) {
        suggestionChips.innerHTML = '<span class="empty-history">No suggestions</span>';
        return;
    }

    chips.forEach(chip => {
        const btn = document.createElement('button');
        btn.className = 'chip-btn';
        btn.textContent = chip;
        btn.addEventListener('click', () => {
            chatInputField.value = chip;
            chatInputField.style.height = (chatInputField.scrollHeight) + 'px';
            chatInputField.focus();
        });
        suggestionChips.appendChild(btn);
    });
}

function updateChecklistUI() {
    const activeBlueprint = BLUEPRINTS[state.currentMode];
    activeBlueprint.steps.forEach((step, idx) => {
        const item = document.getElementById(`crit-${step.key}`);
        if (!item) return;

        if (state.formData[step.key]) {
            item.className = 'criteria-item completed';
        } else if (idx === state.currentStepIndex) {
            item.className = 'criteria-item filled';
        } else {
            item.className = 'criteria-item';
        }
    });
}

// --- Live Compiler Logic ---
function compilePrompt() {
    const data = state.formData;

    if (state.currentMode === 'text') {
        const role = data.role ? `Act as ${data.role}, a world-class specialist with years of industry-grade expertise in this domain. Approach this task with the highest level of professional standard, rigor, and depth, matching the quality of elite consultants.` : `[Not yet defined]`;
        const task = data.task ? `Your core objective is to execute the following task: ${data.task}` : `[Not yet defined]`;
        const context = data.context ? `### 📋 CONTEXT & BACKGROUND:\nTo ensure maximum relevance and accuracy, here is the necessary background context:\n${data.context}` : `### 📋 CONTEXT & BACKGROUND:\n[Not yet defined]`;
        const constraints = data.constraints ? `### ⚙️ RULES, CRITERIA & CONSTRAINTS:\nYou must adhere strictly to these operational guidelines. Violating any of these will result in an unacceptable output:\n- ${data.constraints.split('\n').join('\n- ')}\n- Do not make assumptions. Ask for clarification if critical details are missing.\n- Maintain a highly focused, professional tone matching the defined persona.\n- Avoid conversational filler, introductory remarks, or generic exit phrases (e.g., do not say "Sure, I can help with that" or "Let me know if you need anything else"). Start directly with the core response.` : `### ⚙️ RULES, CRITERIA & CONSTRAINTS:\n[Not yet defined]`;
        const examples = data.examples ? `### 💡 FEW-SHOT EXAMPLES / STRUCTURE:\nBelow are structural examples of target outputs:\n${data.examples}` : `### 💡 FEW-SHOT EXAMPLES / STRUCTURE:\n[Not yet defined]`;
        const tone = data.tone ? `### 🎨 TONE & STYLE RULES:\nAdopt this exact tone: ${data.tone}` : `### 🎨 TONE & STYLE RULES:\n[Not yet defined]`;
        const format = data.format ? `### 📊 EXPECTED OUTPUT STRUCTURE:\nStructure the response exactly as described below:\n${data.format}` : `### 📊 EXPECTED OUTPUT STRUCTURE:\n[Not yet defined]`;

        return `# 🤖 SYSTEM INSTRUCTION: ACTIVE ROLE
${role}

# 🎯 PRIMARY MISSION
${task}

${context}

${examples}

${constraints}

${tone}

${format}

---
*Initiating system execution parameters. Ready to receive commands.*`;
    }

    if (state.currentMode === 'image') {
        const subject = data.subject || '[Subject]';
        const style = data.style ? `**Artistic Style / Medium**: ${data.style}` : `**Artistic Style / Medium**: [Not yet defined]`;
        const composition = data.composition ? `**Composition & Camera Angle**: ${data.composition}` : `**Composition & Camera Angle**: [Not yet defined]`;
        const lighting = data.lighting ? `**Lighting & Atmosphere**: ${data.lighting}` : `**Lighting & Atmosphere**: [Not yet defined]`;
        const negatives = data.negatives ? `**Negative Keywords (Exclude)**: ${data.negatives}` : `**Negative Keywords (Exclude)**: [Not yet defined]`;
        const params = data.parameters ? `**Parameters & Technical Directives**: ${data.parameters}` : `**Parameters & Technical Directives**: [Not yet defined]`;

        return `/imagine prompt: A high-fidelity, visually compelling masterwork depicting ${subject}.
- ${style}
- ${composition}
- ${lighting}
- ${negatives}
- ${params}
- **Quality Enhancers**: Hyper-detailed, intricate textures, volumetric rendering, cinematic lighting, 8k resolution, photorealistic finishes, rich color depth, perfectly balanced composition.`;
    }

    if (state.currentMode === 'code') {
        const tech = data.tech ? `Act as an elite software architect and senior developer specializing in ${data.tech}. You write robust, clean, secure, and highly optimized code adhering to modern design principles.` : `[Not yet defined]`;
        const codeTask = data.codeTask ? `### 💻 TASK DESCRIPTION & FUNCTIONALITY:\nYour objective is to implement the following coding task:\n${data.codeTask}` : `### 💻 TASK DESCRIPTION & FUNCTIONALITY:\n[Not yet defined]`;
        const ioDetails = data.ioDetails ? `### 🛠️ INPUT/OUTPUT SPECIFICATIONS & DATA STRUCTURES:\n- ${data.ioDetails}` : `### 🛠️ INPUT/OUTPUT SPECIFICATIONS & DATA STRUCTURES:\n[Not yet defined]`;
        const examples = data.examples ? `### 🧪 CODE EXAMPLES & TEST CASES:\nUse the following behavior as target expectations:\n${data.examples}` : `### 🧪 CODE EXAMPLES & TEST CASES:\n[Not yet defined]`;
        const security = data.security ? `### 🔒 VALIDATION & ERROR HANDLING SAFETY RULES:\n- Enforce the following standards:\n- ${data.security}` : `### 🔒 VALIDATION & ERROR HANDLING SAFETY RULES:\n[Not yet defined]`;
        const codeStyle = data.codeStyle ? `### 📝 CODING STANDARDS & QUALITY GUIDELINES:\nEnsure the compiled code satisfies these guidelines:\n- Make the code highly modular, clean, and DRY (Don't Repeat Yourself).\n- ${data.codeStyle.split('\n').join('\n- ')}\n- Provide fully functional, complete code. Do not write placeholders, mocks, or ellipses (e.g., do not use "// TODO" or "// implement later").` : `### 📝 CODING STANDARDS & QUALITY GUIDELINES:\n[Not yet defined]`;

        return `# 🤖 SYSTEM ROLE
${tech}

${codeTask}

${ioDetails}

${examples}

${security}

${codeStyle}

---
*Code execution environment initialized. Provide output code blocks inside markdown fences.*`;
    }

    if (state.currentMode === 'expert') {
        return data.rawDraft || `[No raw prompt draft entered yet]`;
    }

    return '';
}

function updateLivePreview() {
    const compiled = compilePrompt();
    promptOutputPre.textContent = compiled;

    // Badge configuration
    const activeBlueprint = BLUEPRINTS[state.currentMode];
    const stepsLength = activeBlueprint.steps.length;
    const answeredSteps = Object.keys(state.formData).length;

    if (answeredSteps === stepsLength) {
        promptBadge.textContent = "Compiled";
        promptBadge.className = "prompt-badge complete";
    } else {
        promptBadge.textContent = "Drafting";
        promptBadge.className = "prompt-badge";
    }

    // Dynamic Variables extraction
    detectAndRenderVariables();
}

// --- Conversational Flow handlers ---
function handleUserInput() {
    const text = chatInputField.value.trim();
    if (!text) return;

    addUserMessage(text);

    const activeBlueprint = BLUEPRINTS[state.currentMode];
    const step = activeBlueprint.steps[state.currentStepIndex];
    state.formData[step.key] = text;

    chatInputField.value = '';
    chatInputField.style.height = 'auto';

    updateLivePreview();
    state.currentStepIndex++;

    addTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        askStepQuestion();
    }, 450);
}

function handleConversationComplete() {
    addBotMessage("🎉 **Excellent!** I have gathered all guidelines and built your prompt!");
    addBotMessage("Review the compiled template in the **Preview** tab. You can now:\n\n1. **Bind placeholders** in the **Variables** tab.\n2. Click **Supercharge (AI)** to let Gemini refine it.\n3. Run user messages directly against your prompt in the **Sandbox** tab!");

    stepIndicator.textContent = "Prompt Session Completed!";
    chatInputField.placeholder = "All criteria filled. See tabs panel on the right.";
    chatInputField.disabled = true;
    chatInputField.value = '';
    
    suggestionChips.innerHTML = '<span class="empty-history">Process completed!</span>';
    updateChecklistUI();
}

// --- Action panel handlers ---
function copyPromptToClipboard() {
    // Process variables replacement
    const processedText = getProcessedPrompt();
    
    navigator.clipboard.writeText(processedText).then(() => {
        showToast('Prompt copied (with variable bindings)! 🚀');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function downloadPromptAsMarkdown() {
    const processedText = getProcessedPrompt();
    const blob = new Blob([processedText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    let filename = `promptcraft_${state.currentMode}_prompt.md`;
    if (state.formData.role || state.formData.subject || state.formData.tech) {
        const val = state.formData.role || state.formData.subject || state.formData.tech;
        filename = `prompt_${val.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.md`;
    }

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Markdown prompt downloaded!');
}

function savePromptToLibrary() {
    const activeBlueprint = BLUEPRINTS[state.currentMode];
    const answeredSteps = Object.keys(state.formData).length;

    if (answeredSteps === 0) {
        alert("The prompt is empty! Answer some questions or load a preset first.");
        return;
    }

    let title = `${state.currentMode.toUpperCase()}: `;
    if (state.currentMode === 'text' && state.formData.role) {
        title += `Act as ${state.formData.role}`;
    } else if (state.currentMode === 'image' && state.formData.subject) {
        title += state.formData.subject;
    } else if (state.currentMode === 'code' && state.formData.codeTask) {
        title += state.formData.codeTask;
    } else {
        title += `Session Draft (${new Date().toLocaleDateString()})`;
    }

    const savedPrompt = {
        id: Date.now().toString(),
        title: title,
        content: promptOutputPre.textContent,
        mode: state.currentMode,
        formData: JSON.parse(JSON.stringify(state.formData)),
        timestamp: new Date().toISOString()
    };

    state.history.unshift(savedPrompt);
    localStorage.setItem('promptcraft_saved_prompts', JSON.stringify(state.history));
    
    renderHistoryUI();
    showToast('Prompt saved to local database library!');
}

function loadSavedPrompts() {
    const saved = localStorage.getItem('promptcraft_saved_prompts');
    if (saved) {
        try {
            state.history = JSON.parse(saved);
        } catch (e) {
            state.history = [];
        }
    }
    renderHistoryUI();
}

function renderHistoryUI() {
    historyList.innerHTML = '';
    
    if (state.history.length === 0) {
        historyList.innerHTML = '<div class="empty-history">No saved prompts yet</div>';
        return;
    }

    state.history.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'history-item';
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'prompt-title';
        titleSpan.textContent = item.title;
        
        titleSpan.addEventListener('click', () => {
            if (confirm(`Load saved prompt: "${item.title}"? This will overwrite your current draft.`)) {
                state.currentMode = item.mode;
                state.formData = JSON.parse(JSON.stringify(item.formData));
                state.variables = {};
                
                const activeBlueprint = BLUEPRINTS[item.mode];
                state.currentStepIndex = activeBlueprint.steps.length;
                
                currentModeTitle.textContent = activeBlueprint.title;
                currentModeSubtitle.textContent = activeBlueprint.subtitle;
                chatMessages.innerHTML = '';
                
                addBotMessage(`Loaded saved prompt session: **${item.title}**.`);
                
                Object.keys(blueprints).forEach(m => {
                    blueprints[m].classList.toggle('active', m === item.mode);
                });

                buildCriteriaChecklist();
                updateLivePreview();
                updateChecklistUI();
                
                stepIndicator.textContent = "Saved Prompt Loaded!";
                chatInputField.placeholder = "Loaded from history storage.";
                chatInputField.disabled = true;
                chatInputField.value = '';
                suggestionChips.innerHTML = '<span class="empty-history">Loaded session complete</span>';
            }
        });

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-hist-btn';
        delBtn.innerHTML = '&times;';
        delBtn.title = "Delete prompt";
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm("Delete this saved prompt?")) {
                state.history = state.history.filter(h => h.id !== item.id);
                localStorage.setItem('promptcraft_saved_prompts', JSON.stringify(state.history));
                renderHistoryUI();
                showToast('Deleted prompt from history');
            }
        });

        itemDiv.appendChild(titleSpan);
        itemDiv.appendChild(delBtn);
        historyList.appendChild(itemDiv);
    });
}

// --- Gemini AI Supercharge API System ---
async function superchargePromptWithAI() {
    if (!state.apiKey) {
        alert("Please set your Gemini API Key in Settings first to unlock AI Prompt Supercharging! 🚀");
        settingsToggleBtn.click();
        return;
    }

    const currentPromptText = promptOutputPre.textContent;
    if (!currentPromptText || currentPromptText.includes('[Not yet defined]')) {
        alert("The current prompt is incomplete. Please finish the chatbot questions first!");
        return;
    }

    superchargeBtn.disabled = true;
    superchargeBtn.style.opacity = '0.5';
    superchargeBtn.querySelector('span').textContent = 'Supercharging...';

    addBotMessage("🤖 *Connecting to Gemini API...* I am sending your structured blueprints for professional rewriting. One moment.");
    addTypingIndicator();

    try {
        let systemRole = "You are a professional Prompt Engineer specialized in crafting highly-optimized prompts for Large Language Models (like GPT-4, Claude, Gemini) and image creators (like Midjourney, DALL-E).";
        let userInstruction = `Analyze and supercharge this prompt to make it achieve the best of the best outputs. Add contextual enhancers, advanced prompt engineering techniques, formatting directives, clear task divisions, and handle potential errors or assumptions. Keep the output strictly as the final prompt. Do not add conversational words like "Here is your prompt:".

Here is the draft prompt:
\`\`\`
${currentPromptText}
\`\`\`

Return ONLY the rewritten, production-grade prompt.`;

        if (state.currentMode === 'image') {
            systemRole = "You are an expert Midjourney and DALL-E prompt engineer who knows how to format prompts with descriptors, camera details, lighting details, and aspect ratio keywords.";
            userInstruction = `Optimize the following image prompt to make it cinematic, rich in details, artistic, and visually stunning. Add descriptive adjectives, render engines (like Unreal Engine 5, Octane render), lens parameters (e.g., 85mm lens, f/1.8), and appropriate camera directions if applicable. Keep the format concise, suitable for direct copy-pasting into Midjourney or DALL-E.

Here is the draft prompt:
${currentPromptText}

Return ONLY the optimized image prompt string. Do not explain anything.`;
        }

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${state.selectedModel}:generateContent?key=${state.apiKey}`;
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${systemRole}\n\n${userInstruction}` }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'Error occurred during API request');
        }

        const superchargedText = data.candidates[0].content.parts[0].text;
        
        removeTypingIndicator();
        addBotMessage("🚀 **Supercharged!** Google Gemini has successfully optimized and polished your prompt. Check out the updated Preview tab!");
        
        promptOutputPre.textContent = superchargedText;
        promptBadge.textContent = "AI Supercharged";
        promptBadge.className = "prompt-badge complete";
        
        showToast("Prompt optimized by Gemini AI! ✨");
        detectAndRenderVariables();
    } catch (e) {
        console.error(e);
        removeTypingIndicator();
        addBotMessage(`⚠️ **API Error:** Failed to call Gemini. Details: *${e.message}*. Verify your API key in Settings.`);
        alert(`Gemini API Error: ${e.message}`);
    } finally {
        superchargeBtn.disabled = false;
        superchargeBtn.style.opacity = '1';
        superchargeBtn.querySelector('span').textContent = 'Supercharge (AI)';
    }
}

// --- Feature A: Sandbox Test Execution Playground ---
// --- Feature A: Sandbox Test Execution Playground ---
function syncSandboxUI() {
    const isImageMode = state.currentMode === 'image';
    const sandboxTitle = contentSandbox ? contentSandbox.querySelector('h3') : null;
    const sandboxDesc = contentSandbox ? contentSandbox.querySelector('.tab-info-text') : null;
    const sandboxLabel = document.getElementById('sandbox-output-label');
    const sandboxImageWrapper = document.getElementById('sandbox-image-wrapper');
    
    if (isImageMode) {
        if (sandboxTitle) sandboxTitle.innerHTML = '🎨 Neural Image Studio Sandbox';
        if (sandboxDesc) sandboxDesc.textContent = 'Render visual art using your compiled prompt! Enter secondary styles/tweaks below to guide the generator and click render.';
        if (sandboxLabel) sandboxLabel.textContent = 'Rendered Image Outcome';
        if (sandboxOutputPre) sandboxOutputPre.style.display = 'none';
        if (sandboxImageWrapper) sandboxImageWrapper.style.display = 'flex';
        if (sandboxUserMessage) {
            sandboxUserMessage.placeholder = 'e.g. Add glowing neon lighting, make the background blurred, 8k rendering details...';
        }
        if (sandboxRunBtn) {
            sandboxRunBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                Generate Visual Art
            `;
        }
    } else {
        if (sandboxTitle) sandboxTitle.innerHTML = '⚡ AI Execution Sandbox';
        if (sandboxDesc) sandboxDesc.textContent = 'Test your compiled prompt immediately! Enter a message below and run it (requires Gemini API key in Settings).';
        if (sandboxLabel) sandboxLabel.textContent = 'Sandbox Response Output';
        if (sandboxOutputPre) sandboxOutputPre.style.display = 'block';
        if (sandboxImageWrapper) sandboxImageWrapper.style.display = 'none';
        if (sandboxUserMessage) {
            sandboxUserMessage.placeholder = 'Type a message that you would send to your generated prompt persona...';
        }
        if (sandboxRunBtn) {
            sandboxRunBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Run Sandbox Test
            `;
        }
    }
}

async function runSandboxTest() {
    if (state.currentMode === 'image') {
        runImageSandboxTest();
        return;
    }

    if (!state.apiKey) {
        alert("Please set your Gemini API Key in Settings first to run prompt tests inside the Sandbox! 🚀");
        settingsToggleBtn.click();
        return;
    }

    const testInput = sandboxUserMessage.value.trim();
    if (!testInput) {
        alert("Please enter a user query message to test against your prompt!");
        return;
    }

    // Process variable values inside prompt before executing
    const compiledPrompt = getProcessedPrompt();
    if (!compiledPrompt || compiledPrompt.includes('[Not yet defined]')) {
        alert("Your prompt is empty. Answer chatbot questions or load a preset first!");
        return;
    }

    // UI Feedback
    sandboxRunBtn.disabled = true;
    sandboxRunBtn.style.opacity = '0.5';
    sandboxRunBtn.innerHTML = `
        <svg class="typing-indicator" style="width: 14px; height: 14px; margin-right: 6px; display: inline-block;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4 31.4" transform="rotate(0)"><animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="1s" repeatCount="indefinite"/></circle></svg>
        Executing Test...
    `;
    sandboxOutputPre.textContent = "Connecting to Gemini, running test simulation...\n\nApplying system instructions:\n" + compiledPrompt.substring(0, 150) + "...\n\nRunning query: \"" + testInput + "\"";

    try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${state.selectedModel}:generateContent?key=${state.apiKey}`;
        
        // Formulate request. The compiled prompt acts as the System Instruction (or is merged as a system guideline prefix)
        const systemPrefixedQuery = `[SYSTEM INSTRUCTIONS / PROMPT PROFILE]\n${compiledPrompt}\n\n[USER INPUT / QUERY TO RUN]\n${testInput}`;
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrefixedQuery }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'Error occurred during Sandbox fetch execution');
        }

        const modelResultText = data.candidates[0].content.parts[0].text;
        
        // Render Result in output
        sandboxOutputPre.textContent = modelResultText;
        showToast("Sandbox execution complete! 🎯");
    } catch (e) {
        console.error(e);
        sandboxOutputPre.textContent = `⚠️ Execution Error:\nFailed to run sandbox simulation.\nDetails: ${e.message}\n\nCheck your API key settings or internet connection.`;
        alert(`Sandbox Execution Error: ${e.message}`);
    } finally {
        sandboxRunBtn.disabled = false;
        sandboxRunBtn.style.opacity = '1';
        sandboxRunBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Run Sandbox Test
        `;
    }
}

async function runImageSandboxTest() {
    const testInput = sandboxUserMessage ? sandboxUserMessage.value.trim() : '';
    const compiledPrompt = getProcessedPrompt();

    if (!compiledPrompt || compiledPrompt.includes('[Not yet defined]')) {
        alert("Your prompt is empty. Complete chatbot questions or load a preset first!");
        return;
    }

    const imgEl = document.getElementById('sandbox-generated-img');
    const loaderEl = document.getElementById('sandbox-img-loader');

    if (imgEl) imgEl.style.display = 'none';
    if (loaderEl) loaderEl.style.display = 'flex';

    if (sandboxRunBtn) {
        sandboxRunBtn.disabled = true;
        sandboxRunBtn.style.opacity = '0.5';
        sandboxRunBtn.innerHTML = `
            <svg class="typing-indicator" style="width: 14px; height: 14px; margin-right: 6px; display: inline-block;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4 31.4" transform="rotate(0)"><animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="1s" repeatCount="indefinite"/></circle></svg>
            Generating Artwork...
        `;
    }

    let promptToGenerate = compiledPrompt;

    // Use Gemini if key present to merge refinements
    if (state.apiKey && testInput) {
        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${state.selectedModel}:generateContent?key=${state.apiKey}`;
            const systemMsg = "You are a Midjourney Prompt compiler assistant. Your job is to take a base prompt template, apply the user's secondary styling tweaks, and output a unified, detailed Midjourney prompt starting with '/imagine prompt:'.";
            const userMsg = `Base Prompt:\n"""\n${compiledPrompt}\n"""\n\nUser's Secondary Styling Tweak:\n"${testInput}"\n\nCombine these into a single, cohesive, descriptive visual prompt. Return ONLY the final combined Midjourney prompt string starting with '/imagine prompt:'. Do not include other text or explanations.`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `${systemMsg}\n\n${userMsg}` }] }]
                })
            });

            const data = await response.json();
            if (!data.error && data.candidates) {
                promptToGenerate = data.candidates[0].content.parts[0].text;
            }
        } catch (e) {
            console.warn("Failed to merge image prompt via Gemini, falling back to local compilation:", e);
            promptToGenerate = `${compiledPrompt}, ${testInput}`;
        }
    } else if (testInput) {
        promptToGenerate = `${compiledPrompt}, ${testInput}`;
    }

    // Clean up prompt to pass to image generator
    let cleanPrompt = promptToGenerate;
    
    // Extract base prompt content if imagine command is prepended
    if (cleanPrompt.toLowerCase().includes("imagine prompt:")) {
        const parts = cleanPrompt.split(/imagine prompt:\s*/i);
        if (parts[1]) cleanPrompt = parts[1];
    }
    
    // Remove Midjourney specific flags & parameters (e.g. --ar 16:9, --v 6.0, --stylize 300)
    cleanPrompt = cleanPrompt.replace(/--[a-z0-9\.:]+(\s+[a-z0-9\.:]+)?/gi, '');
    
    // Remove formatting headers & labels (e.g. "Artistic Style / Medium:", "Lighting & Atmosphere:")
    cleanPrompt = cleanPrompt.replace(/(Artistic Style|Medium|Composition|Camera Angle|Lighting|Atmosphere|Negative Keywords|Exclude|Quality Enhancers|Parameters|Technical Directives|Subject):\s*/gi, '');
    
    // Remove brackets, asterisks, hash characters
    cleanPrompt = cleanPrompt.replace(/[\*#{}\[\]]/g, '');
    
    // Convert newlines and multiple spaces into simple comma-separated phrases
    cleanPrompt = cleanPrompt.replace(/\n+/g, ', ').replace(/,+/g, ',').replace(/\s+/g, ' ');
    
    // Limit total prompt length to avoid router HTTP 414 / URI too long failures
    cleanPrompt = cleanPrompt.trim();
    if (cleanPrompt.length > 400) {
        cleanPrompt = cleanPrompt.substring(0, 400);
    }

    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/p/${encodeURIComponent(cleanPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;

    // Load image using Image object
    const tempImg = new Image();
    tempImg.src = imageUrl;

    tempImg.onload = () => {
        if (imgEl) {
            imgEl.src = imageUrl;
            imgEl.style.display = 'block';
        }
        if (loaderEl) loaderEl.style.display = 'none';

        if (sandboxRunBtn) {
            sandboxRunBtn.disabled = false;
            sandboxRunBtn.style.opacity = '1';
            sandboxRunBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                Generate Visual Art
            `;
        }
        showToast("Visual artwork generated! 🎨");
    };

    tempImg.onerror = () => {
        if (loaderEl) loaderEl.style.display = 'none';
        alert("Failed to load generated artwork from neural model endpoint. Try again!");
        if (sandboxRunBtn) {
            sandboxRunBtn.disabled = false;
            sandboxRunBtn.style.opacity = '1';
            sandboxRunBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                Generate Visual Art
            `;
        }
    };
}


// --- Toast notification ---
function showToast(message) {
    toastNotification.textContent = message;
    toastNotification.classList.add('active');
    setTimeout(() => {
        toastNotification.classList.remove('active');
    }, 3000);
}

// ==========================================
// CODE-TO-PROMPT COMPILER ENGINE
// ==========================================

const codeOptimizerContainer = document.getElementById('code-optimizer-container');
const chatContainer = document.querySelector('.chat-container');
const optimizerCodeInput = document.getElementById('optimizer-code-input');
const optimizerExtraConstraints = document.getElementById('optimizer-extra-constraints');
const goalPillsContainer = document.getElementById('goal-pills');
const blueprintCodetoprompt = document.getElementById('blueprint-codetoprompt');

// Track active goal pill
let activeGoal = 'debug';

// Language detection via regex heuristics
function detectLanguage(code) {
    if (!code || !code.trim()) return 'Unknown';

    const patterns = [
        { lang: 'Python',     regex: /\bdef\s+\w+\s*\(|import\s+\w+|from\s+\w+\s+import|print\s*\(|#.*python/i },
        { lang: 'JavaScript', regex: /\b(const|let|var)\s+\w+\s*=|function\s+\w+\s*\(|=>\s*{|require\s*\(|module\.exports/i },
        { lang: 'TypeScript', regex: /:\s*(string|number|boolean|void|any)\b|interface\s+\w+|type\s+\w+\s*=|<T>/i },
        { lang: 'Java',       regex: /public\s+(class|static|void)\s+\w+|System\.out\.print|@Override|import\s+java\./i },
        { lang: 'C++',        regex: /#include\s*<|std::|cout\s*<<|cin\s*>>|int\s+main\s*\(/i },
        { lang: 'C#',         regex: /using\s+System|namespace\s+\w+|Console\.Write|public\s+class\s+\w+.*{/i },
        { lang: 'Rust',       regex: /fn\s+\w+\s*\(|let\s+mut\s+|println!\s*\(|use\s+std::/i },
        { lang: 'Go',         regex: /func\s+\w+\s*\(|fmt\.Print|package\s+main|import\s+"fmt"/i },
        { lang: 'SQL',        regex: /\b(SELECT|INSERT|UPDATE|DELETE|CREATE TABLE|DROP|ALTER|FROM|WHERE|JOIN)\b/i },
        { lang: 'HTML',       regex: /<html|<head|<body|<div|<span|<script|<!DOCTYPE html>/i },
        { lang: 'CSS',        regex: /[a-z-]+\s*:\s*[a-z0-9#"'%\s]+;|\.[a-z][\w-]*\s*{|@media\s+/i },
        { lang: 'Shell/Bash', regex: /^#!\/bin\/(bash|sh)|echo\s+|chmod\s+|curl\s+|grep\s+/im },
        { lang: 'PHP',        regex: /<\?php|\$\w+\s*=|echo\s+|function\s+\w+\s*\(/i },
        { lang: 'Ruby',       regex: /def\s+\w+\s*\n|puts\s+|require\s+'|\.each\s+do/i },
        { lang: 'Swift',      regex: /func\s+\w+\s*\(|var\s+\w+\s*:\s*\w+|print\s*\(|import\s+Foundation/i },
        { lang: 'Kotlin',     regex: /fun\s+\w+\s*\(|val\s+\w+|println\s*\(|import\s+kotlin\./i },
    ];

    for (const { lang, regex } of patterns) {
        if (regex.test(code)) return lang;
    }
    return 'General Code';
}

// Goal-specific prompt template generator
const CODE_GOAL_TEMPLATES = {
    debug: (lang, code, extra) => `# 🤖 SYSTEM ROLE
Act as a world-class ${lang} debugging expert and senior software engineer with 15+ years of experience identifying and resolving complex software defects. You approach debugging with methodical precision, tracing root causes through logic flow and runtime behavior.

## 🎯 PRIMARY OBJECTIVE
Your mission is to perform a comprehensive code audit on the provided ${lang} code. Identify ALL bugs, logical errors, edge case failures, and runtime hazards. For each issue found, explain the root cause clearly and provide a fully corrected, production-ready implementation.

## 🔍 CODE TO DEBUG
\`\`\`${lang.toLowerCase()}
${code}
\`\`\`

## ⚙️ DEBUGGING METHODOLOGY
Apply the following rigorous analysis pipeline:
1. **Static Analysis** — Scan for syntax errors, undefined variables, off-by-one errors, type mismatches, and anti-patterns.
2. **Logic Flow Tracing** — Walk through the execution path and verify conditional branches, loop bounds, and return values.
3. **Edge Case Auditing** — Test against null/empty inputs, boundary values, large inputs, and invalid data types.
4. **Security Review** — Flag any injection vulnerabilities, unvalidated inputs, or unsafe operations.
5. **Performance Issues** — Identify any O(n²) or worse complexity, memory leaks, or blocking synchronous operations.

## 📋 OUTPUT FORMAT (STRICT)
Structure your response exactly as:
**1. 🐛 Bug Summary Table** — A markdown table listing each bug (Line #, Type, Severity, Description).
**2. 🔎 Root Cause Analysis** — For each bug, explain WHY it fails and under what conditions.
**3. ✅ Corrected Code** — The fully fixed, production-ready implementation inside a markdown code fence.
**4. 🧪 Test Cases** — Provide 3+ test cases (including edge cases) that validate the fix.${extra ? `\n\n## 🔒 ADDITIONAL CONSTRAINTS\n${extra}` : ''}

---
*System initialized for maximum debug depth. Begin analysis immediately.*`,

    optimize: (lang, code, extra) => `# 🤖 SYSTEM ROLE
Act as a Principal Performance Engineer specializing in ${lang} optimization, algorithmic efficiency, and systems-level performance tuning. You think in Big-O notation and optimize for both time and space complexity.

## 🎯 PRIMARY OBJECTIVE
Analyze the provided ${lang} code and perform a deep algorithmic and performance optimization. Transform it from its current state into a hyper-optimized, production-hardened version that minimizes computational complexity and resource consumption.

## 🔍 CODE TO OPTIMIZE
\`\`\`${lang.toLowerCase()}
${code}
\`\`\`

## ⚡ OPTIMIZATION CHECKLIST
Apply every applicable optimization from this checklist:
- **Algorithmic Complexity** — Reduce Big-O time/space complexity. Replace brute-force with optimal data structures (hash maps, heaps, binary search, dynamic programming).
- **Redundant Computation** — Eliminate duplicate calculations. Cache expensive results with memoization or lazy evaluation.
- **Memory Efficiency** — Minimize allocations, prefer in-place operations, use generators/iterators where applicable.
- **Concurrency** — Identify parallelizable operations; apply async/await, threading, or vectorization where beneficial.
- **I/O Optimization** — Batch reads/writes, minimize database round trips, implement connection pooling.
- **Modern Language Features** — Use latest ${lang} idioms, built-ins, and standard library optimizations.${extra ? `\n- **Custom Constraints**: ${extra}` : ''}

## 📊 OUTPUT FORMAT (STRICT)
**1. 📈 Performance Analysis** — Current complexity (Time: O(?), Space: O(?)) with bottleneck identification.
**2. ⚡ Optimized Code** — Complete rewritten implementation inside a markdown code fence.
**3. 📊 Complexity Comparison** — Before vs. After comparison table (Operation | Before | After | Improvement).
**4. 💡 Optimization Notes** — Detailed explanation of every change made and why.

---
*Optimization engine initialized. Analyzing computational patterns...*`,

    tests: (lang, code, extra) => `# 🤖 SYSTEM ROLE
Act as a Senior QA Engineer and Test Architect specializing in ${lang} with deep expertise in test-driven development (TDD), behavior-driven development (BDD), and comprehensive test coverage strategies.

## 🎯 PRIMARY OBJECTIVE
Write a complete, production-grade test suite for the provided ${lang} code. Your tests must achieve maximum code coverage while following testing best practices for the ${lang} ecosystem.

## 🔍 CODE TO TEST
\`\`\`${lang.toLowerCase()}
${code}
\`\`\`

## 🧪 TEST SUITE REQUIREMENTS
Generate a comprehensive test suite covering all of:
- **Happy Path Tests** — All standard use cases with expected valid inputs.
- **Edge Cases** — Null/empty inputs, boundary values (0, -1, max int), empty collections, single elements.
- **Error & Exception Tests** — Verify that invalid inputs throw the correct exceptions with proper messages.
- **Integration Tests** — Test interactions between components or external dependencies (mocked).
- **Performance Tests** — Verify functions execute within acceptable time bounds under load.
- **Regression Tests** — Pin existing behavior to catch regressions in future changes.${extra ? `\n- **Additional Requirements**: ${extra}` : ''}

## 📋 OUTPUT FORMAT (STRICT)
**1. 📂 Test File** — Complete, runnable test file using the standard ${lang} testing framework (e.g., pytest, Jest, JUnit, testing.T). Include all necessary imports and mocking setup.
**2. 📊 Coverage Report** — Estimated coverage breakdown by function/branch.
**3. 🔧 Setup Instructions** — Commands to install dependencies and run the test suite.

---
*QA engine initialized. Generating comprehensive test coverage...*`,

    explain: (lang, code, extra) => `# 🤖 SYSTEM ROLE
Act as a world-class ${lang} technical educator and code documentation specialist. You excel at transforming complex code into crystal-clear explanations that are accessible to both beginners and senior engineers, while maintaining technical rigor.

## 🎯 PRIMARY OBJECTIVE
Produce a complete, detailed technical explanation of the provided ${lang} code. Your explanation must illuminate every aspect of what the code does, how it works, and why design decisions were made.

## 🔍 CODE TO EXPLAIN
\`\`\`${lang.toLowerCase()}
${code}
\`\`\`

## 📖 EXPLANATION FRAMEWORK
Structure your explanation to cover all of:
1. **High-Level Overview** — What does this code do in 2-3 sentences? What problem does it solve?
2. **Architecture & Components** — Break down the major components, classes, or functions and their responsibilities.
3. **Line-by-Line Walkthrough** — Walk through the most critical or complex sections in detail.
4. **Data Flow Diagram** (in text/ASCII) — Illustrate how data enters, transforms, and exits.
5. **Design Decisions** — Explain WHY the author chose this approach over alternatives.
6. **Complexity Analysis** — Time and space complexity with justification.
7. **Potential Issues** — Identify any edge cases, limitations, or improvement opportunities.${extra ? `\n8. **Special Focus**: ${extra}` : ''}

## 📋 OUTPUT FORMAT
Use clear markdown headers, inline code formatting \`like_this\`, and concrete examples. Maintain the following verbosity level: expert-friendly but accessible to a mid-level developer.

---
*Documentation engine initialized. Generating comprehensive code analysis...*`,

    refactor: (lang, code, extra) => `# 🤖 SYSTEM ROLE
Act as a Principal Software Architect specializing in ${lang} and modern software design patterns. You are an expert in SOLID principles, clean code practices, DRY/KISS/YAGNI methodology, and domain-driven design.

## 🎯 PRIMARY OBJECTIVE
Perform a comprehensive architectural refactoring of the provided ${lang} code. Transform it from its current state into a clean, maintainable, extensible, and elegantly structured implementation that would pass the most rigorous code review.

## 🔍 CODE TO REFACTOR
\`\`\`${lang.toLowerCase()}
${code}
\`\`\`

## 🏗️ REFACTORING PRINCIPLES (Apply All)
- **SOLID Principles** — Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.
- **DRY (Don't Repeat Yourself)** — Extract duplicate logic into shared utilities, helpers, or mixins.
- **Clean Naming** — Rename variables/functions to be expressive, intention-revealing, and consistent.
- **Decomposition** — Break monolithic functions (>20 lines) into focused, single-purpose units.
- **Design Patterns** — Apply appropriate patterns (Factory, Strategy, Observer, Repository, etc.) where beneficial.
- **Error Handling** — Implement robust, centralized error handling with meaningful error types.
- **Documentation** — Add docstrings/JSDoc to all public methods with parameters, return types, and examples.
- **Testability** — Ensure all components are independently testable with no hidden dependencies.${extra ? `\n- **Custom Requirements**: ${extra}` : ''}

## 📋 OUTPUT FORMAT (STRICT)
**1. 🏗️ Architecture Overview** — Describe the new structural design and the reasoning behind each change.
**2. ✨ Refactored Code** — Complete, production-grade implementation inside a markdown code fence.
**3. 📋 Change Log** — Bullet-point summary of every change made and the principle it satisfies.
**4. 🔄 Migration Notes** — How to safely migrate from old to new implementation if it's a breaking change.

---
*Architecture engine initialized. Applying clean code transformation pipeline...*`
};

// Main code compiler function
function compileCodeToPrompt() {
    const code = optimizerCodeInput ? optimizerCodeInput.value.trim() : '';
    const extra = optimizerExtraConstraints ? optimizerExtraConstraints.value.trim() : '';
    const lang = detectLanguage(code);

    if (!code) {
        return `# 💻 Developer Prompt Compiler\n\n[Paste your source code in the left panel to generate an optimized developer prompt.]\n\n**How to use:**\n1. Paste your code in the text area on the left\n2. Select a goal (Debug, Optimize, Test, Explain, or Refactor)\n3. Optionally add extra constraints\n4. The prompt will auto-compile here in real time!`;
    }

    const templateFn = CODE_GOAL_TEMPLATES[activeGoal] || CODE_GOAL_TEMPLATES.debug;
    return templateFn(lang, code, extra);
}

// Wire up the Code-to-Prompt mode
function initCodeToPromptMode() {
    state.currentMode = 'codetoprompt';

    // Toggle layout visibility
    if (chatContainer) chatContainer.style.display = 'none';
    if (codeOptimizerContainer) codeOptimizerContainer.style.display = 'flex';

    // Header update
    currentModeTitle.textContent = '⚡ Code-to-Prompt Compiler';
    currentModeSubtitle.textContent = 'Paste code → select goal → copy elite developer prompt instantly.';

    // Highlight the sidebar button
    document.querySelectorAll('.blueprint-item').forEach(btn => btn.classList.remove('active'));
    if (blueprintCodetoprompt) blueprintCodetoprompt.classList.add('active');

    // Reset preview and compile immediately
    updateCodeToPromptPreview();
    // Sync Sandbox layout dynamically
    syncSandboxUI();
}

function exitCodeToPromptMode() {
    if (chatContainer) chatContainer.style.display = '';
    if (codeOptimizerContainer) codeOptimizerContainer.style.display = 'none';
}

function updateCodeToPromptPreview() {
    const compiled = compileCodeToPrompt();
    promptOutputPre.textContent = compiled;
    // Detect lang badge
    const code = optimizerCodeInput ? optimizerCodeInput.value.trim() : '';
    const lang = detectLanguage(code);
    promptBadge.textContent = code ? `${lang} Detected` : 'Ready';
    promptBadge.className = code ? 'prompt-badge complete' : 'prompt-badge';
}

// Set up event listeners for the code optimizer panel
function setupCodeToPromptListeners() {
    if (!blueprintCodetoprompt) return;

    blueprintCodetoprompt.addEventListener('click', () => {
        if (state.currentMode !== 'codetoprompt') {
            const hadData = Object.keys(state.formData).length > 0;
            if (hadData && !confirm('Switch to Code-to-Prompt mode? Your current draft will remain saved.')) return;
            initCodeToPromptMode();
            sidebar.classList.remove('active');
        }
    });

    // Listen to code input changes for live compile
    if (optimizerCodeInput) {
        optimizerCodeInput.addEventListener('input', () => {
            if (state.currentMode === 'codetoprompt') updateCodeToPromptPreview();
        });
    }

    // Listen to constraints changes
    if (optimizerExtraConstraints) {
        optimizerExtraConstraints.addEventListener('input', () => {
            if (state.currentMode === 'codetoprompt') updateCodeToPromptPreview();
        });
    }

    // Goal pill selection
    if (goalPillsContainer) {
        goalPillsContainer.addEventListener('click', (e) => {
            const pill = e.target.closest('.goal-pill');
            if (!pill) return;
            activeGoal = pill.dataset.goal;
            goalPillsContainer.querySelectorAll('.goal-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            if (state.currentMode === 'codetoprompt') updateCodeToPromptPreview();
        });
    }
}

// ==========================================
// PROMPT QUALITY EVALUATOR SCORECARD
// ==========================================

const evaluatorModal = document.getElementById('evaluator-modal');
const evaluatorCloseBtn = document.getElementById('evaluator-close-btn');
const evaluatorCloseActionBtn = document.getElementById('evaluator-close-action-btn');
const evaluatePromptBtn = document.getElementById('evaluate-prompt-btn');

const evalScoreCircle = document.getElementById('eval-score-circle');
const evalScoreGrade = document.getElementById('eval-score-grade');
const evalFeedbackContent = document.getElementById('eval-feedback-content');

function setupEvaluatorListeners() {
    if (evaluatePromptBtn) {
        evaluatePromptBtn.addEventListener('click', () => {
            runPromptEvaluation();
        });
    }
    if (evaluatorCloseBtn) {
        evaluatorCloseBtn.addEventListener('click', () => evaluatorModal.classList.remove('active'));
    }
    if (evaluatorCloseActionBtn) {
        evaluatorCloseActionBtn.addEventListener('click', () => evaluatorModal.classList.remove('active'));
    }
    if (evaluatorModal) {
        evaluatorModal.addEventListener('click', (e) => {
            if (e.target === evaluatorModal) evaluatorModal.classList.remove('active');
        });
    }
}

function runPromptEvaluation() {
    const promptText = promptOutputPre.textContent || '';

    if (!promptText || promptText.includes('[Not yet defined]') || promptText.length < 50) {
        alert('Your prompt needs more content before it can be evaluated. Complete at least 2-3 steps first!');
        return;
    }

    // Local heuristic scoring
    const scores = computeHeuristicScores(promptText);
    const overall = Math.round((scores.role + scores.task + scores.context + scores.constraints + scores.format) / 5);
    const grade = scoreToGrade(overall);
    const feedback = generateFeedback(scores, overall, promptText);

    // Render into modal
    renderScorecard(scores, overall, grade, feedback);

    // Open modal
    evaluatorModal.classList.add('active');

    // Animate bars after a short delay
    setTimeout(() => animateMetricBars(scores), 100);

    // If API key present, enhance feedback with Gemini
    if (state.apiKey) {
        enhanceFeedbackWithAI(promptText, scores, overall, grade);
    }
}

function computeHeuristicScores(text) {
    const lower = text.toLowerCase();
    const wordCount = text.split(/\s+/).length;

    // Role / Persona
    let role = 0;
    if (/act as|you are a|system role|persona/i.test(text)) role += 40;
    if (/expert|specialist|senior|professional|world-class|elite/i.test(text)) role += 30;
    if (/years of experience|industry|domain/i.test(text)) role += 20;
    if (wordCount > 50) role += 10;
    role = Math.min(role, 100);

    // Task scope
    let task = 0;
    if (/objective|mission|task|goal|primary|your job/i.test(text)) task += 35;
    if (/specific|detail|comprehensive|thorough/i.test(text)) task += 25;
    if (wordCount > 100) task += 20;
    if (/step[s]?\s*(1|one|by)|first.*then.*finally/i.test(text)) task += 20;
    task = Math.min(task, 100);

    // Context and data
    let context = 0;
    if (/context|background|information|data|details/i.test(text)) context += 35;
    if (/audience|user|customer|stakeholder/i.test(text)) context += 20;
    if (/platform|technology|environment|version/i.test(text)) context += 20;
    if (wordCount > 200) context += 25;
    context = Math.min(context, 100);

    // Constraints / negatives
    let constraints = 0;
    if (/do not|don't|avoid|never|strictly|prohibited|constraint|rule/i.test(text)) constraints += 40;
    if (/must not|should not|refrain|exclude/i.test(text)) constraints += 30;
    if (/only|limit|restrict/i.test(text)) constraints += 20;
    if (wordCount > 150) constraints += 10;
    constraints = Math.min(constraints, 100);

    // Formatting rigor
    let format = 0;
    if (/format|structure|markdown|json|table|list|section/i.test(text)) format += 30;
    if (/###|##|#\s/i.test(text)) format += 25; // Has markdown headers
    if (/output|response|result|return/i.test(text)) format += 20;
    if (/```|code\s+fence|fenced\s+block/i.test(text)) format += 15;
    if (wordCount > 200) format += 10;
    format = Math.min(format, 100);

    return { role, task, context, constraints, format };
}

function scoreToGrade(score) {
    if (score >= 93) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 87) return 'A-';
    if (score >= 83) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 77) return 'B-';
    if (score >= 73) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 65) return 'C-';
    if (score >= 60) return 'D';
    return 'F';
}

function generateFeedback(scores, overall, text) {
    const suggestions = [];

    if (scores.role < 60) {
        suggestions.push('⚡ ROLE: Add a more specific role definition. Use "Act as [title] with [X] years of expertise in [domain]" — specificity dramatically improves output quality.');
    } else if (scores.role < 85) {
        suggestions.push('✅ ROLE: Good persona definition. Consider adding industry credentials or a specific niche (e.g., "specializing in fintech APIs" vs. just "developer").');
    } else {
        suggestions.push('🏆 ROLE: Excellent role specification! The persona is well-defined and authoritative.');
    }

    if (scores.task < 60) {
        suggestions.push('⚡ TASK: Your objective needs more specificity. Define the exact deliverable, quantity, and success criteria (e.g., "Write a 5-step actionable plan that..." vs. "Help me with...").');
    } else if (scores.task < 85) {
        suggestions.push('✅ TASK: Solid task definition. Add numbered sub-tasks or a step-by-step breakdown to guide the AI\'s execution path more precisely.');
    } else {
        suggestions.push('🏆 TASK: Excellent objective clarity! The task is well-scoped and actionable.');
    }

    if (scores.context < 60) {
        suggestions.push('⚡ CONTEXT: Provide more background context — target audience, platform, technical environment, and existing constraints. LLMs produce dramatically better results with richer context.');
    } else if (scores.context < 85) {
        suggestions.push('✅ CONTEXT: Good context provided. Add any specific data, metrics, or domain-specific details to further ground the AI\'s responses in your specific reality.');
    } else {
        suggestions.push('🏆 CONTEXT: Rich contextual grounding! This helps the AI produce hyper-relevant, accurate responses.');
    }

    if (scores.constraints < 60) {
        suggestions.push('⚡ CONSTRAINTS: Add negative instructions (what NOT to do). This is one of the most powerful prompt engineering techniques — it prevents hallucinations and unwanted patterns.');
    } else if (scores.constraints < 85) {
        suggestions.push('✅ CONSTRAINTS: Good rules defined. Add more specific negative constraints, e.g., "Do not use passive voice", "Never assume missing information", "Avoid generic openers".');
    } else {
        suggestions.push('🏆 CONSTRAINTS: Strong constraint set! Clear boundaries significantly improve output consistency.');
    }

    if (scores.format < 60) {
        suggestions.push('⚡ FORMAT: Define an explicit output format. Specify structure (markdown, JSON, table), length, and sections. Unformatted prompts produce unpredictable outputs.');
    } else if (scores.format < 85) {
        suggestions.push('✅ FORMAT: Format guidelines present. Add specific section titles, word counts, or example output snippets for even more control over the structure.');
    } else {
        suggestions.push('🏆 FORMAT: Excellent output formatting specification! Clear format instructions ensure consistent, usable outputs.');
    }

    // Overall summary
    let summary = '';
    if (overall >= 87) {
        summary = `\n🚀 OVERALL [${overall}/100]: This is an elite-grade prompt! It follows professional prompt engineering best practices and will consistently produce high-quality outputs across all major AI platforms.`;
    } else if (overall >= 70) {
        summary = `\n⚡ OVERALL [${overall}/100]: This is a solid prompt with room for improvement. Address the flagged areas above to push it to production-grade quality.`;
    } else {
        summary = `\n⚠️ OVERALL [${overall}/100]: This prompt needs significant work. Focus on adding a clear role, specific objective, context, and constraints to dramatically improve output quality.`;
    }

    return suggestions.join('\n\n') + summary;
}

function renderScorecard(scores, overall, grade, feedback) {
    // Set score circle value and class
    evalScoreCircle.textContent = overall;
    evalScoreCircle.className = 'score-circle';
    if (overall >= 80) evalScoreCircle.classList.add('high');
    else if (overall >= 60) evalScoreCircle.classList.add('mid');
    else evalScoreCircle.classList.add('low');

    // Set grade and color class
    evalScoreGrade.textContent = grade;
    const gradeCard = evaluatorModal.querySelector('.evaluator-card');
    gradeCard.className = 'modal-card evaluator-card';
    const letter = grade[0].toLowerCase();
    gradeCard.classList.add(`grade-${letter}`);

    // Set metric score labels (bars are animated separately)
    const metricsMap = {
        role: scores.role,
        task: scores.task,
        context: scores.context,
        constraints: scores.constraints,
        format: scores.format
    };

    Object.entries(metricsMap).forEach(([key, val]) => {
        const scoreEl = document.getElementById(`metric-score-${key}`);
        const barEl = document.getElementById(`metric-bar-${key}`);
        if (scoreEl) scoreEl.textContent = `${val}%`;
        if (barEl) barEl.style.width = '0%'; // Reset before animation
    });

    evalFeedbackContent.textContent = feedback;
}

function animateMetricBars(scores) {
    const metricsMap = {
        role: scores.role,
        task: scores.task,
        context: scores.context,
        constraints: scores.constraints,
        format: scores.format
    };

    Object.entries(metricsMap).forEach(([key, val], i) => {
        setTimeout(() => {
            const barEl = document.getElementById(`metric-bar-${key}`);
            if (barEl) barEl.style.width = `${val}%`;
        }, i * 120); // Stagger each bar
    });
}

async function enhanceFeedbackWithAI(promptText, scores, overall, grade) {
    try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${state.selectedModel}:generateContent?key=${state.apiKey}`;
        const systemMsg = `You are an expert Prompt Engineer specializing in AI prompt quality evaluation. Analyze this prompt and provide concise, specific, actionable improvements. Be direct and technical.`;
        const userMsg = `Rate this AI prompt and provide 3 specific, actionable improvement suggestions. Be extremely concise (max 150 words total). Focus on the weakest areas: Role ${scores.role}%, Task ${scores.task}%, Context ${scores.context}%, Constraints ${scores.constraints}%, Format ${scores.format}%. Overall ${overall}/100 (${grade}).

PROMPT TO EVALUATE:
"""
${promptText.substring(0, 1500)}
"""

Return ONLY the 3 improvement suggestions as a numbered list. No preamble.`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemMsg}\n\n${userMsg}` }] }]
            })
        });

        const data = await response.json();
        if (data.error || !data.candidates) return;

        const aiSuggestions = data.candidates[0].content.parts[0].text;
        const currentFeedback = evalFeedbackContent.textContent;
        evalFeedbackContent.textContent = currentFeedback + '\n\n🤖 AI ENHANCEMENT TIPS (Gemini):\n' + aiSuggestions;
    } catch (e) {
        // Silent fail — local heuristic feedback is already shown
        console.warn('AI evaluator enhancement skipped:', e.message);
    }
}

// ==========================================
// UPGRADED VARIABLE PARSER (WITH SELECT DROPDOWNS)
// ==========================================

function detectAndRenderVariables() {
    const rawPromptText = state.currentMode === 'codetoprompt'
        ? promptOutputPre.textContent
        : compilePrompt();

    // Match {{name}} OR {{name:select[A|B|C]}}
    const textVarRegex = /\{\{([a-zA-Z0-9_-]+)\}\}/g;
    const selectVarRegex = /\{\{([a-zA-Z0-9_-]+):select\[([^\]]+)\]\}\}/g;

    const foundVars = []; // { name, type, options? }
    let match;

    // Process select dropdowns first
    const tempText = rawPromptText;
    const selectMatches = {};
    while ((match = selectVarRegex.exec(tempText)) !== null) {
        const varName = match[1];
        const options = match[2].split('|').map(o => o.trim());
        if (!selectMatches[varName]) {
            selectMatches[varName] = options;
            foundVars.push({ name: varName, type: 'select', options });
        }
    }

    // Then plain text vars
    while ((match = textVarRegex.exec(rawPromptText)) !== null) {
        const varName = match[1];
        if (!selectMatches[varName] && !foundVars.find(v => v.name === varName)) {
            foundVars.push({ name: varName, type: 'text' });
        }
    }

    // Update count badge
    if (varsCountBadge) {
        varsCountBadge.textContent = foundVars.length;
        varsCountBadge.style.display = foundVars.length > 0 ? 'inline-block' : 'none';
    }

    // Render form
    if (!variablesFormContainer) return;
    variablesFormContainer.innerHTML = '';

    if (foundVars.length === 0) {
        variablesFormContainer.innerHTML = '<div class="empty-history">No variables detected. Use {{variable_name}} or {{name:select[Option1|Option2]}} as placeholders.</div>';
        return;
    }

    foundVars.forEach(vDef => {
        if (state.variables[vDef.name] === undefined) {
            state.variables[vDef.name] = '';
        }

        const group = document.createElement('div');
        group.className = 'variable-input-group';

        const label = document.createElement('label');
        label.setAttribute('for', `var-input-${vDef.name}`);
        label.textContent = vDef.name.replace(/_/g, ' ');

        let input;
        if (vDef.type === 'select') {
            input = document.createElement('select');
            input.className = 'variable-input setting-input';
            input.id = `var-input-${vDef.name}`;
            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.textContent = `-- Select ${vDef.name} --`;
            input.appendChild(defaultOpt);
            vDef.options.forEach(opt => {
                const optEl = document.createElement('option');
                optEl.value = opt;
                optEl.textContent = opt;
                if (state.variables[vDef.name] === opt) optEl.selected = true;
                input.appendChild(optEl);
            });
        } else {
            input = document.createElement('input');
            input.type = 'text';
            input.className = 'variable-input';
            input.id = `var-input-${vDef.name}`;
            input.value = state.variables[vDef.name];
            input.placeholder = `Enter value for {{${vDef.name}}}...`;
        }

        input.addEventListener('change', () => {
            state.variables[vDef.name] = input.value;
        });
        input.addEventListener('input', () => {
            state.variables[vDef.name] = input.value;
        });

        group.appendChild(label);
        group.appendChild(input);
        variablesFormContainer.appendChild(group);
    });
}

// ==========================================
// BOOT: Wire everything up on DOMContentLoaded
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    setupCodeToPromptListeners();
    setupEvaluatorListeners();

    // Load session username into header
    try {
        const session = JSON.parse(localStorage.getItem('promptcraft_session') || '{}');
        const nameEl = document.getElementById('header-username');
        if (nameEl && session.name) nameEl.textContent = session.name;
    } catch(e) {}

    // Logout handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('promptcraft_session');
            window.location.href = 'auth.html';
        });
    }

    // Sandbox Image Downloader handler
    const downloadSandboxImageBtn = document.getElementById('download-sandbox-image-btn');
    if (downloadSandboxImageBtn) {
        downloadSandboxImageBtn.addEventListener('click', () => {
            const imgEl = document.getElementById('sandbox-generated-img');
            if (!imgEl || !imgEl.src) {
                alert("No generated visual artwork is available to download yet!");
                return;
            }
            const link = document.createElement('a');
            link.href = imgEl.src;
            link.download = 'promptcraft_generated_art.png';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // =============================================
    // ✨ PROMPT REWRITER FEATURE
    // =============================================
    setupPromptRewriter();
});

// =============================================
// ✨ Prompt Rewriter — Gemini-Powered
// =============================================
function setupPromptRewriter() {
    const rewriterRunBtn = document.getElementById('rewriter-run-btn');
    const rewriterCopyBtn = document.getElementById('rewriter-copy-btn');
    const rewriterSendBtn = document.getElementById('rewriter-send-to-preview-btn');
    const rewriterSaveBtn = document.getElementById('rewriter-save-btn');

    if (rewriterRunBtn) {
        rewriterRunBtn.addEventListener('click', runPromptRewriter);
    }

    if (rewriterCopyBtn) {
        rewriterCopyBtn.addEventListener('click', () => {
            const outputPre = document.getElementById('rewriter-output-pre');
            const text = outputPre ? outputPre.textContent : '';
            if (text && !text.startsWith('[Rewritten')) {
                navigator.clipboard.writeText(text).then(() => showToast('Rewritten prompt copied! ✨'));
            } else {
                showToast('Run the rewriter first, then copy.');
            }
        });
    }

    if (rewriterSendBtn) {
        rewriterSendBtn.addEventListener('click', () => {
            const outputPre = document.getElementById('rewriter-output-pre');
            const text = outputPre ? outputPre.textContent : '';
            if (!text || text.startsWith('[Rewritten')) {
                showToast('Run the rewriter first to get a prompt.');
                return;
            }
            // Push to preview panel
            const promptOutputPre = document.getElementById('prompt-output-pre');
            if (promptOutputPre) {
                promptOutputPre.textContent = text;
                const promptBadge = document.getElementById('prompt-badge');
                if (promptBadge) {
                    promptBadge.textContent = 'AI Rewritten';
                    promptBadge.className = 'prompt-badge complete';
                }
                // Switch to Preview tab
                document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                const previewTab = document.getElementById('tab-btn-preview');
                const previewContent = document.getElementById('content-preview');
                if (previewTab) previewTab.classList.add('active');
                if (previewContent) previewContent.classList.add('active');
                showToast('Rewritten prompt sent to Preview tab! 🚀');
                detectAndRenderVariables();
            }
        });
    }

    // 💾 Save rewritten prompt to the local library
    if (rewriterSaveBtn) {
        rewriterSaveBtn.addEventListener('click', () => {
            const outputPre = document.getElementById('rewriter-output-pre');
            const rawInput = document.getElementById('rewriter-raw-input');
            const text = outputPre ? outputPre.textContent.trim() : '';

            if (!text || text.startsWith('[Rewritten')) {
                showToast('Rewrite a prompt first before saving!');
                return;
            }

            // Build a smart title from first non-empty line or raw input summary
            let title = '';
            const firstLine = text.split('\n').find(l => l.trim().length > 0) || '';
            // Strip markdown headings (#) and trim
            const cleanFirst = firstLine.replace(/^#+\s*/, '').trim();
            title = cleanFirst.length > 0
                ? `✨ ${cleanFirst.substring(0, 60)}${cleanFirst.length > 60 ? '...' : ''}`
                : `✨ Rewritten Prompt (${new Date().toLocaleDateString()})`;

            const savedEntry = {
                id: Date.now().toString(),
                title: title,
                content: text,
                mode: 'rewrite',
                formData: {
                    role: rawInput ? rawInput.value.substring(0, 80) : 'Rewritten Prompt'
                },
                timestamp: new Date().toISOString()
            };

            state.history.unshift(savedEntry);
            localStorage.setItem('promptcraft_saved_prompts', JSON.stringify(state.history));
            renderHistoryUI();

            // Visual feedback on button
            rewriterSaveBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Saved!`;
            rewriterSaveBtn.style.background = 'rgba(34, 197, 94, 0.2)';
            rewriterSaveBtn.style.borderColor = 'rgba(34, 197, 94, 0.5)';
            rewriterSaveBtn.style.color = '#22c55e';
            setTimeout(() => {
                rewriterSaveBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save`;
                rewriterSaveBtn.style.background = '';
                rewriterSaveBtn.style.borderColor = '';
                rewriterSaveBtn.style.color = '';
            }, 2500);

            showToast('Rewritten prompt saved to your library! 💾');
        });
    }
}

async function runPromptRewriter() {
    const rawInput = document.getElementById('rewriter-raw-input');
    const styleSelect = document.getElementById('rewriter-style');
    const targetSelect = document.getElementById('rewriter-target');
    const outputPre = document.getElementById('rewriter-output-pre');
    const rewriterBadge = document.getElementById('rewrite-badge');
    const runBtn = document.getElementById('rewriter-run-btn');

    const rawText = rawInput ? rawInput.value.trim() : '';
    const style = styleSelect ? styleSelect.value : 'professional';
    const target = targetSelect ? targetSelect.value : 'general';

    if (!rawText) {
        showToast('Please write your draft prompt first!', 'error');
        if (rawInput) rawInput.focus();
        return;
    }

    if (!state.apiKey) {
        showToast('Add your Gemini API key in Settings (⚙️) to use the Rewriter!', 'error');
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) settingsBtn.click();
        return;
    }

    // Style descriptions for system prompt
    const styleDescriptions = {
        professional: 'professional, well-structured with clear sections',
        detailed: 'ultra-detailed and comprehensive with exhaustive specifications',
        concise: 'concise, direct, and to-the-point with no fluff',
        creative: 'creative, engaging, and vivid with imaginative language',
        technical: 'highly technical, precise, with specific implementation details'
    };

    const targetDescriptions = {
        general: 'general-purpose AI models like ChatGPT or Gemini',
        claude: 'Claude by Anthropic (prefers XML-structured prompts with detailed context)',
        midjourney: 'Midjourney or DALL-E image generation (use vivid descriptors, style keywords, aspect ratios)',
        code: 'GitHub Copilot or coding AI assistants (focus on specifications, constraints, test cases)',
        agent: 'AI agent and automation systems (define tools, goals, success criteria, error handling)'
    };

    const systemPrompt = `You are a world-class Prompt Engineer with deep expertise in crafting production-grade prompts for Large Language Models.

Your task is to transform the user's rough, informal draft prompt into a ${styleDescriptions[style] || 'professional, well-structured'} mega-prompt optimized for ${targetDescriptions[target] || 'general AI models'}.

TRANSFORMATION RULES:
1. Add a clear ROLE / PERSONA definition that sets the AI's expertise and behavior
2. Define the OBJECTIVE with precise, measurable goals
3. Include relevant CONTEXT, background, and constraints the user implied
4. Add OUTPUT FORMAT specifications (structure, length, tone, format type)
5. Include QUALITY STANDARDS and what success looks like
6. Add CONSTRAINTS and edge cases to handle
7. If the user specified preferences, honor them exactly — do NOT override their choices
8. Use the user's domain/topic — expand it, don't replace it
9. Make it actionable, specific, and ready-to-use

OUTPUT: Return ONLY the final rewritten mega-prompt. No explanations, no "Here is your prompt:", no markdown wrapping. Just the prompt itself.`;

    const userMessage = `Transform this draft prompt into a professional mega-prompt:

"""
${rawText}
"""`;

    // Set loading state
    if (runBtn) {
        runBtn.disabled = true;
        runBtn.innerHTML = `<svg class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="31.4 31.4"/><animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="1s" repeatCount="indefinite"/></svg> Rewriting with Gemini...`;
    }
    if (outputPre) {
        outputPre.textContent = '⏳ Gemini is transforming your prompt into a professional mega-prompt...';
        outputPre.style.opacity = '0.6';
    }
    if (rewriterBadge) {
        rewriterBadge.textContent = 'Processing...';
        rewriterBadge.className = 'prompt-badge drafting';
    }

    try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${state.selectedModel}:generateContent?key=${state.apiKey}`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${systemPrompt}\n\n${userMessage}` }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'Gemini API error');
        }

        const rewrittenPrompt = data.candidates[0].content.parts[0].text;

        if (outputPre) {
            outputPre.textContent = rewrittenPrompt;
            outputPre.style.opacity = '1';
        }
        if (rewriterBadge) {
            rewriterBadge.textContent = 'Rewritten ✨';
            rewriterBadge.className = 'prompt-badge complete';
        }

        showToast('Prompt rewritten by Gemini! Click "Use as Prompt" to apply it. ✨');

    } catch (e) {
        console.error('Rewriter error:', e);
        if (outputPre) {
            outputPre.textContent = `⚠️ Error: ${e.message}\n\nCheck your API key in Settings and try again.`;
            outputPre.style.opacity = '1';
        }
        if (rewriterBadge) {
            rewriterBadge.textContent = 'Error';
            rewriterBadge.className = 'prompt-badge';
        }
        showToast(`Gemini API Error: ${e.message}`, 'error');
    } finally {
        if (runBtn) {
            runBtn.disabled = false;
            runBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Rewrite with Gemini ✨`;
        }
    }
}
