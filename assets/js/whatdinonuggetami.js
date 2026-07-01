(function () {
    const SESSION_STATE_KEY = "whatdino.sessionState.v1";
    const USER_HISTORY_KEY = "whatdino.userHistory.v1";
    const MAX_ROUNDS = 5;

    const resultMap = {
        topLeft: {
            name: "Cozy Crunch Stego Nugget",
            shortName: "Stego",
            copy: "You are steady, warm, and just crispy enough to keep everyone coming back for another bite.",
            accent: ["#f0b37b", "#f36d4a"],
        },
        topRight: {
            name: "Wild Crunch Rex Nugget",
            shortName: "Rex",
            copy: "You are loud in the best way: big energy, sharp edges, and a heroic amount of sauce confidence.",
            accent: ["#f36d4a", "#b63d27"],
        },
        bottomLeft: {
            name: "Cozy Saucy Trike Nugget",
            shortName: "Trike",
            copy: "You are gentle, comforting, and secretly carrying the most dependable flavor on the table.",
            accent: ["#f2c14e", "#e09a2b"],
        },
        bottomRight: {
            name: "Wild Saucy Raptor Nugget",
            shortName: "Raptor",
            copy: "You move fast, think faster, and probably have three sauces open before anyone else notices.",
            accent: ["#2e7b7f", "#17585b"],
        },
    };

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
        { category: "Saturday weather", prompt: "What's your ideal Saturday weather?" },
        { category: "Dino sidekick", prompt: "You're assigned a dinosaur sidekick. How do you train it?" },
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

    const optionThemes = [
        {
            name: "Crunch Mode",
            options: [
                { label: "I keep it neat and tidy.", hint: "Calm, classic, and polished.", score: { x: -1, y: -1 } },
                { label: "I dunk it in reckless sauce.", hint: "Bold and a little unhinged.", score: { x: 1, y: 1 } },
                { label: "I organize the chaos a little.", hint: "Friendly, careful, and efficient.", score: { x: -1, y: 1 } },
                { label: "I sprint toward the nearest exit.", hint: "Fast, sharp, and unpredictable.", score: { x: 1, y: -1 } },
            ],
        },
        {
            name: "Social Mode",
            options: [
                { label: "I sit in the calm corner.", hint: "Low-key and observant.", score: { x: -1, y: -1 } },
                { label: "I become the loudest person there.", hint: "Maximum volume, maximum fun.", score: { x: 1, y: 1 } },
                { label: "I smile from the edge of the room.", hint: "Warm, steady, and understated.", score: { x: -1, y: 1 } },
                { label: "I start a harmless scheme.", hint: "Fast, playful, and a little chaotic.", score: { x: 1, y: -1 } },
            ],
        },
        {
            name: "Travel Mode",
            options: [
                { label: "Map, charger, backup plan.", hint: "Prepared before the wheels move.", score: { x: -1, y: -1 } },
                { label: "Last-minute road trip energy.", hint: "No plan, just momentum.", score: { x: 1, y: 1 } },
                { label: "Museum and hot cocoa.", hint: "Soft comfort with a detail eye.", score: { x: -1, y: 1 } },
                { label: "Wrong gate, right vibe.", hint: "Chaotic, fast, and somehow fine.", score: { x: 1, y: -1 } },
            ],
        },
        {
            name: "Desk Mode",
            options: [
                { label: "Color-coded sticky notes.", hint: "Neat, practical, and calm.", score: { x: -1, y: -1 } },
                { label: "Three tabs and a deadline.", hint: "Fast, fierce, and slightly spicy.", score: { x: 1, y: 1 } },
                { label: "A clean notebook and one pen.", hint: "Minimal, friendly, and collected.", score: { x: -1, y: 1 } },
                { label: "The desk chair becomes a rocket.", hint: "Pure velocity and nonsense.", score: { x: 1, y: -1 } },
            ],
        },
    ];

    const app = document.querySelector("[data-whatdino-app]");

    if (!app) {
        return;
    }

    const els = {
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
        quadrant: app.querySelector("[data-quadrant]"),
    };

    const state = {
        questions: [],
        currentIndex: 0,
        score: { x: 0, y: 0 },
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

    function clamp(number, min, max) {
        return Math.min(max, Math.max(min, number));
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
            options: theme.options.map((option) => ({ ...option })),
        })));
    }

    const questionBank = buildQuestionBank();

    function getUsedQuestions() {
        const userQuestions = safeRead(USER_HISTORY_KEY);
        const sessionQuestions = safeRead(`${SESSION_STATE_KEY}.used`);
        return new Set([...userQuestions, ...sessionQuestions]);
    }

    function recordUsedQuestions(questionIds) {
        const currentUserHistory = safeRead(USER_HISTORY_KEY);
        const currentSessionHistory = safeRead(`${SESSION_STATE_KEY}.used`);
        const nextUserHistory = Array.from(new Set([...currentUserHistory, ...questionIds]));
        const nextSessionHistory = Array.from(new Set([...currentSessionHistory, ...questionIds]));
        safeWrite(USER_HISTORY_KEY, nextUserHistory, false);
        safeWrite(`${SESSION_STATE_KEY}.used`, nextSessionHistory, true);
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

    function setGameMeta() {
        els.poolCount.textContent = String(questionBank.length);
        els.gameCount.textContent = `${Math.min(state.currentIndex, MAX_ROUNDS)} / ${MAX_ROUNDS}`;
        els.roundIndex.textContent = String(Math.min(state.currentIndex, MAX_ROUNDS));
        els.progressFill.style.width = `${(Math.min(state.currentIndex, MAX_ROUNDS) / MAX_ROUNDS) * 100}%`;
    }

    function showResumeButton(visible) {
        els.resumeButton.hidden = !visible;
    }

    function renderQuadrant(resultKey, score) {
        const result = resultMap[resultKey];
        const maxDistance = MAX_ROUNDS;
        const markerX = clamp(50 + (score.x / maxDistance) * 34, 11, 89);
        const markerY = clamp(50 - (score.y / maxDistance) * 34, 11, 89);

        els.quadrant.style.setProperty("--marker-x", `${markerX}%`);
        els.quadrant.style.setProperty("--marker-y", `${markerY}%`);

        const corners = Array.from(els.quadrant.querySelectorAll(".whatdino-quadrant__corner"));
        const activeMap = {
            topLeft: corners[0],
            topRight: corners[1],
            bottomLeft: corners[2],
            bottomRight: corners[3],
        };

        Object.values(activeMap).forEach((corner) => corner.classList.remove("whatdino-quadrant__corner--active"));

        if (resultKey === "topLeft") {
            activeMap.topLeft.classList.add("whatdino-quadrant__corner--active");
        } else if (resultKey === "topRight") {
            activeMap.topRight.classList.add("whatdino-quadrant__corner--active");
        } else if (resultKey === "bottomLeft") {
            activeMap.bottomLeft.classList.add("whatdino-quadrant__corner--active");
        } else {
            activeMap.bottomRight.classList.add("whatdino-quadrant__corner--active");
        }

        els.resultName.textContent = result.name;
        els.resultCopy.textContent = result.copy;
        els.resultPill.textContent = result.shortName;
    }

    function determineResultKey(score) {
        const horizontal = score.x >= 0 ? "right" : "left";
        const vertical = score.y >= 0 ? "top" : "bottom";

        if (horizontal === "left" && vertical === "top") {
            return "topLeft";
        }
        if (horizontal === "right" && vertical === "top") {
            return "topRight";
        }
        if (horizontal === "left" && vertical === "bottom") {
            return "bottomLeft";
        }
        return "bottomRight";
    }

    function renderResult() {
        const resultKey = determineResultKey(state.score);
        const result = resultMap[resultKey];
        renderQuadrant(resultKey, state.score);
        els.resultRegion.classList.remove("is-hidden");
        setGameMeta();
        setStatus(`Result locked: ${result.name}.`);
        state.completed = true;
        saveState();
    }

    function renderQuestion() {
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
        state.score.x += option.score.x;
        state.score.y += option.score.y;
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

        if (!questionSet) {
            els.questionCategory.textContent = "Archive exhausted";
            els.questionText.textContent = "You have already used the full nugget archive on this browser. Clear site storage to start a fresh timeline.";
            els.options.innerHTML = "";
            setStatus("Not enough unique questions remain for a fresh 5-round run.");
            showResumeButton(false);
            els.resultRegion.classList.add("is-hidden");
            els.resultPill.textContent = "Archive full";
            clearState();
            return;
        }

        state.questions = questionSet;
        state.currentIndex = 0;
        state.score = { x: 0, y: 0 };
        state.answers = [];
        state.completed = false;

        recordUsedQuestions(state.questions.map((question) => question.id));
        saveState();
        renderQuestion();
    }

    function resumeRun() {
        const saved = readState();

        if (!saved) {
            setStatus("No active trail found. Start a new one.");
            return;
        }

        state.questions = saved.questions;
        state.currentIndex = typeof saved.currentIndex === "number" ? saved.currentIndex : 0;
        state.score = saved.score || { x: 0, y: 0 };
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

    async function buildResultCanvas() {
        const resultKey = determineResultKey(state.score);
        const result = resultMap[resultKey];
        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1350;
        const ctx = canvas.getContext("2d");

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, result.accent[0]);
        gradient.addColorStop(1, result.accent[1]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(17, 15, 13, 0.2)";
        for (let index = 0; index < 10; index += 1) {
            ctx.beginPath();
            ctx.arc(120 + index * 88, 120 + (index % 3) * 74, 22 + (index % 4) * 3, 0, Math.PI * 2);
            ctx.fill();
        }

        drawRoundedRect(ctx, 60, 60, canvas.width - 120, canvas.height - 120, 44, "rgba(255, 251, 244, 0.92)");

        ctx.fillStyle = "#1d1a17";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#2e7b7f";
        ctx.font = "700 28px Georgia, serif";
        ctx.fillText("WHAT DINO NUGGET AM I?", 120, 116);

        ctx.fillStyle = "#1d1a17";
        ctx.font = "700 78px Georgia, serif";
        wrapText(ctx, result.name, 120, 170, 840, 88);

        ctx.fillStyle = "rgba(29, 26, 23, 0.72)";
        ctx.font = "500 28px Trebuchet MS, sans-serif";
        wrapText(ctx, result.copy, 120, 325, 840, 40);

        drawRoundedRect(ctx, 120, 460, 840, 540, 38, "rgba(255, 255, 255, 0.72)");
        drawQuadrantImage(ctx, 160, 500, 760, 460, resultKey, state.score);

        ctx.fillStyle = "rgba(29, 26, 23, 0.7)";
        ctx.font = "700 24px Trebuchet MS, sans-serif";
        ctx.fillText(`Score: ${state.score.x > 0 ? "+" : ""}${state.score.x} / ${state.score.y > 0 ? "+" : ""}${state.score.y}`, 120, 1040);

        ctx.fillStyle = "rgba(29, 26, 23, 0.55)";
        ctx.font = "700 22px Trebuchet MS, sans-serif";
        ctx.fillText(`${window.location.origin}${window.location.pathname}`, 120, 1112);

        ctx.fillStyle = "rgba(29, 26, 23, 0.6)";
        ctx.font = "500 20px Trebuchet MS, sans-serif";
        ctx.fillText("Generated from a five-round, no-repeat dino nugget quiz.", 120, 1170);

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
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth && line) {
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

    function drawQuadrantImage(ctx, x, y, width, height, resultKey, score) {
        const markers = {
            topLeft: { label: "Stego", fill: "rgba(240, 179, 123, 0.28)" },
            topRight: { label: "Rex", fill: "rgba(243, 109, 74, 0.28)" },
            bottomLeft: { label: "Trike", fill: "rgba(242, 193, 78, 0.28)" },
            bottomRight: { label: "Raptor", fill: "rgba(46, 123, 127, 0.28)" },
        };

        const cellWidth = width / 2;
        const cellHeight = height / 2;

        ctx.save();
        ctx.translate(x, y);

        ctx.fillStyle = "rgba(29, 26, 23, 0.05)";
        ctx.fillRect(0, 0, width, height);

        const active = resultKey;
        [[0, 0, "topLeft"], [cellWidth, 0, "topRight"], [0, cellHeight, "bottomLeft"], [cellWidth, cellHeight, "bottomRight"]].forEach(([cellX, cellY, key]) => {
            ctx.fillStyle = markers[key].fill;
            ctx.fillRect(cellX + 8, cellY + 8, cellWidth - 16, cellHeight - 16);
            if (key === active) {
                ctx.strokeStyle = "rgba(29, 26, 23, 0.95)";
                ctx.lineWidth = 6;
                ctx.strokeRect(cellX + 10, cellY + 10, cellWidth - 20, cellHeight - 20);
            }
            ctx.fillStyle = "rgba(29, 26, 23, 0.85)";
            ctx.font = "700 24px Trebuchet MS, sans-serif";
            ctx.fillText(markers[key].label, cellX + 24, cellY + 22);
        });

        ctx.fillStyle = "rgba(29, 26, 23, 0.66)";
        ctx.font = "700 20px Trebuchet MS, sans-serif";
        ctx.fillText("Cozy", 12, height / 2 - 12);
        ctx.fillText("Wild", width - 76, height / 2 - 12);
        ctx.save();
        ctx.translate(width / 2 - 44, 24);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("Crunchy", 0, 0);
        ctx.restore();
        ctx.save();
        ctx.translate(width / 2 + 8, height - 28);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("Saucy", 0, 0);
        ctx.restore();

        const markerX = clamp(50 + (score.x / MAX_ROUNDS) * 34, 10, 90) / 100;
        const markerY = clamp(50 - (score.y / MAX_ROUNDS) * 34, 10, 90) / 100;
        ctx.beginPath();
        ctx.arc(markerX * width, markerY * height, 18, 0, Math.PI * 2);
        ctx.fillStyle = "#1d1a17";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(markerX * width, markerY * height, 36, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(29, 26, 23, 0.2)";
        ctx.lineWidth = 10;
        ctx.stroke();

        ctx.restore();
    }

    async function downloadImage() {
        const blob = await buildResultCanvas();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "what-dino-nugget-am-i.png";
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        setStatus("Image downloaded.");
    }

    async function shareImage() {
        const blob = await buildResultCanvas();
        const file = new File([blob], "what-dino-nugget-am-i.png", { type: "image/png" });
        const canShareFiles = typeof navigator.canShare === "function" && navigator.canShare({ files: [file] });

        if (navigator.share && canShareFiles) {
            await navigator.share({
                title: "What Dino Nugget Am I?",
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

    els.poolCount.textContent = String(questionBank.length);
    updateButtonVisibility();
    setGameMeta();

    const savedState = readState();
    if (savedState && Array.isArray(savedState.questions) && savedState.questions.length) {
        state.questions = savedState.questions;
        state.currentIndex = typeof savedState.currentIndex === "number" ? savedState.currentIndex : 0;
        state.score = savedState.score || { x: 0, y: 0 };
        state.answers = Array.isArray(savedState.answers) ? savedState.answers : [];
        state.completed = Boolean(savedState.completed);

        if (state.completed || state.currentIndex >= MAX_ROUNDS) {
            renderResult();
        } else {
            renderQuestion();
        }
    } else {
        els.questionCategory.textContent = "Ready when you are";
        els.questionText.textContent = "Start the round to get your first question.";
        setStatus("Five questions. Zero repeats. One result.");
    }
})();