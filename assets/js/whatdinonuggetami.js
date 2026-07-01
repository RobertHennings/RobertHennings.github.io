(function () {
    const SESSION_STATE_KEY = "whatdino.sessionState.v2";
    const USER_HISTORY_KEY = "whatdino.userHistory.v2";
    const SESSION_USED_KEY = `${SESSION_STATE_KEY}.used`;
    const MAX_ROUNDS = 5;

    const dinos = [
        {
            id: "trex",
            name: "T Rex Nugget",
            shortName: "T Rex",
            emoji: "🦖",
            color: "#f87171",
            copy: "Big bite energy. You are decisive, loud when needed, and impossible to ignore once you pick a direction.",
            accent: ["#f87171", "#fb7185"],
            point: { x: 50, y: 11 },
        },
        {
            id: "triceratops",
            name: "Triceratops Nugget",
            shortName: "Triceratops",
            emoji: "🛡️",
            color: "#fbbf24",
            copy: "Reliable and grounded. You protect your people, stay calm under pressure, and always keep the mission steady.",
            accent: ["#fbbf24", "#f59e0b"],
            point: { x: 81, y: 35 },
        },
        {
            id: "stegosaurus",
            name: "Stegosaurus Nugget",
            shortName: "Stegosaurus",
            emoji: "🌿",
            color: "#34d399",
            copy: "Quiet confidence with a hidden edge. You keep it peaceful, practical, and surprisingly sharp when it counts.",
            accent: ["#34d399", "#10b981"],
            point: { x: 68, y: 82 },
        },
        {
            id: "parasaurolophus",
            name: "Parasaurolophus Nugget",
            shortName: "Parasaurolophus",
            emoji: "🎺",
            color: "#60a5fa",
            copy: "Social and expressive. You bring momentum to groups, keep conversation flowing, and make plans feel alive.",
            accent: ["#60a5fa", "#3b82f6"],
            point: { x: 32, y: 82 },
        },
        {
            id: "pterodactylus",
            name: "Pterodactylus Nugget",
            shortName: "Pterodactylus",
            emoji: "🪽",
            color: "#c084fc",
            copy: "Fast pattern-recognition and high perspective. You see angles others miss and pivot before the room catches up.",
            accent: ["#c084fc", "#a855f7"],
            point: { x: 19, y: 35 },
        },
    ];

    const dinoById = Object.fromEntries(dinos.map((dino) => [dino.id, dino]));

    const questionStems = [
        { category: "Lunch mission", prompt: "What does your ideal lunch mission look like?" },
        { category: "Mystery door", prompt: "A mystery door opens. What do you do first?" },
        { category: "Group chat", prompt: "How do you enter a group chat?" },
        { category: "Backpack", prompt: "Which item actually lives in your backpack?" },
        { category: "Soundtrack", prompt: "Pick your soundtrack for a tiny quest." },
        { category: "Extra sauce", prompt: "A cashier offers extra sauce. Your reaction?" },
        { category: "Road trip", prompt: "What energy do you bring to a road trip?" },
        { category: "Desk square", prompt: "Your desk has one free square. What goes there?" },
        { category: "Surprise challenge", prompt: "How do you approach a surprise challenge?" },
        { category: "Snack theft", prompt: "Which snack are you most likely to steal?" },
        { category: "Room entry", prompt: "How do you enter a room?" },
        { category: "Saturday weather", prompt: "What is your ideal Saturday weather?" },
        { category: "Dino sidekick", prompt: "You are assigned a dinosaur sidekick. How do you train it?" },
        { category: "Plan changes", prompt: "What do you do when the plan changes?" },
        { category: "Museum mode", prompt: "Choose your museum behavior." },
        { category: "Midnight fridge", prompt: "How do you survive a midnight fridge raid?" },
        { category: "Hallway vibe", prompt: "Which vibe do you radiate in a hallway?" },
        { category: "Lunch table", prompt: "What is your lunch table role?" },
        { category: "Talking shoes", prompt: "If your shoes could talk, what would they say?" },
        { category: "Turn signal", prompt: "How do you handle a turn signal?" },
        { category: "Sticker sheet", prompt: "Someone hands you a sticker sheet. What happens?" },
        { category: "Claimed chair", prompt: "Pick the chair you claim immediately." },
        { category: "Moving couch", prompt: "A friend asks for your help moving a couch. You..." },
        { category: "Snack tray", prompt: "What kind of snack tray are you?" },
    ];

    function scoreFor(primary, secondary) {
        const score = { trex: 0, triceratops: 0, stegosaurus: 0, parasaurolophus: 0, pterodactylus: 0 };
        score[primary] = 3;
        if (secondary && secondary !== primary) {
            score[secondary] = 1;
        }
        return score;
    }

    const optionThemes = [
        {
            name: "Action Mode",
            options: [
                { label: "Charge first and improvise mid-sprint.", hint: "Momentum over overthinking.", score: scoreFor("trex", "pterodactylus") },
                { label: "Set boundaries and hold the line.", hint: "Protective and stable.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "Keep it smooth, warm, and collaborative.", hint: "People-first and grounded.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "Scan all exits before choosing one.", hint: "Perspective and precision.", score: scoreFor("pterodactylus", "trex") },
                { label: "Quietly optimize everything in the background.", hint: "Calm with hidden spikes.", score: scoreFor("stegosaurus", "parasaurolophus") },
            ],
        },
        {
            name: "Social Mode",
            options: [
                { label: "I become the hype engine.", hint: "Loud, playful, magnetic.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I make sure everyone gets home safe.", hint: "Steady and dependable.", score: scoreFor("triceratops", "parasaurolophus") },
                { label: "I host the side conversation that saves the night.", hint: "Warm and quietly iconic.", score: scoreFor("stegosaurus", "parasaurolophus") },
                { label: "I steer every idea into something fun.", hint: "Expressive and connective.", score: scoreFor("parasaurolophus", "trex") },
                { label: "I float between circles and map the room.", hint: "Strategic and quick.", score: scoreFor("pterodactylus", "triceratops") },
            ],
        },
        {
            name: "Travel Mode",
            options: [
                { label: "No map. Just appetite and speed.", hint: "Fearless detours.", score: scoreFor("trex", "parasaurolophus") },
                { label: "Checklist, backup plan, charger, done.", hint: "Prepared and sturdy.", score: scoreFor("triceratops", "pterodactylus") },
                { label: "Scenic route and zero rush.", hint: "Comfort over chaos.", score: scoreFor("stegosaurus", "triceratops") },
                { label: "Playlist curator and vibes director.", hint: "Harmonize the whole crew.", score: scoreFor("parasaurolophus", "stegosaurus") },
                { label: "Window seat with full aerial strategy.", hint: "Top-down thinking.", score: scoreFor("pterodactylus", "trex") },
            ],
        },
        {
            name: "Desk Mode",
            options: [
                { label: "Three tabs, one deadline, all gas.", hint: "Bold execution.", score: scoreFor("trex", "pterodactylus") },
                { label: "Color-coded tasks and clear owners.", hint: "Structure wins.", score: scoreFor("triceratops", "parasaurolophus") },
                { label: "A tidy notebook and surgical focus.", hint: "Calm precision.", score: scoreFor("stegosaurus", "pterodactylus") },
                { label: "Voice memo brainstorm and team sync.", hint: "Communicate, then accelerate.", score: scoreFor("parasaurolophus", "trex") },
                { label: "Prototype first, explain later.", hint: "High-altitude iteration.", score: scoreFor("pterodactylus", "stegosaurus") },
            ],
        },
    ];

    const app = document.querySelector("[data-whatdino-app]");

    if (!app) {
        return;
    }

    const els = {
        stage: app.querySelector("[data-stage]"),
        poolCount: app.querySelector("[data-pool-count]"),
        resultPill: app.querySelector("[data-result-pill]"),
        gameCount: app.querySelector("[data-game-count]"),
        resumeButton: app.querySelector('[data-action="resume"]'),
        startButton: app.querySelector('[data-action="start"]'),
        playAgainButton: app.querySelector('[data-action="play-again"]'),
        downloadButton: app.querySelector('[data-action="download"]'),
        shareButton: app.querySelector('[data-action="share"]'),
        questionCategory: app.querySelector("[data-question-category]"),
        questionText: app.querySelector("[data-question-text]"),
        roundIndex: app.querySelector("[data-round-index]"),
        progressFill: app.querySelector("[data-progress-fill]"),
        options: app.querySelector("[data-options]"),
        status: app.querySelector("[data-status]"),
        resultRegion: app.querySelector("[data-result-region]"),
        resultName: app.querySelector("[data-result-name]"),
        resultCopy: app.querySelector("[data-result-copy]"),
        marker: app.querySelector("[data-marker]"),
        pentagram: app.querySelector("[data-pentagram]"),
        nodeButtons: Array.from(app.querySelectorAll("[data-dino-node]")),
    };

    const state = {
        questions: [],
        currentIndex: 0,
        score: { trex: 0, triceratops: 0, stegosaurus: 0, parasaurolophus: 0, pterodactylus: 0 },
        answers: [],
        completed: false,
    };

    function safeRead(key) {
        try {
            const value = localStorage.getItem(key) || sessionStorage.getItem(key);
            if (!value) {
                return [];
            }
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    function safeWrite(key, values, useSession = false) {
        try {
            const storage = useSession ? sessionStorage : localStorage;
            storage.setItem(key, JSON.stringify(values.slice(-400)));
        } catch (error) {
            return;
        }
    }

    function readState() {
        try {
            const raw = sessionStorage.getItem(SESSION_STATE_KEY);
            if (!raw) {
                return null;
            }
            const parsed = JSON.parse(raw);
            if (!parsed || !Array.isArray(parsed.questions)) {
                return null;
            }
            return parsed;
        } catch (error) {
            return null;
        }
    }

    function saveState() {
        try {
            sessionStorage.setItem(SESSION_STATE_KEY, JSON.stringify(state));
        } catch (error) {
            return;
        }
    }

    function clearState() {
        try {
            sessionStorage.removeItem(SESSION_STATE_KEY);
        } catch (error) {
            return;
        }
    }

    function shuffle(list) {
        const copy = list.slice();
        for (let index = copy.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
        }
        return copy;
    }

    function slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function buildQuestionBank() {
        return questionStems.flatMap((stem, stemIndex) => optionThemes.map((theme, themeIndex) => ({
            id: `${stemIndex}-${themeIndex}-${slugify(stem.category)}`,
            category: `${stem.category} / ${theme.name}`,
            prompt: stem.prompt,
            options: shuffle(theme.options).map((option) => ({ ...option })),
        })));
    }

    const questionBank = buildQuestionBank();

    function getUsedQuestions() {
        const userQuestions = safeRead(USER_HISTORY_KEY);
        const sessionQuestions = safeRead(SESSION_USED_KEY);
        return new Set([...userQuestions, ...sessionQuestions]);
    }

    function recordUsedQuestions(questionIds) {
        const currentUserHistory = safeRead(USER_HISTORY_KEY);
        const currentSessionHistory = safeRead(SESSION_USED_KEY);
        const nextUserHistory = Array.from(new Set([...currentUserHistory, ...questionIds]));
        const nextSessionHistory = Array.from(new Set([...currentSessionHistory, ...questionIds]));
        safeWrite(USER_HISTORY_KEY, nextUserHistory, false);
        safeWrite(SESSION_USED_KEY, nextSessionHistory, true);
    }

    function getAvailableQuestions() {
        const usedQuestions = getUsedQuestions();
        return questionBank.filter((question) => !usedQuestions.has(question.id));
    }

    function selectQuestionSet() {
        const available = getAvailableQuestions();
        if (available.length < MAX_ROUNDS) {
            return null;
        }
        return shuffle(available).slice(0, MAX_ROUNDS).map((question) => ({
            ...question,
            options: shuffle(question.options),
        }));
    }

    function setStatus(message) {
        els.status.textContent = message;
    }

    function showResumeButton(visible) {
        els.resumeButton.hidden = !visible;
    }

    function showStage(visible) {
        els.stage.classList.toggle("is-hidden", !visible);
    }

    function setGameMeta() {
        els.poolCount.textContent = String(questionBank.length);
        els.gameCount.textContent = `${Math.min(state.currentIndex, MAX_ROUNDS)} / ${MAX_ROUNDS}`;
        els.roundIndex.textContent = String(Math.min(state.currentIndex, MAX_ROUNDS));
        els.progressFill.style.width = `${(Math.min(state.currentIndex, MAX_ROUNDS) / MAX_ROUNDS) * 100}%`;
    }

    function getWinner() {
        const ranked = dinos
            .map((dino) => ({ id: dino.id, value: state.score[dino.id] || 0 }))
            .sort((left, right) => {
                if (right.value !== left.value) {
                    return right.value - left.value;
                }
                return dinos.findIndex((dino) => dino.id === left.id) - dinos.findIndex((dino) => dino.id === right.id);
            });

        return {
            top: ranked[0],
            second: ranked[1],
            ranked,
        };
    }

    function scoreToMarker(ranked) {
        const total = ranked.reduce((sum, row) => sum + row.value, 0);

        if (!total) {
            return { x: 50, y: 50 };
        }

        let x = 0;
        let y = 0;
        ranked.forEach((entry) => {
            const dino = dinoById[entry.id];
            const weight = entry.value / total;
            x += dino.point.x * weight;
            y += dino.point.y * weight;
        });

        return {
            x: Math.max(10, Math.min(90, x)),
            y: Math.max(10, Math.min(90, y)),
        };
    }

    function renderPentagram(winnerId, markerPosition) {
        els.pentagram.style.setProperty("--marker-x", `${markerPosition.x}%`);
        els.pentagram.style.setProperty("--marker-y", `${markerPosition.y}%`);

        els.nodeButtons.forEach((node) => {
            const isActive = node.getAttribute("data-dino-node") === winnerId;
            node.classList.toggle("is-active", isActive);
        });
    }

    function renderResult() {
        const winner = getWinner();
        const dino = dinoById[winner.top.id];
        const markerPosition = scoreToMarker(winner.ranked);

        renderPentagram(dino.id, markerPosition);
        els.resultName.textContent = dino.name;
        els.resultCopy.textContent = dino.copy;
        els.resultPill.textContent = dino.shortName;

        els.resultRegion.classList.remove("is-hidden");
        setGameMeta();
        setStatus(`Result locked: ${dino.name}.`);
        state.completed = true;
        saveState();
    }

    function renderQuestion() {
        showStage(true);

        if (!state.questions.length || state.currentIndex >= state.questions.length) {
            renderResult();
            return;
        }

        const question = state.questions[state.currentIndex];
        els.questionCategory.textContent = question.category;
        els.questionText.textContent = question.prompt;
        els.options.innerHTML = "";
        els.resultRegion.classList.add("is-hidden");
        els.resultPill.textContent = "In progress";

        question.options.forEach((option) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "whatdino-option";
            button.innerHTML = `<span class="whatdino-option__label">${option.label}</span><span class="whatdino-option__hint">${option.hint}</span>`;
            button.addEventListener("click", () => chooseOption(option));
            els.options.appendChild(button);
        });

        setGameMeta();
        setStatus(`Question ${state.currentIndex + 1} of ${MAX_ROUNDS}.`);
        showResumeButton(true);
        saveState();
    }

    function chooseOption(option) {
        dinos.forEach((dino) => {
            state.score[dino.id] += option.score[dino.id] || 0;
        });

        state.answers.push({ questionId: state.questions[state.currentIndex].id, option: option.label });
        state.currentIndex += 1;

        if (state.currentIndex >= MAX_ROUNDS) {
            renderResult();
            return;
        }

        renderQuestion();
    }

    function startRun() {
        const questionSet = selectQuestionSet();
        showStage(true);

        if (!questionSet) {
            els.questionCategory.textContent = "Archive exhausted";
            els.questionText.textContent = "You have used the full local prompt archive. Clear site storage to restart fresh.";
            els.options.innerHTML = "";
            setStatus("Not enough unused prompts remain for a full 5-question run.");
            showResumeButton(false);
            els.resultRegion.classList.add("is-hidden");
            els.resultPill.textContent = "Archive full";
            clearState();
            return;
        }

        state.questions = questionSet;
        state.currentIndex = 0;
        state.score = { trex: 0, triceratops: 0, stegosaurus: 0, parasaurolophus: 0, pterodactylus: 0 };
        state.answers = [];
        state.completed = false;

        recordUsedQuestions(state.questions.map((question) => question.id));
        saveState();
        renderQuestion();
    }

    function resumeRun() {
        const saved = readState();

        if (!saved) {
            setStatus("No active run found. Start a new one.");
            return;
        }

        state.questions = saved.questions;
        state.currentIndex = typeof saved.currentIndex === "number" ? saved.currentIndex : 0;
        state.score = saved.score || { trex: 0, triceratops: 0, stegosaurus: 0, parasaurolophus: 0, pterodactylus: 0 };
        state.answers = Array.isArray(saved.answers) ? saved.answers : [];
        state.completed = Boolean(saved.completed);

        if (state.completed || state.currentIndex >= MAX_ROUNDS) {
            renderResult();
            return;
        }

        renderQuestion();
    }

    function updateButtonVisibility() {
        const saved = readState();
        showResumeButton(Boolean(saved && !saved.completed && Array.isArray(saved.questions) && saved.questions.length));
    }

    function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle) {
        const cornerRadius = Math.min(radius, width / 2, height / 2);
        ctx.beginPath();
        ctx.moveTo(x + cornerRadius, y);
        ctx.arcTo(x + width, y, x + width, y + height, cornerRadius);
        ctx.arcTo(x + width, y + height, x, y + height, cornerRadius);
        ctx.arcTo(x, y + height, x, y, cornerRadius);
        ctx.arcTo(x, y, x + width, y, cornerRadius);
        ctx.closePath();

        if (fillStyle) {
            ctx.fillStyle = fillStyle;
            ctx.fill();
        }
        if (strokeStyle) {
            ctx.strokeStyle = strokeStyle;
            ctx.stroke();
        }
    }

    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(/\s+/);
        let line = "";
        let offsetY = y;

        words.forEach((word, index) => {
            const testLine = `${line}${word} `;
            if (ctx.measureText(testLine).width > maxWidth && line) {
                ctx.fillText(line.trim(), x, offsetY);
                line = `${word} `;
                offsetY += lineHeight;
            } else {
                line = testLine;
            }

            if (index === words.length - 1) {
                ctx.fillText(line.trim(), x, offsetY);
            }
        });
    }

    function drawPentagramImage(ctx, x, y, size, winnerId, ranked, marker) {
        const points = dinos.map((dino) => {
            const px = x + (dino.point.x / 100) * size;
            const py = y + (dino.point.y / 100) * size;
            return { ...dino, px, py };
        });

        const centerX = x + size / 2;

        const starOrder = [0, 2, 4, 1, 3, 0];

        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(points[0].px, points[0].py);
        for (let index = 1; index < points.length; index += 1) {
            ctx.lineTo(points[index].px, points[index].py);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(points[starOrder[0]].px, points[starOrder[0]].py);
        for (let index = 1; index < starOrder.length; index += 1) {
            ctx.lineTo(points[starOrder[index]].px, points[starOrder[index]].py);
        }
        ctx.stroke();

        points.forEach((point) => {
            const isWinner = point.id === winnerId;
            ctx.fillStyle = isWinner ? point.color : "rgba(255, 255, 255, 0.85)";
            ctx.beginPath();
            ctx.arc(point.px, point.py, isWinner ? 25 : 19, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#1a1a2e";
            ctx.font = "700 20px Outfit, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(point.shortName, point.px, point.py + 42);
        });

        const markerX = x + (marker.x / 100) * size;
        const markerY = y + (marker.y / 100) * size;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(markerX, markerY, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(markerX, markerY, 26, 0, Math.PI * 2);
        ctx.stroke();

        const scoreLabel = ranked.map((entry) => `${dinoById[entry.id].shortName}: ${entry.value}`).join("  •  ");
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.font = "600 20px Outfit, sans-serif";
        ctx.fillText(scoreLabel, centerX, y + size + 56);

        ctx.restore();
    }

    async function buildResultCanvas() {
        const winner = getWinner();
        const result = dinoById[winner.top.id];
        const marker = scoreToMarker(winner.ranked);

        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1350;
        const ctx = canvas.getContext("2d");

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#0f1020");
        gradient.addColorStop(1, "#1a1a2e");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawRoundedRect(ctx, 60, 60, canvas.width - 120, canvas.height - 120, 42, "rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.17)");

        ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.font = "700 28px Outfit, sans-serif";
        ctx.fillText("HOLY DINO PENTAGON", 120, 120);

        ctx.fillStyle = result.color;
        ctx.font = "900 82px Outfit, sans-serif";
        wrapText(ctx, result.name, 120, 170, 860, 90);

        ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
        ctx.font = "500 29px Outfit, sans-serif";
        wrapText(ctx, result.copy, 120, 340, 860, 42);

        drawRoundedRect(ctx, 120, 470, 840, 620, 28, "rgba(255, 255, 255, 0.04)", "rgba(255, 255, 255, 0.2)");
        drawPentagramImage(ctx, 190, 530, 700, result.id, winner.ranked, marker);

        ctx.fillStyle = "rgba(255, 255, 255, 0.62)";
        ctx.font = "600 22px Outfit, sans-serif";
        ctx.fillText(`${window.location.origin}${window.location.pathname}`, 120, 1162);

        ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
        ctx.font = "500 20px Outfit, sans-serif";
        ctx.fillText("Generated from a five-round dino nugget personality run.", 120, 1202);

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                    return;
                }
                reject(new Error("Unable to build image blob."));
            }, "image/png");
        });
    }

    async function downloadImage() {
        const blob = await buildResultCanvas();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "holy-dino-pentagon-result.png";
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        setStatus("Image downloaded.");
    }

    async function shareImage() {
        const blob = await buildResultCanvas();
        const file = new File([blob], "holy-dino-pentagon-result.png", { type: "image/png" });
        const canShareFiles = typeof navigator.canShare === "function" && navigator.canShare({ files: [file] });

        if (navigator.share && canShareFiles) {
            await navigator.share({
                title: "Holy Dino Pentagon",
                text: `I got ${els.resultName.textContent}.`,
                files: [file],
            });
            setStatus("Share sheet opened.");
            return;
        }

        await downloadImage();

        try {
            await navigator.clipboard.writeText(`${els.resultName.textContent} - ${window.location.href}`);
            setStatus("Image downloaded and result text copied to clipboard.");
        } catch (error) {
            setStatus("Image downloaded. Share it from your downloads folder.");
        }
    }

    els.startButton.addEventListener("click", startRun);
    els.resumeButton.addEventListener("click", resumeRun);
    els.playAgainButton.addEventListener("click", startRun);
    els.downloadButton.addEventListener("click", () => {
        downloadImage().catch(() => setStatus("Could not create the image right now."));
    });
    els.shareButton.addEventListener("click", () => {
        shareImage().catch(() => setStatus("Could not open a share flow right now."));
    });

    setGameMeta();
    updateButtonVisibility();

    const savedState = readState();
    if (savedState && Array.isArray(savedState.questions) && savedState.questions.length) {
        state.questions = savedState.questions;
        state.currentIndex = typeof savedState.currentIndex === "number" ? savedState.currentIndex : 0;
        state.score = savedState.score || { trex: 0, triceratops: 0, stegosaurus: 0, parasaurolophus: 0, pterodactylus: 0 };
        state.answers = Array.isArray(savedState.answers) ? savedState.answers : [];
        state.completed = Boolean(savedState.completed);

        if (state.completed || state.currentIndex >= MAX_ROUNDS) {
            showStage(true);
            renderResult();
        } else {
            renderQuestion();
        }
    } else {
        showStage(false);
        els.questionCategory.textContent = "Ready when you are";
        els.questionText.textContent = "Start the run to get your first question.";
        setStatus("5 random questions. No repeats in your local archive.");
    }
})();
