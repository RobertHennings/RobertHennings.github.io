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
        {
            name: "Campus Mode",
            options: [
                { label: "I speed-walk like I am late to destiny.", hint: "Fast, direct, slightly chaotic.", score: scoreFor("trex", "pterodactylus") },
                { label: "I check the schedule and protect my energy.", hint: "Grounded and cautious.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I find the friends-first route and make it easy.", hint: "Warm and practical.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I take the scenic path and notice everything.", hint: "Observant and elevated.", score: scoreFor("pterodactylus", "parasaurolophus") },
                { label: "I create a tiny system so nothing derails.", hint: "Calm, organized, efficient.", score: scoreFor("stegosaurus", "triceratops") },
            ],
        },
        {
            name: "Chaos Mode",
            options: [
                { label: "I commit instantly and trust the plot.", hint: "Bold under pressure.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I anchor the situation and slow the room down.", hint: "Stability first.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I turn the mess into something oddly cozy.", hint: "Soft power.", score: scoreFor("parasaurolophus", "stegosaurus") },
                { label: "I step back, assess, and pick the smartest exit.", hint: "Wide-angle thinking.", score: scoreFor("pterodactylus", "trex") },
                { label: "I fix the system so the chaos cannot return.", hint: "Quietly decisive.", score: scoreFor("stegosaurus", "triceratops") },
            ],
        },
        {
            name: "Café Mode",
            options: [
                { label: "I scan the room and choose a strategic seat first.", hint: "Observation before action.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I order fast and adapt as I go.", hint: "Momentum first.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I wait for everyone else to feel comfortable first.", hint: "Social grounding.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I pick the quiet corner and settle in immediately.", hint: "Calm control.", score: scoreFor("stegosaurus", "triceratops") },
                { label: "I notice everything but pretend I'm not analyzing it.", hint: "Hidden awareness.", score: scoreFor("pterodactylus", "trex") },
            ],
        },
        {
            name: "Lost Mode",
            options: [
                { label: "I immediately start searching in motion.", hint: "Action reduces uncertainty.", score: scoreFor("trex", "pterodactylus") },
                { label: "I retrace steps carefully and systematically.", hint: "Structure first.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I ask others and turn it into a shared problem.", hint: "Collaborative recovery.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I pause and map the situation mentally.", hint: "Big-picture thinking.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I assume it will reappear and optimize waiting.", hint: "Calm efficiency.", score: scoreFor("stegosaurus", "parasaurolophus") },
            ],
        },
        {
            name: "Elevator Mode",
            options: [
                { label: "I break the silence with energy or humor.", hint: "Social spark.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I respectfully stay quiet and stable.", hint: "Grounded presence.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I make small friendly interactions if needed.", hint: "Soft social control.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I observe everyone subtly without engaging.", hint: "Analytical awareness.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I focus on exit timing and efficiency.", hint: "Exit optimization.", score: scoreFor("stegosaurus", "pterodactylus") },
            ],
        },
        {
            name: "Snack Mode",
            options: [
                { label: "I grab the most exciting thing instantly.", hint: "Impulse-driven choice.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I pick the reliable classic snack.", hint: "Consistency wins.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I ask if anyone wants to share first.", hint: "Group-aware behavior.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I compare options before deciding carefully.", hint: "Deliberate selection.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I optimize for long-term satisfaction, not impulse.", hint: "Strategic choice.", score: scoreFor("stegosaurus", "pterodactylus") },
            ],
        },
        {
            name: "Queue Mode",
            options: [
                { label: "I stay alert and find opportunities to move faster.", hint: "Restless energy.", score: scoreFor("trex", "pterodactylus") },
                { label: "I accept the wait and stay organized.", hint: "Structured patience.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I chat with nearby people if it feels right.", hint: "Social flow.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I observe patterns in how the queue moves.", hint: "System awareness.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I mentally detach and optimize comfort.", hint: "Calm endurance.", score: scoreFor("stegosaurus", "parasaurolophus") },
            ],
        },
        {
            name: "Group Chat Mode",
            options: [
                { label: "I jump in immediately with energy or memes.", hint: "Fast social ignition.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I read everything first before responding.", hint: "Structured awareness.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I react to the vibe and ease into it.", hint: "Social harmony.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I observe patterns before I say anything.", hint: "Analytical entry.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I wait for the right moment to drop something useful.", hint: "Timing optimization.", score: scoreFor("stegosaurus", "pterodactylus") },
            ],
        },
        {
            name: "Rain Mode",
            options: [
                { label: "I embrace it and keep moving anyway.", hint: "Unbothered momentum.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I immediately adjust plans and stay dry.", hint: "Risk control.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I slow down and enjoy the change of atmosphere.", hint: "Soft adaptation.", score: scoreFor("parasaurolophus", "stegosaurus") },
                { label: "I analyze the best route or shelter options.", hint: "Strategic thinking.", score: scoreFor("pterodactylus", "triceratops") },
                { label: "I optimize comfort and treat it as a pause.", hint: "Efficient rest.", score: scoreFor("stegosaurus", "parasaurolophus") },
            ],
        },
        {
            name: "Supermarket Mode",
            options: [
                { label: "I wander and grab whatever looks good.", hint: "Impulse exploration.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I stick to a mental or written plan.", hint: "Controlled structure.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I consider what others might want too.", hint: "Social awareness.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I compare options carefully before choosing.", hint: "Analytical selection.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I optimize route efficiency through the aisles.", hint: "System efficiency.", score: scoreFor("stegosaurus", "pterodactylus") },
            ],
        },
        {
            name: "Waiting Mode",
            options: [
                { label: "I find something else to do immediately.", hint: "Active restlessness.", score: scoreFor("trex", "pterodactylus") },
                { label: "I stay patient and structured.", hint: "Stable waiting.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I start a small conversation if possible.", hint: "Social filler.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I observe everything happening around me.", hint: "Environmental scanning.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I mentally detach and conserve energy.", hint: "Efficient patience.", score: scoreFor("stegosaurus", "parasaurolophus") },
            ],
        },
        {
            name: "Plan Change Mode",
            options: [
                { label: "I adapt instantly and move forward.", hint: "Momentum adaptation.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I check what changes and re-stabilize.", hint: "Structured response.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I make sure everyone is still aligned.", hint: "Group harmony.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I reassess the situation from above.", hint: "Big-picture recalibration.", score: scoreFor("pterodactylus", "trex") },
                { label: "I quietly rebuild the plan more efficiently.", hint: "System optimization.", score: scoreFor("stegosaurus", "pterodactylus") },
            ],
        },
        {
            name: "Airport Mode",
            options: [
                { label: "I explore every corner and stay active.", hint: "Restless momentum.", score: scoreFor("trex", "pterodactylus") },
                { label: "I find a gate and settle into a structured wait.", hint: "Controlled patience.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I observe people and stay socially aware.", hint: "Soft social mapping.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I scan the entire layout and optimize movement.", hint: "System overview.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I minimize stress and conserve energy.", hint: "Efficient calm.", score: scoreFor("stegosaurus", "parasaurolophus") },
            ],
        },
        {
            name: "Couch Mode",
            options: [
                { label: "I start doing things immediately from the couch.", hint: "Action doesn't wait.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I settle in properly and organize comfort.", hint: "Structured relaxation.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I end up talking or co-existing with others nearby.", hint: "Social warmth.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I drift into observation or planning.", hint: "Reflective thinking.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I fully optimize comfort and stay there.", hint: "Efficient stillness.", score: scoreFor("stegosaurus", "parasaurolophus") },
            ],
        },
        {
            name: "Festival Mode",
            options: [
                { label: "I jump straight into the action.", hint: "High energy immersion.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I keep track of logistics and safety.", hint: "Grounded stability.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I stick with people and enhance the group vibe.", hint: "Social glue.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I move strategically between stages and moments.", hint: "Big-picture navigation.", score: scoreFor("pterodactylus", "trex") },
                { label: "I find calm zones and manage energy carefully.", hint: "Energy optimization.", score: scoreFor("stegosaurus", "parasaurolophus") },
            ],
        },
        {
            name: "IKEA Mode",
            options: [
                { label: "I roam freely and discover things as I go.", hint: "Explorative instinct.", score: scoreFor("trex", "pterodactylus") },
                { label: "I follow the path and stick to structure.", hint: "System compliance.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I turn it into a shared experience.", hint: "Social journey.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I analyze layouts and optimize the route.", hint: "Spatial strategy.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I avoid unnecessary decisions and streamline everything.", hint: "Efficiency mindset.", score: scoreFor("stegosaurus", "parasaurolophus") },
            ],
        },
        {
            name: "2AM Mode",
            options: [
                { label: "I get random bursts of energy and start doing things.", hint: "Unstable momentum.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I try to stabilize and go back to routine.", hint: "Restoration instinct.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I message someone or connect quietly.", hint: "Soft connection.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I think deeply about everything at once.", hint: "Wide mental scope.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I minimize stimulation and try to reset.", hint: "System cooldown.", score: scoreFor("stegosaurus", "parasaurolophus") },
            ],
        },
        {
            name: "Birthday Mode",
            options: [
                { label: "I immediately join the action and greet everyone.", hint: "Fast social ignition.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I find my place and settle into the structure of the room.", hint: "Grounded entry.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I connect with people one by one naturally.", hint: "Social flow.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I scan the room and map the social dynamics.", hint: "Observational awareness.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I observe first and engage when it feels right.", hint: "Energy efficiency.", score: scoreFor("stegosaurus", "pterodactylus") },
            ],
        },
        {
            name: "Hotel Mode",
            options: [
                { label: "I explore every corner immediately.", hint: "Curiosity-driven action.", score: scoreFor("trex", "pterodactylus") },
                { label: "I unpack and organize everything right away.", hint: "Structure and control.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I make the space comfortable for everyone involved.", hint: "Soft social awareness.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I analyze the layout and optimize usage.", hint: "System thinking.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I immediately relax and reduce stimulation.", hint: "Efficiency in rest.", score: scoreFor("stegosaurus", "parasaurolophus") },
            ],
        },
        {
            name: "Night Walk Mode",
            options: [
                { label: "I walk with energy and change direction often.", hint: "Active momentum.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I stick to familiar routes and stay aware.", hint: "Stable grounding.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I enjoy the atmosphere and possible encounters.", hint: "Soft openness.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I think deeply and observe everything around me.", hint: "Wide perception.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I walk efficiently and return with minimal deviation.", hint: "Optimized movement.", score: scoreFor("stegosaurus", "pterodactylus") },
            ],
        },
        {
            name: "Overstimulated Mode",
            options: [
                { label: "I push through and stay active anyway.", hint: "High resilience energy.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I reduce input and stabilize my environment.", hint: "Control restoration.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I move toward calmer people or spaces.", hint: "Social grounding.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I mentally detach and observe from distance.", hint: "Cognitive buffering.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I shut down unnecessary input and recover quietly.", hint: "Energy conservation.", score: scoreFor("stegosaurus", "parasaurolophus") },
            ],
        },
        {
            name: "Exit Mode",
            options: [
                { label: "I leave quickly once I'm ready.", hint: "Direct exit.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I follow a structured goodbye routine.", hint: "Orderly transition.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I say goodbye to people properly before leaving.", hint: "Social closure.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I time my exit strategically.", hint: "Situational awareness.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I leave with minimal disruption and noise.", hint: "Efficient departure.", score: scoreFor("stegosaurus", "pterodactylus") },
            ],
        },
        {
            name: "Kitchen Raid Mode",
            options: [
                { label: "I grab something immediately without hesitation.", hint: "Impulse action.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I check everything properly before choosing.", hint: "Structured selection.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I think about what others might want too.", hint: "Social awareness.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I scan all options before committing.", hint: "Analytical choice.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I pick the most efficient option available.", hint: "Minimal friction.", score: scoreFor("stegosaurus", "pterodactylus") },
            ],
        },
        {
            name: "Bus Mode",
            options: [
                { label: "I choose a seat quickly and move on.", hint: "Fast positioning.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I pick a structured, comfortable spot.", hint: "Stability first.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I sit near people I might interact with.", hint: "Social openness.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I evaluate the entire layout before sitting.", hint: "Spatial awareness.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I choose the most efficient exit-friendly seat.", hint: "Optimization mindset.", score: scoreFor("stegosaurus", "pterodactylus") },
            ],
        },
        {
            name: "Group Silence Mode",
            options: [
                { label: "I break the silence instantly.", hint: "Momentum through action.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I wait and let structure return naturally.", hint: "Stability preference.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I gently restart the conversation.", hint: "Social facilitation.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I analyze why the silence happened.", hint: "Meta awareness.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I stay calm and let it resolve itself.", hint: "Energy efficiency.", score: scoreFor("stegosaurus", "parasaurolophus") },
            ],
        },
        {
            name: "Idea Mode",
            options: [
                { label: "I act on it immediately.", hint: "Execution first.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I write it down and structure it.", hint: "System capture.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I share it with someone instantly.", hint: "Social processing.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I expand it mentally before doing anything.", hint: "Conceptual depth.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I store it for later optimization.", hint: "Efficient delay.", score: scoreFor("stegosaurus", "pterodactylus") },
            ],
        },
        {
            name: "Battery Mode",
            options: [
                { label: "I push through anyway.", hint: "High drive behavior.", score: scoreFor("trex", "parasaurolophus") },
                { label: "I pause and recover structure.", hint: "Restorative discipline.", score: scoreFor("triceratops", "stegosaurus") },
                { label: "I shift toward calmer social interactions.", hint: "Energy balancing.", score: scoreFor("parasaurolophus", "triceratops") },
                { label: "I detach and observe instead of engaging.", hint: "Cognitive distancing.", score: scoreFor("pterodactylus", "stegosaurus") },
                { label: "I minimize output and conserve energy.", hint: "Efficiency mode.", score: scoreFor("stegosaurus", "parasaurolophus") },
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
        return questionStems.map((stem, stemIndex) => ({
            id: `${stemIndex}-${slugify(stem.category)}`,
            category: stem.category,
            prompt: stem.prompt,
            options: shuffle(responseStyles).map((option) => ({ ...option })),
        }));
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

    function resetQuestionHistory() {
        try {
            localStorage.removeItem(USER_HISTORY_KEY);
            sessionStorage.removeItem(SESSION_USED_KEY);
        } catch (error) {
            return;
        }
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
