// MEMORY STORAGE REGISTERS (Zero Database Architecture Pattern)
let selectedClassTemplate = "Wizard";
let apiKeyToken = localStorage.getItem("GEMINI_STORY_KEY") || "";

let activeCharacterState = {
  name: "Eldrin",
  class: "Wizard",
  genre: "Fantasy",
  health: 100,
  level: 1,
  inventory: []
};

let adventureTimelineHistory = [];

// BOOTSTRAP INITIALIZATION
window.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  document.getElementById("api-key-input").value = apiKeyToken;
  showView("home-view");
});

// ROUTER MANAGEMENT ENGINE
function showView(targetViewId) {
  document.querySelectorAll(".view-section").forEach(view => {
    view.classList.add("hidden-view");
  });
  document.getElementById(targetViewId).classList.remove("hidden-view");
  
  if(targetViewId === 'story-view') evaluateAPIAlertBannerState();
  if(targetViewId === 'history-view') renderTimelineLedger();
}

// SELECTION LOGIC TRACKS
function selectClass(className) {
  selectedClassTemplate = className;
  document.querySelectorAll(".class-card").forEach(card => {
    card.classList.remove("border-purple-500/40", "ring-1", "ring-purple-500/30");
    card.classList.add("border-slate-800");
  });
  const activeCard = document.getElementById(`class-card-${className}`);
  activeCard.classList.remove("border-slate-800");
  activeCard.classList.add("border-purple-500/40", "ring-1", "ring-purple-500/30");
}

function evaluateAPIAlertBannerState() {
  const banner = document.getElementById("api-alert");
  if(!apiKeyToken) banner.classList.remove("hidden-view");
  else banner.classList.add("hidden-view");
}

function saveAPIConfiguration() {
  const inputVal = document.getElementById("api-key-input").value.trim();
  apiKeyToken = inputVal;
  localStorage.setItem("GEMINI_STORY_KEY", inputVal);
  alert("API Key saved securely inside local window properties.");
  showView("home-view");
}

function purgeAdventureCache() {
  localStorage.removeItem("GEMINI_STORY_KEY");
  apiKeyToken = "";
  document.getElementById("api-key-input").value = "";
  adventureTimelineHistory = [];
  alert("Adventure memory storage cleared.");
  showView("home-view");
}

// ADVENTURE GENERATOR LOOPS
function initializeAdventure() {
  const enteredName = document.getElementById("hero-name-input").value.trim() || "Eldrin";
  const selectedGenre = document.getElementById("hero-genre-input").value;
  
  let baseStarterItems = (selectedClassTemplate === "Wizard") 
    ? ["Catalyst Staff", "Mana Core Fragment"] 
    : ["Broadsword", "Vanguard Plate Shield"];

  activeCharacterState = {
    name: enteredName, class: selectedClassTemplate, genre: selectedGenre,
    health: 100, level: 1, inventory: baseStarterItems
  };

  adventureTimelineHistory = [{
    chapter: 1,
    text: `You awaken as a structural ${activeCharacterState.class} within the boundary limits of the ${activeCharacterState.genre} matrix. Black geometric pillars emerge along the distant horizons. The environment registers high spatial ambient energy levels. Action exploration steps await your command.`,
    choiceTrackSelected: "Game Initialization Sequence Established."
  }];

  updateHUDInterfaceMetrics();
  showView("story-view");
  
  renderChoiceInterfaceGrid([
    "Explore the crystalline monolith path to your left.",
    "Channel weapon resonance directly into the ground soil layer.",
    "Deploy perimeter scouting guards and monitor local metrics."
  ]);
  
  executeTypewriterPerformanceEffect(adventureTimelineHistory[0].text);
}

function updateHUDInterfaceMetrics() {
  document.getElementById("hud-name").innerText = activeCharacterState.name;
  document.getElementById("hud-class").innerText = activeCharacterState.class.toUpperCase();
  document.getElementById("hud-level").innerText = activeCharacterState.level;
  document.getElementById("hud-genre").innerText = activeCharacterState.genre;
  document.getElementById("hud-hp-text").innerText = `${activeCharacterState.health} / 100`;
  document.getElementById("hud-hp-bar").style.width = `${activeCharacterState.health}%`;

  const inventoryBox = document.getElementById("hud-inventory");
  inventoryBox.innerHTML = "";
  activeCharacterState.inventory.forEach(item => {
    inventoryBox.innerHTML += `
      <div class="bg-slate-950/40 border border-slate-900/60 px-3 py-2 rounded-xl flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-amber-500"></span>
        <span>${item}</span>
      </div>`;
  });
}

function executeTypewriterPerformanceEffect(targetText) {
  const displayPane = document.getElementById("story-display-pane");
  displayPane.innerHTML = "";
  let index = 0;
  
  clearInterval(window.typewriterIntervalTimer);
  window.typewriterIntervalTimer = setInterval(() => {
    displayPane.innerHTML += targetText.charAt(index);
    index++;
    if(index >= targetText.length) {
      clearInterval(window.typewriterIntervalTimer);
    }
  }, 10);
}

