document.addEventListener("DOMContentLoaded", () => {
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
        { category: "Study sprint", prompt: "What is your strategy for a last-minute study sprint?" },
        { category: "Campus detour", prompt: "You have ten minutes between lectures. What do you do?" },
        { category: "Weather pivot", prompt: "Rain starts right as you leave. What's your move?" },
        { category: "Shared playlist", prompt: "How do you behave on a shared playlist?" },
        { category: "Kitchen raid", prompt: "You open the kitchen cabinet. What are you looking for?" },
        { category: "Deadline mood", prompt: "What is your energy when a deadline gets real?" },
        { category: "Weekend plan", prompt: "How do you plan a weekend with zero pressure?" },
        { category: "Text reply", prompt: "What does your ideal text reply style look like?" },
        { category: "Bus seat", prompt: "Pick your ideal seat on a bus or train." },
        { category: "Unexpected invite", prompt: "You get an unexpected invite. What happens next?" },
        { category: "Coffee shop entry", prompt: "You enter a café. What happens first?" },
        { category: "Lost item", prompt: "You lose something important. What's your first move?" },
        { category: "Elevator silence", prompt: "You're stuck in an elevator with strangers. What do you do?" },
        { category: "Pizza decision", prompt: "A pizza arrives. How do you approach it?" },
        { category: "Library presence", prompt: "What's your natural state in a library?" },
        { category: "Group arrival", prompt: "You arrive late to a group hangout. What happens?" },
        { category: "Phone buzz", prompt: "Your phone lights up with messages. Your reaction?" },
        { category: "Unexpected rain", prompt: "Rain starts suddenly. What do you do?" },
        { category: "Supermarket walk", prompt: "You're in a supermarket with no list. What's your strategy?" },
        { category: "Door confusion", prompt: "You open a door and hesitate. Why?" },
        { category: "Snack decision", prompt: "You open the kitchen. How do you choose a snack?" },
        { category: "Waiting moment", prompt: "You're waiting for someone who's late. What do you do?" },
        { category: "Bus ride", prompt: "You get on a bus. Where do you sit and why?" },
        { category: "Unexpected compliment", prompt: "Someone compliments you unexpectedly. Your reaction?" },
        { category: "Group photo", prompt: "A group photo is being taken. What is your role?" },
        { category: "Morning start", prompt: "How does your morning usually begin?" },
        { category: "Midnight hunger", prompt: "You get hungry at midnight. What happens?" },
        { category: "Wrong turn", prompt: "You realize you took the wrong direction. What now?" },
        { category: "Social silence", prompt: "A conversation suddenly goes quiet. You..." },
        { category: "Chair selection", prompt: "You enter a room with multiple chairs. Which do you pick?" },
        { category: "Unexpected invite", prompt: "Someone invites you somewhere last minute. You..." },
        { category: "Shared table", prompt: "You sit at a shared table alone. What happens?" },
        { category: "Queue energy", prompt: "You're in a long queue. How do you behave?" },
        { category: "Music choice", prompt: "You're in control of music. What's your approach?" },
        { category: "Quick decision", prompt: "You must decide something instantly. What do you do?" },
        { category: "Group chat entry", prompt: "You join an active group chat. What do you do first?" },
        { category: "Rain interruption", prompt: "It starts raining right as you leave. What's your response?" },
        { category: "Supermarket drift", prompt: "You're wandering a supermarket with no goal. What happens?" },
        { category: "Silent room", prompt: "You walk into a room and everyone is quiet. You..." },
        { category: "Chair claim", prompt: "You enter a room with multiple seats. How do you choose?" },
        { category: "Unexpected task", prompt: "Someone drops a task on you last minute. You..." },
        { category: "Playlist control", prompt: "You're in charge of music for a group. What do you do?" },
        { category: "Waiting friend", prompt: "A friend is late. How do you handle the wait?" },
        { category: "Kitchen raid", prompt: "You open a random kitchen cabinet. What's your behavior?" },
        { category: "Bus seat choice", prompt: "You step onto a bus or train. Where do you go?" },
        { category: "Unexpected silence", prompt: "A conversation suddenly pauses. You..." },
        { category: "Group decision", prompt: "A group can't decide. What role do you take?" },
        { category: "Quick invite", prompt: "You get invited somewhere last minute. Your reaction?" },
        { category: "Desk clutter", prompt: "Your workspace is messy. What do you do?" },
        { category: "Phone overload", prompt: "Your phone is blowing up. You..." },
        { category: "Late morning", prompt: "You wake up later than planned. What happens?" },
        { category: "Shared snack", prompt: "Someone offers you food. What's your reaction?" },
        { category: "Random hallway moment", prompt: "You're walking down a hallway. What's your vibe?" },
        { category: "Unexpected compliment", prompt: "Someone compliments you out of nowhere. You..." },
        { category: "Plan change", prompt: "Plans suddenly change. What's your response?" },
        { category: "Social circle shift", prompt: "You arrive and the group is already split. You..." },
        { category: "Waiting room energy", prompt: "You're stuck waiting somewhere. What do you do?" },
        { category: "Grocery checkout", prompt: "You're at checkout and there's a delay. You..." },
        { category: "Spontaneous idea", prompt: "A random idea hits you mid-day. What next?" },
        { category: "Evening wind-down", prompt: "How do you usually end your day?" },
        { category: "Airport wait", prompt: "You're at the airport early. What do you do?" },
        { category: "Couch state", prompt: "You sit down on a couch with no plans. What happens?" },
        { category: "Festival flow", prompt: "You're at a festival. What's your role?" },
        { category: "IKEA journey", prompt: "You enter IKEA with no list. What's your strategy?" },
        { category: "2AM energy", prompt: "It's 2AM and you're awake. What are you doing?" },
        { category: "Birthday party entry", prompt: "You walk into a birthday party. What happens first?" },
        { category: "Unexpected delay", prompt: "Your plans get delayed by hours. You..." },
        { category: "Social overload", prompt: "You're in a crowded social space. What's your instinct?" },
        { category: "Food court choice", prompt: "You're in a food court. How do you decide?" },
        { category: "Random weekend", prompt: "You wake up with no plans. What now?" },
        { category: "Train ride long", prompt: "You have a long train ride ahead. What do you do?" },
        { category: "Shopping decision fatigue", prompt: "Too many options. What's your move?" },
        { category: "Unexpected downtime", prompt: "You suddenly have 3 free hours. You..." },
        { category: "Shared space behavior", prompt: "You're in a shared public space. What's your vibe?" },
        { category: "Sudden idea burst", prompt: "You get a strong idea out of nowhere. You..." },
        { category: "Crowded checkout", prompt: "The checkout line is chaotic. You..." },
        { category: "Friend cancels", prompt: "A friend cancels plans last minute. You..." },
        { category: "Overstimulated moment", prompt: "Everything feels too loud. You..." },
        { category: "Unexpected success", prompt: "Something works better than expected. You..." },
        { category: "Waiting for reply", prompt: "Someone leaves you on read. You..." },
        { category: "Night walk", prompt: "You go for a walk at night. What happens?" },
        { category: "Hotel room arrival", prompt: "You enter a hotel room. What's your first action?" },
        { category: "Shared decision fatigue", prompt: "No one can decide. You..." },
        { category: "Last snack dilemma", prompt: "There is one snack left. What do you do?" },
        { category: "Exit situation", prompt: "You're ready to leave somewhere. How do you exit?" },
        { category: "Birthday arrival", prompt: "You arrive at a birthday party. What do you do first?" },
        { category: "Hotel reset", prompt: "You enter a hotel room. What's your first move?" },
        { category: "Night walk drift", prompt: "You're out on a night walk. What's your vibe?" },
        { category: "Overstimulated moment", prompt: "Everything feels too loud and busy. You..." },
        { category: "Decision fatigue", prompt: "Too many choices. You start to..." },
        { category: "Exit moment", prompt: "You're ready to leave a place. How do you exit?" },
        { category: "Unexpected toast", prompt: "Someone suddenly proposes a toast. You..." },
        { category: "Shared playlist chaos", prompt: "A shared playlist is getting weird. You..." },
        { category: "Elevator stop", prompt: "The elevator briefly stops between floors. You..." },
        { category: "Rainy arrival", prompt: "You arrive somewhere completely soaked. You..." },
        { category: "Lost in conversation", prompt: "You lose track of a conversation topic. You..." },
        { category: "Sudden free hour", prompt: "You unexpectedly get one free hour. You..." },
        { category: "Restaurant delay", prompt: "Your food takes too long to arrive. You..." },
        { category: "Unexpected reunion", prompt: "You bump into someone unexpectedly. You..." },
        { category: "Public transport chaos", prompt: "Your bus/train is crowded and noisy. You..." },
        { category: "Social misalignment", prompt: "The group vibe doesn't match you. You..." },
        { category: "Sudden inspiration", prompt: "An idea hits you mid-routine. You..." },
        { category: "Room rearrangement urge", prompt: "You suddenly feel like changing your room setup. You..." },
        { category: "Queue interruption", prompt: "The queue suddenly pauses for a long time. You..." },
        { category: "Unexpected silence with friend", prompt: "You and a friend go quiet at the same time. You..." },
        { category: "Spontaneous detour", prompt: "You're on your way somewhere and detour. You..." },
        { category: "Night snack decision", prompt: "You want a snack late at night. You..." },
        { category: "Lost object panic", prompt: "You can't find something important. You..." },
        { category: "Social battery low", prompt: "Your social energy drops mid-event. You..." },
        { category: "Leaving impression", prompt: "You want to leave a place. You make sure to..." },
        { category: "Kitchen raid", prompt: "You open a kitchen cabinet with no plan. What happens?" },
        { category: "Bus seat strategy", prompt: "You enter a bus with many seats available. You..." },
        { category: "Group silence", prompt: "A group conversation suddenly goes quiet. You..." },
        { category: "Idea burst", prompt: "A random idea hits you out of nowhere. You..." },
        { category: "Social battery drop", prompt: "Your social energy suddenly dips. You..." },
        { category: "Random encounter", prompt: "You bump into someone unexpectedly. You..." },
        { category: "Shared table alone", prompt: "You sit at a shared table alone. You..." },
        { category: "Phone overload", prompt: "Your phone is constantly buzzing. You..." },
        { category: "Spontaneous plan", prompt: "A plan forms in your mind instantly. You..." },
        { category: "Queue pause", prompt: "The line you're in suddenly stops moving. You..." },
        { category: "Public transport seat", prompt: "You choose your seat on public transport based on..." },
        { category: "Unexpected invitation", prompt: "You get invited somewhere last minute. You..." },
        { category: "Midday reset", prompt: "You suddenly have time in the middle of the day. You..." },
        { category: "Social mismatch", prompt: "The group energy doesn't match yours. You..." },
        { category: "Overthinking spiral", prompt: "You start overthinking something small. You..." },
        { category: "Exit timing", prompt: "You decide it's time to leave. You..." },
        { category: "Conversation pause", prompt: "A conversation stalls awkwardly. You..." },
        { category: "Unexpected task drop", prompt: "Someone gives you a task out of nowhere. You..." },
        { category: "Mood shift", prompt: "Your mood suddenly changes mid-situation. You..." },
        { category: "Waiting for reply", prompt: "Someone leaves you on read. You..." },
        { category: "Group indecision", prompt: "No one in the group can decide what to do. You..." },
        { category: "Unexpected compliment", prompt: "Someone compliments you unexpectedly. You..." },
        { category: "Sudden quiet moment", prompt: "Everything suddenly goes quiet. You..." },
        { category: "Lost focus", prompt: "You lose focus mid-task. You..." },
        { category: "End of day", prompt: "The day is ending and you reflect. You..." },
        { category: "Phone battery", prompt: "Your phone is at 1%. What is the move?" },
        { category: "We need to talk", prompt: "Someone says 'we need to talk.' You..." },
        { category: "Front camera", prompt: "You accidentally open the front camera. You..." },
        { category: "Delivery limbo", prompt: "Your food delivery says 'arriving now' for 12 minutes. You..." },
        { category: "Notification ghost", prompt: "You hear a random notification sound but it's not your phone. You..." },
        { category: "TikTok nearby", prompt: "Someone starts filming a TikTok nearby. You..." },
        { category: "Spontaneous plan", prompt: "Your group says 'let's be spontaneous.' You..." },
        { category: "Message typo", prompt: "You see a typo after sending the message. You..." },
        { category: "Shuffle betrayal", prompt: "Your playlist shuffle exposes your weirdest song. You..." },
        { category: "Quick question", prompt: "Someone says 'quick question' and it is not quick. You..." },
        { category: "Screenshot panic", prompt: "You accidentally screenshot something suspicious. You..." },
        { category: "Voice note", prompt: "Someone sends a 4-minute voice note. You..." },
        { category: "Outfit crisis", prompt: "You are already late and the outfit is not giving. You..." },
        { category: "Group order", prompt: "The group food order is becoming complicated. You..." },
        { category: "Read receipt", prompt: "You open a message and the read receipt is on. You..." },
        { category: "WiFi hunt", prompt: "You enter a place with bad signal. You..." },
        { category: "Photo dump", prompt: "You are choosing photos for a dump. You..." },
        { category: "Low social battery", prompt: "You arrive and immediately realize your social battery is fake. You..." },
        { category: "Online meeting", prompt: "Your camera turns on in an online meeting. You..." },
        { category: "Packing chaos", prompt: "You have to pack for a trip in 20 minutes. You..." },
        { category: "Checkout total", prompt: "The checkout total is higher than expected. You..." },
        { category: "Aux pressure", prompt: "Someone gives you the aux with no warning. You..." },
    ];
    function scoreFor(primary, secondary) {
        const score = { trex: 0, triceratops: 0, stegosaurus: 0, parasaurolophus: 0, pterodactylus: 0 };
        score[primary] = 3;
        if (secondary && secondary !== primary) {
            score[secondary] = 1;
        }
        return score;
    }

    const responseStyles = [
        {
            label: "I hit send with main-character confidence.",
            hint: "Bold, fast, and a little feral.",
            score: scoreFor("trex", "pterodactylus"),
        },
        {
            label: "I choose the safe option and somehow make it iconic.",
            hint: "Secure, grounded, and very solid.",
            score: scoreFor("triceratops", "stegosaurus"),
        },
        {
            label: "I keep it low-drama and highly functional.",
            hint: "Chill, efficient, and unbothered.",
            score: scoreFor("stegosaurus", "triceratops"),
        },
        {
            label: "I make the group chat less cursed.",
            hint: "Warm, social, and carrying the vibe.",
            score: scoreFor("parasaurolophus", "triceratops"),
        },
        {
            label: "I lurk, clock the situation, then move like I planned it.",
            hint: "Observant, strategic, and slightly too aware.",
            score: scoreFor("pterodactylus", "stegosaurus"),
        },
    ];

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
    ];

    // Direct prompt-to-options mapping. Every question prompt is keyed here with its answer options.
    // Feel free to edit options directly: change labels/hints as needed, modify dino score assignments.
    const QUESTION_OPTIONS = {
        "You accidentally screenshot something suspicious. You...": [
            { label: "Freeze like the phone just committed a crime.", hint: "Panic in 4K.", score: scoreFor("trex", "pterodactylus") },
            { label: "Delete it immediately and restore order.", hint: "Clean recovery.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Send it to one trusted person for emotional support.", hint: "Crisis sharing.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Check every app to make sure nobody was notified.", hint: "Digital forensics.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Accept that the universe saw nothing.", hint: "Calm denial.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "Someone sends a 4-minute voice note. You...": [
            { label: "Play it instantly at full volume like a menace.", hint: "No fear, no headphones.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Wait until I can listen properly.", hint: "Respectful processing.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Reply with an equally dramatic voice note.", hint: "Audio friendship.", score: scoreFor("parasaurolophus", "trex") },
            { label: "Scrub through and decode the emotional arc.", hint: "Narrative analysis.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Need a transcript before I can become involved.", hint: "Low-input preference.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "You are already late and the outfit is not giving. You...": [
            { label: "Change everything and make the lateness worth it.", hint: "Fashion emergency.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Pick the reliable fit and leave on schedule-ish.", hint: "Damage control.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Ask the group chat for validation immediately.", hint: "Community styling.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Identify the one piece ruining the whole system.", hint: "Fit diagnostics.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Wear the comfortable option and protect my peace.", hint: "Soft survival.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "The group food order is becoming complicated. You...": [
            { label: "Pick something and force momentum.", hint: "Decision violence.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Make a list, collect orders, confirm totals.", hint: "Spreadsheet soul.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Check what everyone wants and keep the peace.", hint: "Group harmony.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Optimize for delivery time, price, and cravings.", hint: "Menu strategist.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Order the safe classic and avoid the chaos.", hint: "Reliable bite.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "You open a message and the read receipt is on. You...": [
            { label: "Reply immediately with suspicious speed.", hint: "Caught in real time.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Answer clearly because the situation is now active.", hint: "Responsible messaging.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Send a reaction first to buy emotional time.", hint: "Soft buffer.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Calculate the least weird response window.", hint: "Timing analytics.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Accept my fate and reply when I have capacity.", hint: "Boundary era.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "You enter a place with bad signal. You...": [
            { label: "Hold the phone up like I am summoning a satellite.", hint: "Desperate ritual.", score: scoreFor("trex", "pterodactylus") },
            { label: "Find the WiFi password before settling in.", hint: "Prepared connection.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Ask someone nearby because this is a shared crisis.", hint: "Social troubleshooting.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Map the room for the strongest signal pocket.", hint: "Network hunter.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Go offline and become mysterious.", hint: "Accidental peace.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "You are choosing photos for a dump. You...": [
            { label: "Post the chaotic ones because lore matters.", hint: "Unfiltered archive.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Choose a clean balanced set with no duplicates.", hint: "Curated order.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Pick the ones where everyone looks good.", hint: "Friendship-first posting.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Arrange the sequence for maximum narrative impact.", hint: "Visual storytelling.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Post three quiet bangers and disappear.", hint: "Minimal flex.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "You arrive and immediately realize your social battery is fake. You...": [
            { label: "Commit to the bit and become louder somehow.", hint: "Emergency performance.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Find a stable spot and pace myself.", hint: "Energy management.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Attach to one safe person and orbit gently.", hint: "Social anchoring.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Observe the room until I know where to spend energy.", hint: "Strategic quiet.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Plan a graceful early exit immediately.", hint: "Peace logistics.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "Your camera turns on in an online meeting. You...": [
            { label: "Make accidental eye contact with the entire internet.", hint: "Digital jump scare.", score: scoreFor("trex", "pterodactylus") },
            { label: "Compose myself and continue professionally.", hint: "Meeting recovery.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Smile like this was totally intentional.", hint: "Social smoothing.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Check lighting, background, and facial expression instantly.", hint: "Video diagnostics.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Turn it off calmly and pretend I was never perceived.", hint: "Soft disappearance.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "You have to pack for a trip in 20 minutes. You...": [
            { label: "Throw clothes in a bag and trust the plot.", hint: "Airport-speed chaos.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Pack essentials first using a mental checklist.", hint: "Survival structure.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Ask what everyone else is bringing.", hint: "Group coordination.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Optimize outfits by weather, plans, and bag space.", hint: "Travel calculus.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Pack light and accept repeating outfits.", hint: "Efficiency traveler.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "The checkout total is higher than expected. You...": [
            { label: "Tap the card and emotionally leave my body.", hint: "Financial jump scare.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Check the receipt like a responsible adult.", hint: "Budget awareness.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Make eye contact with someone so they feel the pain too.", hint: "Shared suffering.", score: scoreFor("parasaurolophus", "trex") },
            { label: "Immediately identify which item betrayed me.", hint: "Cost analysis.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Accept it and quietly revise future plans.", hint: "Silent recalibration.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "Someone gives you the aux with no warning. You...": [
            { label: "Play the first song that feels legally dangerous.", hint: "High-risk DJ.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Choose a safe crowd-pleaser.", hint: "Responsible aux.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Ask the room what vibe we want.", hint: "Democratic playlisting.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Read the room and build a perfect transition.", hint: "Sonic strategy.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Play something low-key and unskippable.", hint: "Quiet control.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "Your phone is at 1%. What is the move?": [
            { label: "I keep using it like destiny will intervene.", hint: "Delusional confidence.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I already brought a charger and backup battery.", hint: "Prepared behavior.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I ask the group who has a charger like it's a community project.", hint: "Social survival.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I lower brightness, close apps, and enter tactical mode.", hint: "Battery strategist.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I accept offline life and become peaceful.", hint: "Low-power monk mode.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "Someone says 'we need to talk.' You...": [
            { label: "Reply 'about what' instantly and stare at the ceiling.", hint: "Immediate panic sprint.", score: scoreFor("trex", "pterodactylus") },
            { label: "Ask for context and schedule a normal human conversation.", hint: "Emotionally ergonomic.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Send three soft question marks and hope the vibe recovers.", hint: "Social damage control.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Replay every interaction from the past 72 hours.", hint: "Forensic overthinking.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Mute the phone for five minutes and breathe.", hint: "Regulation era.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "You accidentally open the front camera. You...": [
            { label: "Make direct eye contact with my own downfall.", hint: "Jump scare accepted.", score: scoreFor("trex", "pterodactylus") },
            { label: "Close it calmly and pretend nothing happened.", hint: "Composed recovery.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Show someone nearby because suffering should be shared.", hint: "Group trauma bonding.", score: scoreFor("parasaurolophus", "trex") },
            { label: "Immediately analyze the lighting angle.", hint: "Visual systems check.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Accept the humbling and move on quietly.", hint: "Character development.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "Your food delivery says 'arriving now' for 12 minutes. You...": [
            { label: "Stand by the door like a Victorian widow.", hint: "Dramatic hunger.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Check the map calmly and prepare the table.", hint: "Structured waiting.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Announce updates to everyone like breaking news.", hint: "Snack journalism.", score: scoreFor("parasaurolophus", "trex") },
            { label: "Track the driver route with suspicious precision.", hint: "Logistics analyst.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Mentally detach until the doorbell saves me.", hint: "Hunger meditation.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "You hear a random notification sound but it's not your phone. You...": [
            { label: "Still check mine because hope is a disease.", hint: "Reflex behavior.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Ignore it because my phone is organized.", hint: "Notification discipline.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Look around to see whose life just changed.", hint: "Social curiosity.", score: scoreFor("parasaurolophus", "pterodactylus") },
            { label: "Identify the app sound instantly.", hint: "Audio pattern recognition.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Feel grateful it is not my problem.", hint: "Peace preserved.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "Someone starts filming a TikTok nearby. You...": [
            { label: "Accidentally walk through the background like a side quest NPC.", hint: "Chaotic cameo.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Move out of frame respectfully.", hint: "Public-space etiquette.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Hype them up if the energy is right.", hint: "Vibe support.", score: scoreFor("parasaurolophus", "trex") },
            { label: "Clock the choreography and camera angle immediately.", hint: "Production analysis.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Find a quieter zone and continue my arc.", hint: "Low-drama exit.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "Your group says 'let's be spontaneous.' You...": [
            { label: "Say yes before knowing the destination.", hint: "Plot-first lifestyle.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Ask what spontaneous means in actual logistics.", hint: "Chaos with guardrails.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Turn it into a group adventure instantly.", hint: "Social momentum.", score: scoreFor("parasaurolophus", "trex") },
            { label: "Suggest the option with the best risk-reward ratio.", hint: "Calculated whimsy.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Agree only if snacks and exits are available.", hint: "Comfort terms.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "You see a typo after sending the message. You...": [
            { label: "Send a correction so fast it looks worse.", hint: "Panic patch.", score: scoreFor("trex", "pterodactylus") },
            { label: "Fix it with one clean follow-up.", hint: "Order restored.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Make a joke so nobody notices I care.", hint: "Social recovery.", score: scoreFor("parasaurolophus", "trex") },
            { label: "Assess whether the typo changes the entire meaning.", hint: "Semantic audit.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Leave it. The message has chosen its form.", hint: "Acceptance era.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "Your playlist shuffle exposes your weirdest song. You...": [
            { label: "Turn it up. Cowards skip.", hint: "Unapologetic energy.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Skip calmly and protect the room.", hint: "Responsible DJ.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Explain the lore behind the song immediately.", hint: "Context provider.", score: scoreFor("parasaurolophus", "pterodactylus") },
            { label: "Analyze why shuffle betrayed me at this exact moment.", hint: "Pattern suspicion.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Let it play quietly and observe who notices.", hint: "Soft chaos.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "Someone says 'quick question' and it is not quick. You...": [
            { label: "Commit anyway and lose the next 40 minutes.", hint: "Heroic mistake.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Ask what they need and define the scope.", hint: "Boundary wizardry.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Help while emotionally narrating the situation.", hint: "Supportive chaos.", score: scoreFor("parasaurolophus", "trex") },
            { label: "Identify the real question under the question.", hint: "Problem detective.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Give the shortest useful answer and vanish.", hint: "Efficient assistance.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "Someone hands you a sticker sheet. What happens?": [
            { label: "I use the loudest sticker immediately.", hint: "Instant expressive choice.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I save them carefully for the perfect place.", hint: "Controlled and intentional.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I hand them around and let everyone pick one.", hint: "Shared little joy.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I inspect every design before committing.", hint: "Pattern-first selection.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I choose one useful sticker and keep the rest neat.", hint: "Minimal but satisfying.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "Pick the chair you claim immediately.": [
            { label: "The bold central seat with maximum presence.", hint: "Own the room.", score: scoreFor("trex", "parasaurolophus") },
            { label: "The stable seat with good back support.", hint: "Comfort and reliability.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "The seat near people I want to talk to.", hint: "Social positioning.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "The seat with the best view of everything.", hint: "Strategic overview.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "The quiet edge seat with an easy exit.", hint: "Low-friction comfort.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "A friend asks for your help moving a couch. You...": [
            { label: "Grab one end and start moving before anyone overthinks.", hint: "Immediate muscle energy.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Measure the route and protect the walls.", hint: "Practical and careful.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Coordinate the group so nobody gets crushed.", hint: "People-aware logistics.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Rotate it mentally before touching it.", hint: "Spatial problem solving.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Find the cleanest path and make it efficient.", hint: "Minimum wasted effort.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "What's your natural state in a library?": [
            { label: "Trying to be quiet but still somehow intense.", hint: "Contained energy.", score: scoreFor("trex", "pterodactylus") },
            { label: "Settled with notes, charger, and a clear plan.", hint: "Study structure.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Whispering just enough to keep people alive.", hint: "Soft social presence.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Finding the best corner and tracking the whole room.", hint: "Quiet observation.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Calm, focused, and hard to interrupt.", hint: "Deep low-noise mode.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "How does your morning usually begin?": [
            { label: "I launch out of bed and improvise the rest.", hint: "Fast-start energy.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I follow the routine that keeps the day stable.", hint: "Grounded start.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I check in with people or messages first.", hint: "Connection before motion.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I lie there mapping the day before moving.", hint: "Mental overview.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I start slowly and conserve energy.", hint: "Efficient wake-up.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "Your phone is blowing up. You...": [
            { label: "Answer the loudest thread immediately.", hint: "Direct response.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Sort messages by urgency and handle them in order.", hint: "Controlled triage.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Send quick reactions so people know I'm alive.", hint: "Social maintenance.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Scan the pattern before deciding who needs me.", hint: "High-awareness filtering.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Mute what I can and answer only what matters.", hint: "Input management.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "You wake up later than planned. What happens?": [
            { label: "I move fast and turn panic into momentum.", hint: "Recovery sprint.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I rebuild the schedule from the first fixed point.", hint: "Re-stabilizing.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I message whoever needs context and smooth it over.", hint: "Social repair.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I calculate what can be skipped without damage.", hint: "Strategic adjustment.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I simplify the day and protect my energy.", hint: "Efficient reset.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "Something works better than expected. You...": [
            { label: "Celebrate loudly and push it even further.", hint: "Big win energy.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Lock in what worked so it stays reliable.", hint: "Stability from success.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Share the win with everyone involved.", hint: "Collective momentum.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Analyze why it worked so well.", hint: "Pattern extraction.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Quietly optimize it into a repeatable system.", hint: "Useful improvement.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "You lose track of a conversation topic. You...": [
            { label: "Jump back in with confidence and hope it lands.", hint: "Bold recovery.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Ask for the missing piece directly.", hint: "Clear and steady.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Use warmth to reconnect with the thread.", hint: "Social repair.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Reconstruct the topic from clues.", hint: "Context analysis.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Listen quietly until the thread becomes clear again.", hint: "Low-energy recovery.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "Your bus/train is crowded and noisy. You...": [
            { label: "Push through and claim a spot.", hint: "Direct survival mode.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Find the safest stable place to stand or sit.", hint: "Grounded awareness.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Stay polite and read the people around me.", hint: "Social navigation.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Map exits, movement, and quiet pockets.", hint: "Spatial strategy.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Reduce input and conserve energy until my stop.", hint: "Overload management.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "You suddenly feel like changing your room setup. You...": [
            { label: "Start moving furniture immediately.", hint: "Impulse redesign.", score: scoreFor("trex", "pterodactylus") },
            { label: "Plan the layout before anything moves.", hint: "Controlled change.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Ask someone what would make the room feel better.", hint: "Shared comfort.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Visualize five layouts before choosing one.", hint: "Spatial modeling.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Make one efficient change that improves everything.", hint: "Minimal high-impact fix.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "You start overthinking something small. You...": [
            { label: "Do something decisive before the loop grows.", hint: "Action interrupts spiral.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Write down what is actually true.", hint: "Stability through facts.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Talk it through with someone safe.", hint: "Social grounding.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Zoom out and identify the pattern.", hint: "Meta-awareness.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Reduce input and let the thought pass.", hint: "Quiet regulation.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "When you feel your energy dip": [
            { label: "I push through anyway.", hint: "High drive behavior.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I pause and recover structure.", hint: "Restorative discipline.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I shift toward calmer social interactions.", hint: "Energy balancing.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I detach and observe instead of engaging.", hint: "Cognitive distancing.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I minimize output and conserve energy.", hint: "Efficiency mode.", score: scoreFor("stegosaurus", "parasaurolophus") }
        ],
        "How do you approach a problem that requires creativity?": [
            { label: "I act on it immediately.", hint: "Execution first.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I write it down and structure it.", hint: "System capture.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I share it with someone instantly.", hint: "Social processing.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I expand it mentally before doing anything.", hint: "Conceptual depth.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I store it for later optimization.", hint: "Efficient delay.", score: scoreFor("stegosaurus", "pterodactylus") }
        ],
        "How do you handle silence in a group setting?": [
            { label: "I break the silence instantly.", hint: "Momentum through action.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I wait and let structure return naturally.", hint: "Stability preference.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I gently restart the conversation.", hint: "Social facilitation.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I analyze why the silence happened.", hint: "Meta awareness.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I stay calm and let it resolve itself.", hint: "Energy efficiency.", score: scoreFor("stegosaurus", "parasaurolophus") }
        ],
        "How do you approach sitting in a Bus?": [
            { label: "I choose a seat quickly and move on.", hint: "Fast positioning.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I pick a structured, comfortable spot.", hint: "Stability first.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I sit near people I might interact with.", hint: "Social openness.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I evaluate the entire layout before sitting.", hint: "Spatial awareness.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I choose the most efficient exit-friendly seat.", hint: "Optimization mindset.", score: scoreFor("stegosaurus", "pterodactylus") }
        ],
        "When its on you to choose the first snack": [
            { label: "I grab something immediately without hesitation.", hint: "Impulse action.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I check everything properly before choosing.", hint: "Structured selection.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I think about what others might want too.", hint: "Social awareness.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I scan all options before committing.", hint: "Analytical choice.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I pick the most efficient option available.", hint: "Minimal friction.", score: scoreFor("stegosaurus", "pterodactylus") }
        ],
        "How do you handle leaving a group setting?": [
            { label: "I leave quickly once I'm ready.", hint: "Direct exit.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I follow a structured goodbye routine.", hint: "Orderly transition.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I say goodbye to people properly before leaving.", hint: "Social closure.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I time my exit strategically.", hint: "Situational awareness.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I leave with minimal disruption and noise.", hint: "Efficient departure.", score: scoreFor("stegosaurus", "pterodactylus") }
        ],
        "When you are highly overstimulated": [
            { label: "I push through and stay active anyway.", hint: "High resilience energy.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I reduce input and stabilize my environment.", hint: "Control restoration.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I move toward calmer people or spaces.", hint: "Social grounding.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I mentally detach and observe from distance.", hint: "Cognitive buffering.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I shut down unnecessary input and recover quietly.", hint: "Energy conservation.", score: scoreFor("stegosaurus", "parasaurolophus") }
        ],
        "When you are about to leave for a night-walk": [
            { label: "I walk with energy and change direction often.", hint: "Active momentum.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I stick to familiar routes and stay aware.", hint: "Stable grounding.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I enjoy the atmosphere and possible encounters.", hint: "Soft openness.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I think deeply and observe everything around me.", hint: "Wide perception.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I walk efficiently and return with minimal deviation.", hint: "Optimized movement.", score: scoreFor("stegosaurus", "pterodactylus") }
        ],
        "When you visit a Hotel you have never been to": [
            { label: "I explore every corner immediately.", hint: "Curiosity-driven action.", score: scoreFor("trex", "pterodactylus") },
            { label: "I unpack and organize everything right away.", hint: "Structure and control.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I make the space comfortable for everyone involved.", hint: "Soft social awareness.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I analyze the layout and optimize usage.", hint: "System thinking.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I immediately relax and reduce stimulation.", hint: "Efficiency in rest.", score: scoreFor("stegosaurus", "parasaurolophus") }
        ],
        "You just arrived at a Birthday party": [
            { label: "I immediately join the action and greet everyone.", hint: "Fast social ignition.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I find my place and settle into the structure of the room.", hint: "Grounded entry.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I connect with people one by one naturally.", hint: "Social flow.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I scan the room and map the social dynamics.", hint: "Observational awareness.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I observe first and engage when it feels right.", hint: "Energy efficiency.", score: scoreFor("stegosaurus", "pterodactylus") }
        ],
        "Your usual 2AM Mode": [
            { label: "I get random bursts of energy and start doing things.", hint: "Unstable momentum.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I try to stabilize and go back to routine.", hint: "Restoration instinct.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I message someone or connect quietly.", hint: "Soft connection.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I think deeply about everything at once.", hint: "Wide mental scope.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I minimize stimulation and try to reset.", hint: "System cooldown.", score: scoreFor("stegosaurus", "parasaurolophus") }
        ],
        "You go to IKEA visiting routine": [
            { label: "I roam freely and discover things as I go.", hint: "Explorative instinct.", score: scoreFor("trex", "pterodactylus") },
            { label: "I follow the path and stick to structure.", hint: "System compliance.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I turn it into a shared experience.", hint: "Social journey.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I analyze layouts and optimize the route.", hint: "Spatial strategy.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I avoid unnecessary decisions and streamline everything.", hint: "Efficiency mindset.", score: scoreFor("stegosaurus", "parasaurolophus") }
        ],
        "You're at a festival. What's your role?": [
            { label: "I jump straight into the action.", hint: "High energy immersion.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I keep track of logistics and safety.", hint: "Grounded stability.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I stick with people and enhance the group vibe.", hint: "Social glue.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I move strategically between stages and moments.", hint: "Big-picture navigation.", score: scoreFor("pterodactylus", "trex") },
            { label: "I find calm zones and manage energy carefully.", hint: "Energy optimization.", score: scoreFor("stegosaurus", "parasaurolophus") }
        ],
        "Your Couch Mode": [
            { label: "I start doing things immediately from the couch.", hint: "Action doesn't wait.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I settle in properly and organize comfort.", hint: "Structured relaxation.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I end up talking or co-existing with others nearby.", hint: "Social warmth.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I drift into observation or planning.", hint: "Reflective thinking.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I fully optimize comfort and stay there.", hint: "Efficient stillness.", score: scoreFor("stegosaurus", "parasaurolophus") }
        ],
        "On an Airport you": [
            { label: "I explore every corner and stay active.", hint: "Restless momentum.", score: scoreFor("trex", "pterodactylus") },
            { label: "I find a gate and settle into a structured wait.", hint: "Controlled patience.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I observe people and stay socially aware.", hint: "Soft social mapping.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I scan the entire layout and optimize movement.", hint: "System overview.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I minimize stress and conserve energy.", hint: "Efficient calm.", score: scoreFor("stegosaurus", "parasaurolophus") }
        ],
        "When plans unexpectedly change": [
            { label: "I adapt instantly and move forward.", hint: "Momentum adaptation.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I check what changes and re-stabilize.", hint: "Structured response.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I make sure everyone is still aligned.", hint: "Group harmony.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I reassess the situation from above.", hint: "Big-picture recalibration.", score: scoreFor("pterodactylus", "trex") },
            { label: "I quietly rebuild the plan more efficiently.", hint: "System optimization.", score: scoreFor("stegosaurus", "pterodactylus") }
        ],
        "When you have to wait at least 5 minutes somewhere": [
            { label: "I find something else to do immediately.", hint: "Active restlessness.", score: scoreFor("trex", "pterodactylus") },
            { label: "I stay patient and structured.", hint: "Stable waiting.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I start a small conversation if possible.", hint: "Social filler.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I observe everything happening around me.", hint: "Environmental scanning.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I mentally detach and conserve energy.", hint: "Efficient patience.", score: scoreFor("stegosaurus", "parasaurolophus") }
        ],
        "In the supermarket": [
            { label: "I wander and grab whatever looks good.", hint: "Impulse exploration.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I stick to a mental or written plan.", hint: "Controlled structure.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I consider what others might want too.", hint: "Social awareness.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I compare options carefully before choosing.", hint: "Analytical selection.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I optimize route efficiency through the aisles.", hint: "System efficiency.", score: scoreFor("stegosaurus", "pterodactylus") }
        ],
        "when it rains": [
            { label: "I embrace it and keep moving anyway.", hint: "Unbothered momentum.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I immediately adjust plans and stay dry.", hint: "Risk control.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I slow down and enjoy the change of atmosphere.", hint: "Soft adaptation.", score: scoreFor("parasaurolophus", "stegosaurus") },
            { label: "I analyze the best route or shelter options.", hint: "Strategic thinking.", score: scoreFor("pterodactylus", "triceratops") },
            { label: "I optimize comfort and treat it as a pause.", hint: "Efficient rest.", score: scoreFor("stegosaurus", "parasaurolophus") }
        ],
        "You enter a new group chat": [
            { label: "I jump in immediately with energy or memes.", hint: "Fast social ignition.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I read everything first before responding.", hint: "Structured awareness.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I react to the vibe and ease into it.", hint: "Social harmony.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I observe patterns before I say anything.", hint: "Analytical entry.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I wait for the right moment to drop something useful.", hint: "Timing optimization.", score: scoreFor("stegosaurus", "pterodactylus") }
        ],
        "You are standing in a long queue": [
            { label: "I stay alert and find opportunities to move faster.", hint: "Restless energy.", score: scoreFor("trex", "pterodactylus") },
            { label: "I accept the wait and stay organized.", hint: "Structured patience.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I chat with nearby people if it feels right.", hint: "Social flow.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I observe patterns in how the queue moves.", hint: "System awareness.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I mentally detach and optimize comfort.", hint: "Calm endurance.", score: scoreFor("stegosaurus", "parasaurolophus") }
        ],
        "You have to choose a snack": [
            { label: "I grab the most exciting thing instantly.", hint: "Impulse-driven choice.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I pick the reliable classic snack.", hint: "Consistency wins.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I ask if anyone wants to share first.", hint: "Group-aware behavior.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I compare options before deciding carefully.", hint: "Deliberate selection.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I optimize for long-term satisfaction, not impulse.", hint: "Strategic choice.", score: scoreFor("stegosaurus", "pterodactylus") }
        ],
        "You are standing in an elevator": [
            { label: "I break the silence with energy or humor.", hint: "Social spark.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I respectfully stay quiet and stable.", hint: "Grounded presence.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I make small friendly interactions if needed.", hint: "Soft social control.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I observe everyone subtly without engaging.", hint: "Analytical awareness.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I focus on exit timing and efficiency.", hint: "Exit optimization.", score: scoreFor("stegosaurus", "pterodactylus") }
        ],
        "You lost something important to you somewhere on the way": [
            { label: "I immediately start searching in motion.", hint: "Action reduces uncertainty.", score: scoreFor("trex", "pterodactylus") },
            { label: "I retrace steps carefully and systematically.", hint: "Structure first.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I ask others and turn it into a shared problem.", hint: "Collaborative recovery.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I pause and map the situation mentally.", hint: "Big-picture thinking.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I assume it will reappear and optimize waiting.", hint: "Calm efficiency.", score: scoreFor("stegosaurus", "parasaurolophus") }
        ],
        "In a Cafe": [
            { label: "I scan the room and choose a strategic seat first.", hint: "Observation before action.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "I order fast and adapt as I go.", hint: "Momentum first.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I wait for everyone else to feel comfortable first.", hint: "Social grounding.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I pick the quiet corner and settle in immediately.", hint: "Calm control.", score: scoreFor("stegosaurus", "triceratops") },
            { label: "I notice everything but pretend I'm not analyzing it.", hint: "Hidden awareness.", score: scoreFor("pterodactylus", "trex") }
        ],
        "In complete Chaos": [
            { label: "I commit instantly and trust the plot.", hint: "Bold under pressure.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I anchor the situation and slow the room down.", hint: "Stability first.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I turn the mess into something oddly cozy.", hint: "Soft power.", score: scoreFor("parasaurolophus", "stegosaurus") },
            { label: "I step back, assess, and pick the smartest exit.", hint: "Wide-angle thinking.", score: scoreFor("pterodactylus", "trex") },
            { label: "I fix the system so the chaos cannot return.", hint: "Quietly decisive.", score: scoreFor("stegosaurus", "triceratops") }
        ],
        "On Campus": [
            { label: "I speed-walk like I am late to destiny.", hint: "Fast, direct, slightly chaotic.", score: scoreFor("trex", "pterodactylus") },
            { label: "I check the schedule and protect my energy.", hint: "Grounded and cautious.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "I find the friends-first route and make it easy.", hint: "Warm and practical.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "I take the scenic path and notice everything.", hint: "Observant and elevated.", score: scoreFor("pterodactylus", "parasaurolophus") },
            { label: "I create a tiny system so nothing derails.", hint: "Calm, organized, efficient.", score: scoreFor("stegosaurus", "triceratops") }
        ],
        "Your office mode": [
            { label: "Three tabs, one deadline, all gas.", hint: "Bold execution.", score: scoreFor("trex", "pterodactylus") },
            { label: "Color-coded tasks and clear owners.", hint: "Structure wins.", score: scoreFor("triceratops", "parasaurolophus") },
            { label: "A tidy notebook and surgical focus.", hint: "Calm precision.", score: scoreFor("stegosaurus", "pterodactylus") },
            { label: "Voice memo brainstorm and team sync.", hint: "Communicate, then accelerate.", score: scoreFor("parasaurolophus", "trex") },
            { label: "Prototype first, explain later.", hint: "High-altitude iteration.", score: scoreFor("pterodactylus", "stegosaurus") }
        ],
        "When you are traveling": [
            { label: "No map. Just appetite and speed.", hint: "Fearless detours.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Checklist, backup plan, charger, done.", hint: "Prepared and sturdy.", score: scoreFor("triceratops", "pterodactylus") },
            { label: "Scenic route and zero rush.", hint: "Comfort over chaos.", score: scoreFor("stegosaurus", "triceratops") },
            { label: "Playlist curator and vibes director.", hint: "Harmonize the whole crew.", score: scoreFor("parasaurolophus", "stegosaurus") },
            { label: "Window seat with full aerial strategy.", hint: "Top-down thinking.", score: scoreFor("pterodactylus", "trex") }
        ],
        "Your social mode": [
            { label: "I become the hype engine.", hint: "Loud, playful, magnetic.", score: scoreFor("trex", "parasaurolophus") },
            { label: "I make sure everyone gets home safe.", hint: "Steady and dependable.", score: scoreFor("triceratops", "parasaurolophus") },
            { label: "I host the side conversation that saves the night.", hint: "Warm and quietly iconic.", score: scoreFor("stegosaurus", "parasaurolophus") },
            { label: "I steer every idea into something fun.", hint: "Expressive and connective.", score: scoreFor("parasaurolophus", "trex") },
            { label: "I float between circles and map the room.", hint: "Strategic and quick.", score: scoreFor("pterodactylus", "triceratops") }
        ],
        "What does your ideal lunch mission look like?": [
            { label: "Sprint for the spicy deluxe and eat like a king.", hint: "Big bite, zero hesitation.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Pack the reliable sandwich and vibes stay steady.", hint: "Comfort over chaos.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Share a tray, start the group convo ASAP.", hint: "Social snack energy.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Pick the curated macro bowl like it's study fuel.", hint: "Strategic and efficient.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Salad but make it sneaky satisfying.", hint: "Low-key healthy flex.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "What is your approach to a mystery door?": [
            { label: "Kick the door, see what's up, no regrets.", hint: "Immediate action.", score: scoreFor("trex", "pterodactylus") },
            { label: "Cautiously peek and make a plan.", hint: "Calculated entry.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Call friends and bring vibes in together.", hint: "Group approach.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Observe patterns then glide through like a pro.", hint: "High perspective.", score: scoreFor("pterodactylus", "trex") },
            { label: "Stay calm, note exits, then choose quietly.", hint: "Practical caution.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "How do you usually behave in a group chat?": [
            { label: "Drop a chaotic funny and watch it explode.", hint: "Memes first.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Read, then send a thoughtful reply.", hint: "Measured presence.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Send the wholesome comment that everyone needs.", hint: "Warm glue.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Scout the convo flow before I drop anything.", hint: "Strategic timing.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "React and return later with something useful.", hint: "Low-key influence.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "What goes in your backpack?": [
            { label: "Protein bar and a plan — instant energy.", hint: "Fuel-first.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Organizer, charger, and a spare pen.", hint: "Reliable kit.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Something for pals — snacks or stickers.", hint: "Share-ready.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "A gadget or two to optimize any moment.", hint: "Utility flex.", score: scoreFor("pterodactylus", "trex") },
            { label: "A calming notebook and a pen for micro-systems.", hint: "Low-key order.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "What would your perfect soundtrack sound like?": [
            { label: "An adrenaline playlist that slaps — full send.", hint: "Big energy beats.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Something steady and warm, holds the room.", hint: "Comfort tempo.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Curated vibes that get people talking and dancing.", hint: "Social conductor.", score: scoreFor("parasaurolophus", "trex") },
            { label: "A thoughtful ambient set to map mood and moves.", hint: "High perspective curation.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Lo-fi efficiency beats — do the thing.", hint: "Calm focus.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "What is your approach to adding extra sauce to a dish?": [
            { label: "Yes, pile it on and make it iconic.", hint: "Bold flavor.", score: scoreFor("trex", "parasaurolophus") },
            { label: "A little measured drizzle keeps everything safe.", hint: "Balanced.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Share it around — sauce = social currency.", hint: "Generous move.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Analyze the match and add only the optimal note.", hint: "Strategic condiment.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Skip the drama, pick the consistent side.", hint: "Low-key reliable.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "What's your role on a road trip?": [
            { label: "Drive fast, snack loud, make detours for the story.", hint: "Adventure-first.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Planner with playlists and charging stops mapped.", hint: "Organized comfort.", score: scoreFor("triceratops", "pterodactylus") },
            { label: "I run the aux and keep the vibes cohesive.", hint: "Social DJ.", score: scoreFor("parasaurolophus", "trex") },
            { label: "Window seat, map in head, options scanned.", hint: "Aerial navigation.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Slow scenic stops and efficient naps on schedule.", hint: "Steady comfort.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "What does your workspace usually look like?": [
            { label: "Mini chaos but I get everything shipped.", hint: "Doer energy.", score: scoreFor("trex", "pterodactylus") },
            { label: "Organizer setup — folders, labels, explicit lanes.", hint: "Structure wins.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "A funny plant and something to spark convos.", hint: "Warm presence.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Tools that let me triage problems quickly.", hint: "System-first.", score: scoreFor("pterodactylus", "trex") },
            { label: "Calm, minimal setup that quietly performs.", hint: "Low-drama efficiency.", score: scoreFor("stegosaurus", "parasaurolophus") },
        ],
        "How do you react to a surprise challenge?": [
            { label: "Jump in and solve it with vibes, not fear.", hint: "Courageous launch.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Stabilize, set limits, and execute steadily.", hint: "Anchor approach.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Ask who else is in and make it collaborative.", hint: "Team-first.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Scan options, pick the best vector, then move.", hint: "Strategic pivot.", score: scoreFor("pterodactylus", "trex") },
            { label: "Quietly fix the system so it never surprises again.", hint: "Long-game solution.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "If you had to steal a snack, what's your strategy?": [
            { label: "Steal the boldest snack and flex about it.", hint: "Impulsive flex.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Take the dependable snack nobody misses.", hint: "Safe grab.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Grab one and offer to share like a hero.", hint: "Share move.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Compare choices and pick the mathematically best one.", hint: "Analytical steal.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Take something nutritious and quietly enjoy it.", hint: "Sensible snack.", score: scoreFor("stegosaurus", "pterodactylus") },
        ],
        "How do you usually enter a room full of people?": [
            { label: "Burst in with confidence and own it.", hint: "Main character entrance.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Enter steady, scan the room, take a spot.", hint: "Calm and reliable.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Wave, chat, and make the room warmer.", hint: "Social glue.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Slip in, observe, and choose the best angle.", hint: "Tactical presence.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Find a quiet corner and quietly do your thing.", hint: "Low-key efficient.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "What kind of Saturday weather matches your vibe?": [
            { label: "Sun and chaos — do everything, skip sleep.", hint: "Max energy day.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Mild and predictable, perfect for plans.", hint: "Solid routine.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Warm and social — meet people and snack.", hint: "Vibe first.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Cloudy with optimized itinerary and photos.", hint: "Curated calm.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Cool, slow, and restorative.", hint: "Recharge mode.", score: scoreFor("stegosaurus", "parasaurolophus") },
        ],
        "If you had a dinosaur sidekick, what would you do with it?": [
            { label: "Train it to be loud and dramatic on command.", hint: "Big energy duo.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Teach it manners and reliability.", hint: "Discipline and loyalty.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Let it meet everyone and be social.", hint: "Friendly onboarding.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Map its patterns and deploy it strategically.", hint: "Tactical sidekick.", score: scoreFor("pterodactylus", "trex") },
            { label: "Keep it calm and reliable for long-term wins.", hint: "Steady training.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "How do you react when plans suddenly change?": [
            { label: "Flip the plan fast and hype the pivot.", hint: "Bold adaptation.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Assess and re-anchor the team calmly.", hint: "Stability first.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Check with everyone and keep the vibe.", hint: "Harmonize the change.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Zoom out, pick the best axis, then execute.", hint: "Strategic recalibration.", score: scoreFor("pterodactylus", "trex") },
            { label: "Quietly rebuild the route so it runs smoother.", hint: "Systemic fix.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "What's your style when visiting a museum?": [
            { label: "Run the tour like it's a flex moment.", hint: "Impressive presence.", score: scoreFor("trex", "pterodactylus") },
            { label: "Respectful, measured, and quietly in control.", hint: "Quiet guard.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Chat about the exhibits and connect people.", hint: "Social docent.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Observe detail and note the best angles for photos.", hint: "Analytical viewer.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Enjoy slowly and take notes for later.", hint: "Calm appreciation.", score: scoreFor("stegosaurus", "parasaurolophus") },
        ],
        "It's midnight and you're hungry. What do you reach for?": [
            { label: "Raid for the bold snack and celebrate.", hint: "Impulsive delight.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Grab the reliable leftovers and reheat.", hint: "Practical choice.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Make something to share and start a late chat.", hint: "Social midnight.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Pick the optimal combo for energy and return to bed.", hint: "Strategic snack.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Keep it light and calming for sleep later.", hint: "Low-key recovery.", score: scoreFor("stegosaurus", "parasaurolophus") },
        ],
        "What's your typical hallway vibe?": [
            { label: "Stride like you own the plot.", hint: "Confident walk.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Nod, keep steady, pass with purpose.", hint: "Reliable motion.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Smile and drop a quick hello to warm the path.", hint: "Friendly pulse.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Scan, choose the best path, and glide.", hint: "Tactical pathing.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Move calmly and avoid the noise.", hint: "Low-key flow.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "What's your role at the lunch table?": [
            { label: "Claim the main chair and make big plans.", hint: "Leader energy.", score: scoreFor("trex", "parasaurolophus") },
            { label: "Make sure everyone has enough and feels safe.", hint: "Anchor at table.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Be the social connector who brings snacks.", hint: "Community hub.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Pick the seat with the best overview and acoustics.", hint: "Strategic seating.", score: scoreFor("pterodactylus", "stegosaurus") },
            { label: "Stay quiet and productive while you eat.", hint: "Focus-first.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "If your shoes could talk, what would they say?": [
            { label: "They'd say 'I stomp and make an entrance.'", hint: "Loud footprint.", score: scoreFor("trex", "parasaurolophus") },
            { label: "They'd say 'I keep you grounded and steady.'", hint: "Stable steps.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "They'd say 'I meet people and start chats.'", hint: "Friendly soles.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "They'd say 'I map routes and find shortcuts.'", hint: "Navigation shoes.", score: scoreFor("pterodactylus", "trex") },
            { label: "They'd say 'I pick the comfortable, efficient route.'", hint: "Practical footwear.", score: scoreFor("stegosaurus", "triceratops") },
        ],
        "How do you usually approach making a turn while driving?": [
            { label: "Ignore it and swerve — bold move.", hint: "Immediate action.", score: scoreFor("trex", "pterodactylus") },
            { label: "Signal, check, and make the safe move.", hint: "Responsible driver.", score: scoreFor("triceratops", "stegosaurus") },
            { label: "Signal early and chat about the route.", hint: "Social navigation.", score: scoreFor("parasaurolophus", "triceratops") },
            { label: "Plan the turn two steps ahead and execute.", hint: "Strategic steering.", score: scoreFor("pterodactylus", "trex") },
            { label: "Take the calm lane that gets you there intact.", hint: "Efficient caution.", score: scoreFor("stegosaurus", "triceratops") },
        ],
    };


    // Maps questionStems prompts to QUESTION_OPTIONS keys when wording differs.
    const PROMPT_OPTION_ALIASES = {
        "Someone hands you a sticker sheet. What happens?": "Someone hands you a sticker sheet. What happens?",
        "Pick the chair you claim immediately.": "Pick the chair you claim immediately.",
        "A friend asks for your help moving a couch. You...": "A friend asks for your help moving a couch. You...",
        "What's your natural state in a library?": "What's your natural state in a library?",
        "How does your morning usually begin?": "How does your morning usually begin?",
        "Your phone is blowing up. You...": "Your phone is blowing up. You...",
        "Your phone is constantly buzzing. You...": "Your phone is blowing up. You...",
        "Your phone lights up with messages. Your reaction?": "Your phone is blowing up. You...",
        "You wake up later than planned. What happens?": "You wake up later than planned. What happens?",
        "Something works better than expected. You...": "Something works better than expected. You...",
        "You lose track of a conversation topic. You...": "You lose track of a conversation topic. You...",
        "Your bus/train is crowded and noisy. You...": "Your bus/train is crowded and noisy. You...",
        "You suddenly feel like changing your room setup. You...": "You suddenly feel like changing your room setup. You...",
        "You start overthinking something small. You...": "You start overthinking something small. You...",
        "A cashier offers extra sauce. Your reaction?": "What is your approach to adding extra sauce to a dish?",
        "A conversation stalls awkwardly. You...": "How do you handle silence in a group setting?",
        "A conversation suddenly goes quiet. You...": "How do you handle silence in a group setting?",
        "A conversation suddenly pauses. You...": "How do you handle silence in a group setting?",
        "A friend cancels plans last minute. You...": "How do you react when plans suddenly change?",
        "A friend is late. How do you handle the wait?": "When you have to wait at least 5 minutes somewhere",
        "A group can't decide. What role do you take?": "In complete Chaos",
        "A group conversation suddenly goes quiet. You...": "How do you handle silence in a group setting?",
        "A group photo is being taken. What is your role?": "Your social mode",
        "A mystery door opens. What do you do first?": "What is your approach to a mystery door?",
        "A pizza arrives. How do you approach it?": "You have to choose a snack",
        "A plan forms in your mind instantly. You...": "How do you approach a problem that requires creativity?",
        "A random idea hits you mid-day. What next?": "How do you approach a problem that requires creativity?",
        "A random idea hits you out of nowhere. You...": "How do you approach a problem that requires creativity?",
        "A shared playlist is getting weird. You...": "What would your perfect soundtrack sound like?",
        "An idea hits you mid-routine. You...": "How do you approach a problem that requires creativity?",
        "Choose your museum behavior.": "What's your style when visiting a museum?",
        "Everything feels too loud and busy. You...": "When you are highly overstimulated",
        "Everything feels too loud. You...": "When you are highly overstimulated",
        "Everything suddenly goes quiet. You...": "How do you handle silence in a group setting?",
        "How do you approach a surprise challenge?": "How do you react to a surprise challenge?",
        "How do you behave on a shared playlist?": "What would your perfect soundtrack sound like?",
        "How do you enter a group chat?": "You enter a new group chat",
        "How do you enter a room?": "How do you usually enter a room full of people?",
        "How do you handle a turn signal?": "How do you usually approach making a turn while driving?",
        "How do you plan a weekend with zero pressure?": "Your Couch Mode",
        "How do you survive a midnight fridge raid?": "It's midnight and you're hungry. What do you reach for?",
        "How do you usually end your day?": "Your Couch Mode",
        "It starts raining right as you leave. What's your response?": "when it rains",
        "It's 2AM and you're awake. What are you doing?": "Your usual 2AM Mode",
        "No one can decide. You...": "In complete Chaos",
        "No one in the group can decide what to do. You...": "In complete Chaos",
        "Pick your ideal seat on a bus or train.": "How do you approach sitting in a Bus?",
        "Pick your soundtrack for a tiny quest.": "What would your perfect soundtrack sound like?",
        "Plans suddenly change. What's your response?": "When plans unexpectedly change",
        "Rain starts right as you leave. What's your move?": "when it rains",
        "Rain starts suddenly. What do you do?": "when it rains",
        "Someone compliments you out of nowhere. You...": "Your social mode",
        "Someone compliments you unexpectedly. You...": "Your social mode",
        "Someone compliments you unexpectedly. Your reaction?": "Your social mode",
        "Someone drops a task on you last minute. You...": "In complete Chaos",
        "Someone gives you a task out of nowhere. You...": "In complete Chaos",
        "Someone invites you somewhere last minute. You...": "How do you react when plans suddenly change?",
        "Someone leaves you on read. You...": "How do you usually behave in a group chat?",
        "Someone offers you food. What's your reaction?": "You have to choose a snack",
        "Someone suddenly proposes a toast. You...": "Your social mode",
        "The checkout line is chaotic. You...": "You are standing in a long queue",
        "The day is ending and you reflect. You...": "Your Couch Mode",
        "The elevator briefly stops between floors. You...": "You are standing in an elevator",
        "The group energy doesn't match yours. You...": "Your social mode",
        "The group vibe doesn't match you. You...": "Your social mode",
        "The line you're in suddenly stops moving. You...": "You are standing in a long queue",
        "The queue suddenly pauses for a long time. You...": "You are standing in a long queue",
        "There is one snack left. What do you do?": "When its on you to choose the first snack",
        "Too many choices. You start to...": "In complete Chaos",
        "Too many options. What's your move?": "In complete Chaos",
        "What do you do when the plan changes?": "How do you react when plans suddenly change?",
        "What does your ideal text reply style look like?": "How do you usually behave in a group chat?",
        "What energy do you bring to a road trip?": "What's your role on a road trip?",
        "What is your energy when a deadline gets real?": "Your office mode",
        "What is your ideal Saturday weather?": "What kind of Saturday weather matches your vibe?",
        "What is your lunch table role?": "What's your role at the lunch table?",
        "What is your strategy for a last-minute study sprint?": "Your office mode",
        "What kind of snack tray are you?": "You have to choose a snack",
        "Which item actually lives in your backpack?": "What goes in your backpack?",
        "Which snack are you most likely to steal?": "If you had to steal a snack, what's your strategy?",
        "Which vibe do you radiate in a hallway?": "What's your typical hallway vibe?",
        "You and a friend go quiet at the same time. You...": "How do you handle silence in a group setting?",
        "You are assigned a dinosaur sidekick. How do you train it?": "If you had a dinosaur sidekick, what would you do with it?",
        "You arrive and the group is already split. You...": "Your social mode",
        "You arrive at a birthday party. What do you do first?": "You just arrived at a Birthday party",
        "You arrive late to a group hangout. What happens?": "You just arrived at a Birthday party",
        "You arrive somewhere completely soaked. You...": "when it rains",
        "You bump into someone unexpectedly. You...": "Your social mode",
        "You can't find something important. You...": "You lost something important to you somewhere on the way",
        "You choose your seat on public transport based on...": "How do you approach sitting in a Bus?",
        "You decide it's time to leave. You...": "How do you handle leaving a group setting?",
        "You enter IKEA with no list. What's your strategy?": "You go to IKEA visiting routine",
        "You enter a bus with many seats available. You...": "How do you approach sitting in a Bus?",
        "You enter a caf\u00e9. What happens first?": "In a Cafe",
        "You enter a hotel room. What's your first action?": "When you visit a Hotel you have never been to",
        "You enter a hotel room. What's your first move?": "When you visit a Hotel you have never been to",
        "You enter a room with multiple chairs. Which do you pick?": "How do you usually enter a room full of people?",
        "You enter a room with multiple seats. How do you choose?": "How do you usually enter a room full of people?",
        "You get a strong idea out of nowhere. You...": "How do you approach a problem that requires creativity?",
        "You get an unexpected invite. What happens next?": "How do you react when plans suddenly change?",
        "You get hungry at midnight. What happens?": "It's midnight and you're hungry. What do you reach for?",
        "You get invited somewhere last minute. You...": "How do you react when plans suddenly change?",
        "You get invited somewhere last minute. Your reaction?": "How do you react when plans suddenly change?",
        "You get on a bus. Where do you sit and why?": "How do you approach sitting in a Bus?",
        "You go for a walk at night. What happens?": "When you are about to leave for a night-walk",
        "You have a long train ride ahead. What do you do?": "When you are traveling",
        "You have ten minutes between lectures. What do you do?": "On Campus",
        "You join an active group chat. What do you do first?": "You enter a new group chat",
        "You lose focus mid-task. You...": "When you feel your energy dip",
        "You lose something important. What's your first move?": "You lost something important to you somewhere on the way",
        "You must decide something instantly. What do you do?": "In complete Chaos",
        "You open a door and hesitate. Why?": "What is your approach to a mystery door?",
        "You open a kitchen cabinet with no plan. What happens?": "You have to choose a snack",
        "You open a random kitchen cabinet. What's your behavior?": "You have to choose a snack",
        "You open the kitchen cabinet. What are you looking for?": "You have to choose a snack",
        "You open the kitchen. How do you choose a snack?": "You have to choose a snack",
        "You realize you took the wrong direction. What now?": "When you are traveling",
        "You sit at a shared table alone. What happens?": "How do you usually enter a room full of people?",
        "You sit at a shared table alone. You...": "How do you usually enter a room full of people?",
        "You sit down on a couch with no plans. What happens?": "Your Couch Mode",
        "You step onto a bus or train. Where do you go?": "How do you approach sitting in a Bus?",
        "You suddenly have 3 free hours. You...": "Your Couch Mode",
        "You suddenly have time in the middle of the day. You...": "Your Couch Mode",
        "You unexpectedly get one free hour. You...": "Your Couch Mode",
        "You wake up with no plans. What now?": "Your Couch Mode",
        "You walk into a birthday party. What happens first?": "You just arrived at a Birthday party",
        "You walk into a room and everyone is quiet. You...": "How do you handle silence in a group setting?",
        "You want a snack late at night. You...": "It's midnight and you're hungry. What do you reach for?",
        "You want to leave a place. You make sure to...": "How do you handle leaving a group setting?",
        "You're at a festival. What's your role?": "You're at a festival. What's your role?",
        "You're at checkout and there's a delay. You...": "You are standing in a long queue",
        "You're at the airport early. What do you do?": "On an Airport you",
        "You're in a crowded social space. What's your instinct?": "Your social mode",
        "You're in a food court. How do you decide?": "You have to choose a snack",
        "You're in a long queue. How do you behave?": "You are standing in a long queue",
        "You're in a shared public space. What's your vibe?": "How do you usually enter a room full of people?",
        "You're in a supermarket with no list. What's your strategy?": "In the supermarket",
        "You're in charge of music for a group. What do you do?": "What would your perfect soundtrack sound like?",
        "You're in control of music. What's your approach?": "What would your perfect soundtrack sound like?",
        "You're on your way somewhere and detour. You...": "When you are traveling",
        "You're out on a night walk. What's your vibe?": "When you are about to leave for a night-walk",
        "You're ready to leave a place. How do you exit?": "How do you handle leaving a group setting?",
        "You're ready to leave somewhere. How do you exit?": "How do you handle leaving a group setting?",
        "You're stuck in an elevator with strangers. What do you do?": "You are standing in an elevator",
        "You're stuck waiting somewhere. What do you do?": "When you have to wait at least 5 minutes somewhere",
        "You're waiting for someone who's late. What do you do?": "When you have to wait at least 5 minutes somewhere",
        "You're walking down a hallway. What's your vibe?": "What's your typical hallway vibe?",
        "You're wandering a supermarket with no goal. What happens?": "In the supermarket",
        "Your desk has one free square. What goes there?": "What does your workspace usually look like?",
        "Your food takes too long to arrive. You...": "When you have to wait at least 5 minutes somewhere",
        "Your mood suddenly changes mid-situation. You...": "When you feel your energy dip",
        "Your plans get delayed by hours. You...": "How do you react when plans suddenly change?",
        "Your social energy drops mid-event. You...": "When you feel your energy dip",
        "Your social energy suddenly dips. You...": "When you feel your energy dip",
        "Your workspace is messy. What do you do?": "What does your workspace usually look like?",
    };

    function resolveOptionsKey(stem) {
        if (QUESTION_OPTIONS[stem.prompt]) {
            return stem.prompt;
        }

        const alias = PROMPT_OPTION_ALIASES[stem.prompt];
        if (alias && QUESTION_OPTIONS[alias]) {
            return alias;
        }

        if (QUESTION_OPTIONS[stem.category]) {
            return stem.category;
        }

        return null;
    }

    function getOptionsForStem(stem) {
        const optionsKey = resolveOptionsKey(stem);
        const resolved = optionsKey ? QUESTION_OPTIONS[optionsKey] : null;
        if (Array.isArray(resolved) && resolved.length) {
            return resolved;
        }
        // Generic fallback keeps the archive playable while custom options are added.
        return responseStyles;
    }

    // Expose full mapping to window for inspection and copying to source.
    // Open browser console and run:
    //   copy(JSON.stringify(window.WHATDINO_FULL_OPTIONS, null, 2))
    // to copy all question→options mappings as code you can paste into QUESTION_OPTIONS.
    try {
        if (typeof window !== "undefined") {
            window.WHATDINO_FULL_OPTIONS = QUESTION_OPTIONS;
        }
    } catch (e) {
        // noop
    }

    const app = document.querySelector("[data-whatdino-app]");

    if (!app) {
        console.warn("WhatDino: missing [data-whatdino-app] container.");
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

    const missingElements = Object.entries(els)
        .filter(([key, value]) => {
            if (key === "nodeButtons") {
                return !Array.isArray(value) || value.length === 0;
            }
            return !value;
        })
        .map(([key]) => key);

    if (missingElements.length) {
        console.warn("WhatDino: missing required elements:", missingElements);
        return;
    }

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
        return questionStems.map((stem, stemIndex) => ({
            id: `${stemIndex}-${slugify(stem.category || "")}`,
            category: stem.category,
            prompt: stem.prompt,
            // Use only dict-based options
            options: getOptionsForStem(stem).map(option => ({ ...option })),
        }));
    }

    const questionBank = buildQuestionBank();

    // Expose a direct mapping for debugging/inspection: question id -> options (full objects).
    try {
        if (typeof window !== "undefined") {
            window.WHATDINO_QUESTION_MAP = Object.fromEntries(
                questionBank.map((q) => [q.id, q.options.map((o) => ({ label: o.label, hint: o.hint }))])
            );
            // Also expose a prompt-keyed mapping so you can look up by exact question text.
            window.WHATDINO_QUESTION_MAP_PROMPT = Object.fromEntries(
                questionBank.map((q) => [q.prompt, q.options.map((o) => ({ label: o.label, hint: o.hint }))])
            );
        }
    } catch (e) {
        // noop
    }

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

    function resetQuestionHistory() {
        try {
            localStorage.removeItem(USER_HISTORY_KEY);
            sessionStorage.removeItem(SESSION_USED_KEY);
        } catch (error) {
            return;
        }
    }

    function getAvailableQuestions() {
        const used = getUsedQuestions();
        return questionBank.filter((question) => !used.has(question.id));
    }

    function updatePoolCount() {
        const available = getAvailableQuestions();
        els.poolCount.textContent = `${available.length} prompts in archive • ${MAX_ROUNDS} questions per run`;
    }

    function selectQuestionSet() {
        const available = getAvailableQuestions();

        const sliceSize = Math.min(available.length, MAX_ROUNDS);
        if (sliceSize === 0) {
            return null;
        }

        const questionSet = shuffle(available).slice(0, sliceSize).map((question) => ({
            ...question,
            options: question.options.map((opt) => ({ ...opt })),
        }));

        return questionSet;
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

    function getScorePercentages(ranked) {
        const total = ranked.reduce((sum, entry) => sum + entry.value, 0);

        return ranked.map((entry) => ({
            ...entry,
            percentage: total ? Math.round((entry.value / total) * 100) : 0,
        }));
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

        const existingScores = els.resultRegion.querySelector("[data-result-scores]");
        if (existingScores) {
            existingScores.remove();
        }

        const scoreList = document.createElement("div");
        scoreList.setAttribute("data-result-scores", "");
        scoreList.className = "whatdino-result-scores";

        getScorePercentages(winner.ranked).forEach((entry) => {
            const scoreDino = dinoById[entry.id];

            const row = document.createElement("div");
            row.className = "whatdino-result-score";

            const label = document.createElement("span");
            label.className = "whatdino-result-score__label";
            label.textContent = scoreDino.shortName;

            const bar = document.createElement("span");
            bar.className = "whatdino-result-score__bar";

            const fill = document.createElement("span");
            fill.className = "whatdino-result-score__fill";
            fill.style.width = `${entry.percentage}%`;
            fill.style.background = `linear-gradient(90deg, ${scoreDino.color}, rgba(255, 255, 255, 0.88))`;
            fill.style.boxShadow = `0 0 18px ${scoreDino.color}`;

            bar.appendChild(fill);

            const value = document.createElement("strong");
            value.className = "whatdino-result-score__value";
            value.style.color = scoreDino.color;
            value.textContent = `${entry.percentage}%`;

            row.append(label, bar, value);
            scoreList.appendChild(row);
        });

        els.resultRegion.appendChild(scoreList);

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
        let questionSet = selectQuestionSet();
        showStage(true);

        if (!questionSet) {
            resetQuestionHistory();
            questionSet = selectQuestionSet();
        }

        if (!questionSet) {
            els.questionCategory.textContent = "Archive exhausted";
            els.questionText.textContent = "Could not build a fresh run right now.";
            els.options.innerHTML = "";
            setStatus("The question archive could not be reset in this browser.");
            showResumeButton(false);
            els.resultRegion.classList.add("is-hidden");
            els.resultPill.textContent = "Unavailable";
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
            ctx.fillStyle = isWinner ? point.color : "rgba(255, 255, 255, 0.9)";
            ctx.beginPath();
            ctx.arc(point.px, point.py, isWinner ? 30 : 24, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#0f1020";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "32px Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif";
            ctx.fillText(point.emoji, point.px, point.py - 2);

            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.font = "700 18px Outfit, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText(point.shortName, point.px, point.py + 28);
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

        const scoreLabel = getScorePercentages(ranked)
            .map((entry) => `${dinoById[entry.id].shortName}: ${entry.percentage}%`)
            .join("  •  ");
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
});