function renderChoiceInterfaceGrid(choicesArray) {
  const choiceGrid = document.getElementById("choice-buttons-grid");
  choiceGrid.innerHTML = "";
  
  choicesArray.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.className = "relative group p-4 rounded-xl border border-purple-500/10 bg-slate-900/40 hover:bg-purple-950/20 text-slate-300 hover:text-white text-left flex items-start gap-3 shadow-lg border-b-2 border-transparent hover:border-b-purple-500 transition-all transform hover:-translate-y-0.5";
    btn.innerHTML = `
      <span class="flex-shrink-0 w-6 h-6 rounded-md bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-mono text-amber-400">${index + 1}</span>
      <div class="flex-1 text-sm font-medium leading-snug">${choice}</div>
    `;
    btn.onclick = () => processAdventureTurnActionStep(choice);
    choiceGrid.appendChild(btn);
  });
}

// WEB API DISPATCH EXECUTION CHANNELS
async function processAdventureTurnActionStep(chosenPathText) {
  document.getElementById("choice-buttons-grid").innerHTML = "";
  document.getElementById("story-loader").classList.remove("hidden-view");

  let apiResponseJSON = null;

  if(apiKeyToken) {
    try {
      const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKeyToken}`;
      
      const payloadPromptContext = {
        contents: [{
          parts: [{
            text: `
              You are a Dark Fantasy Dungeon Master driving an RPG system.
              Hero Profile: Name: ${activeCharacterState.name}, Class: ${activeCharacterState.class}, Genre: ${activeCharacterState.genre}, Current HP: ${activeCharacterState.health}. Inventory: ${JSON.stringify(activeCharacterState.inventory)}.
              Adventure Log Save History: ${JSON.stringify(adventureTimelineHistory)}.
              The hero executes this action choice: "${chosenPathText}".
              
              Compute plot changes and output strict minified JSON format matches:
              {
                "storyText": "Cinematic story paragraph detailing immediate outcomes.",
                "choices": ["Action path choice A", "Action path choice B", "Action path choice C"],
                "healthDelta": -10,
                "inventoryAdded": ["Discovered Core Asset Name"]
              }
              CRITICAL: Output ONLY valid raw JSON text. Never wrap response values into markdown blocks.`
          }]
        }]
      };

      const webResponse = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadPromptContext)
      });

      const dataJsonResult = await webResponse.json();
      let payloadTextRaw = dataJsonResult.candidates[0].content.parts[0].text;
      payloadTextRaw = payloadTextRaw.replace(/```json/g, '').replace(/```/g, '').trim();
      apiResponseJSON = JSON.parse(payloadTextRaw);
    } catch (err) {
      console.error("Downstream gateway model translation fault context:", err);
      apiResponseJSON = null;
    }
  }

  // PRESET INTERACTION SIMULATION BACKUP SAFE FAILOVERS
  if(!apiResponseJSON) {
    apiResponseJSON = {
      storyText: `You chose to: "${chosenPathText}"\n\nThe structure shifts silently around your footprints. Radiant energy currents cascade across the stone architecture coordinates, matching tracking parameters.`,
      choices: ["Delve deeper down the corridors.", "Analyze the shifting environmental metrics.", "Retreat back to stable checkpoints."],
      healthDelta: -5,
      inventoryAdded: ["Shining Dust Fragment"]
    };
  }

  // MUTATE TRACKER REGISTERS IN APP LOCAL MEMORY
  activeCharacterState.health = Math.max(0, Math.min(100, activeCharacterState.health + (apiResponseJSON.healthDelta || 0)));
  if(apiResponseJSON.inventoryAdded && apiResponseJSON.inventoryAdded.length > 0) {
    activeCharacterState.inventory = [...new Set([...activeCharacterState.inventory, ...apiResponseJSON.inventoryAdded])];
  }
  if(apiResponseJSON.healthDelta > 0) activeCharacterState.level += 1;

  adventureTimelineHistory.push({
    chapter: adventureTimelineHistory.length + 1,
    text: apiResponseJSON.storyText,
    choiceTrackSelected: chosenPathText
  });

  document.getElementById("story-loader").classList.add("hidden-view");
  updateHUDInterfaceMetrics();
  executeTypewriterPerformanceEffect(apiResponseJSON.storyText);
  renderChoiceInterfaceGrid(apiResponseJSON.choices);
}

function renderTimelineLedger() {
  const streamBox = document.getElementById("timeline-stream-target");
  streamBox.innerHTML = "";
  
  if(adventureTimelineHistory.length === 0) {
    streamBox.innerHTML = `<p class="text-xs font-mono text-slate-500">No narrative entries recorded in active session storage buffers.</p>`;
    return;
  }

  adventureTimelineHistory.forEach(log => {
    streamBox.innerHTML += `
      <div class="relative group">
        <div class="absolute -left-[31px] top-2 w-4 h-4 rounded-full bg-slate-950 border-2 border-purple-500"></div>
        <div class="p-5 rounded-xl border border-slate-900 bg-slate-900/30 backdrop-blur-sm space-y-2">
          <span class="text-[10px] font-mono text-purple-400 font-bold uppercase">Phase Save Delta Step ${log.chapter}</span>
          <p class="text-sm text-slate-300 leading-relaxed font-serif-game">${log.text}</p>
          <div class="mt-2 pt-2 border-t border-slate-950 text-xs text-slate-400">
            <span class="text-amber-400 font-mono font-semibold uppercase">Action Path Chosen:</span> "${log.choiceTrackSelected}"
          </div>
        </div>
      </div>`;
  });
}