import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";

    const firebaseConfig = {
      apiKey: "AIzaSyADzIduNhKHBKIMWMGIwwPtiqKkZk8xZK4",
      authDomain: "dare-me-1c264.firebaseapp.com",
      projectId: "dare-me-1c264",
      storageBucket: "dare-me-1c264.firebasestorage.app",
      messagingSenderId: "1002052194460",
      appId: "1:1002052194460:web:9f55d47fbc82745a17dd59",
      measurementId: "G-SZC2F73JDZ"
    };

    const app = initializeApp(firebaseConfig);
    // Analytics ska aldrig kunna stoppa själva spelet, särskilt inte vid lokalt spel.
    let analytics = null;
    try { analytics = getAnalytics(app); } catch (e) { console.warn('Analytics är inte tillgängligt.', e); }

    let allDares = {}; 
    let tempStars = 0; 
    
    let state = {
        introSeen: false,
        modeSelected: false,
        isHost: false,
        players: [],
        selectedLevels: [],
        activeLevelIdx: 0,
        currentPlayerIdx: 0,
        allowManualStars: false,
        starPowerDuration: 3,
        starChance: 3,
        currentTask: "TRYCK FÖR KORT",
        timer: null,
        isPlaying: false,
        roomCode: null
    };

    let isHost = false, lastStarCounts = {}, db, auth, unsubscribe, user;
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'dare-me-dynamic';

    function hideLoading() { document.getElementById('loading-screen').style.display = 'none'; }

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, char => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[char]));
    }

    async function scanForLevels() {
        const grid = document.getElementById('level-selection-grid');
        const statusText = document.getElementById('lvl-scanner-status');
        if (!grid) return;
        
        let foundCount = 0;
        let htmlBuffer = "";

        // Den här arbetsversionen innehåller fyra nivåfiler. Att försöka läsa
        // upp till 20 filer gjorde att lokalt läge kunde kännas låst.
        for (let i = 1; i <= 4; i++) {
            try {
                const res = await fetch(`level${i}.json?t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();
                    allDares[i] = data;
                    const isChecked = state.selectedLevels.includes(i) ? 'checked' : '';
                    htmlBuffer += `<label class="veto-option"><input type="checkbox" class="lvl-cb" value="${i}" ${isChecked} onchange="toggleLevelSelection()"> ${data.difficulty || '🌶️'} ${data.name || 'Nivå ' + i}</label>`;
                    foundCount++;
                }
            } catch (e) { console.warn(`Kunde inte läsa in level${i}.json.`, e); }
        }

        if (foundCount > 0) {
            grid.innerHTML = htmlBuffer;
        } else {
            if (statusText) statusText.innerText = "Inga nivå-filer hittades.";
        }
    }

    window.toggleLevelSelection = () => {
        state.selectedLevels = Array.from(document.querySelectorAll('.lvl-cb:checked'))
            .map(cb => parseInt(cb.value))
            .sort((a,b) => a-b);
        saveLocal(); 
    };

    async function initFirebase() {
        // Laddningen av sidan ska inte blockeras av Firebase, särskilt vid lokalt spel.
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase timeout')), 4000));
        try {
            const connect = (async () => {
                auth = getAuth(app); db = getFirestore(app);
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await signInWithCustomToken(auth, __initial_auth_token);
            } else {
                await signInAnonymously(auth);
            }
            onAuthStateChanged(auth, (u) => {
                user = u;
                if (u && state.roomCode) listenToRoom(state.roomCode);
            });
            return true;
            })();
            return await Promise.race([connect, timeout]);
        } catch (e) { return false; }
    }

    async function updateCloud() {
        if (!state.roomCode || !db || !user) return;
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', state.roomCode), state);
    }

    function showStarNotif(name) {
        document.getElementById('notif-player-name').innerText = name;
        document.getElementById('notif-overlay').style.display = 'flex';
        setTimeout(() => { 
            const overlay = document.getElementById('notif-overlay');
            if(overlay) overlay.style.display='none'; 
        }, 4000);
    }

    function listenToRoom(code) {
        if (!db || !user) return;
        if (unsubscribe) unsubscribe();
        unsubscribe = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', code), (snapshot) => {
            if (snapshot.exists()) {
                const cloudData = snapshot.data();
                if (cloudData.players) {
                    cloudData.players.forEach(p => {
                        if (lastStarCounts[p.id] !== undefined && p.stars > lastStarCounts[p.id]) {
                            showStarNotif(p.name);
                        }
                        lastStarCounts[p.id] = p.stars;
                    });
                }
                if (!isHost && (cloudData.isPlaying || JSON.stringify(cloudData.selectedLevels) !== JSON.stringify(state.selectedLevels))) {
                    state.selectedLevels = cloudData.selectedLevels;
                    for (let id of state.selectedLevels) {
                        if (!allDares[id]) {
                            fetch(`level${id}.json?t=${Date.now()}`).then(res => {
                                if (res.ok) res.json().then(data => allDares[id] = data);
                            });
                        }
                    }
                }
                state = { ...state, ...cloudData };
                applyStateToUI();
            }
        }, (err) => { console.error("Snapshot error:", err); });
    }

    function applyStateToUI() {
        isHost = state.isHost;
        const pages = ['intro-page', 'start-page', 'lobby-page', 'game-page'];
        pages.forEach(p => {
            const el = document.getElementById(p);
            if (el) el.classList.remove('active');
        });
        document.body.className = isHost ? "is-host" : "is-guest";
        
        if (isHost) {
            const manStarsCb = document.getElementById('setting-manual-stars');
            if (manStarsCb) manStarsCb.checked = state.allowManualStars;
            const timerSel = document.getElementById('star-timer-setting');
            if (timerSel) timerSel.value = state.starPowerDuration || 3;
            const chanceSel = document.getElementById('star-chance-setting');
            if (chanceSel) chanceSel.value = state.starChance || 3;
        }

        if (!state.introSeen) {
            document.getElementById('intro-page').classList.add('active');
        } else if (!state.modeSelected) {
            document.getElementById('start-page').classList.add('active');
        } else if (state.isPlaying) {
            document.getElementById('game-page').classList.add('active');
            renderGameBar();
            
            // LOGIK FÖR NÄSTA PÅ TUR (ÖVERST PÅ KORTET)
            const nextP = state.players[state.currentPlayerIdx];
            const nextUpEl = document.getElementById('next-up-info');
            if (nextUpEl) nextUpEl.innerText = nextP ? `NÄSTA PÅ TUR: ${nextP.name}` : "NÄSTA PÅ TUR: ...";

            document.getElementById('task-box').innerHTML = state.currentTask;
            const curLvlId = state.selectedLevels[state.activeLevelIdx];
            document.getElementById('current-lvl-text').innerText = curLvlId <= 2 ? (allDares[curLvlId]?.name || `Nivå ${curLvlId}`) : "🔥 THE SHUFFLE ZONE";
            document.getElementById('lvl-up-btn').style.display = (isHost && curLvlId < 3 && state.activeLevelIdx < state.selectedLevels.length - 1) ? 'block' : 'none';
            if (state.timer) {
                document.getElementById('timer-display').style.display = 'block';
                document.getElementById('timer-display').innerText = state.timer;
                document.getElementById('game-card').classList.add('star-power-active');
                document.getElementById('star-power-label').style.display = 'block';
                document.getElementById('btn-finish-timer').style.display = 'block';
            } else {
                document.getElementById('timer-display').style.display = 'none';
                document.getElementById('game-card').classList.remove('star-power-active');
                document.getElementById('star-power-label').style.display = 'none';
                document.getElementById('btn-finish-timer').style.display = 'none';
            }
        } else {
            document.getElementById('lobby-page').classList.add('active');
            renderLobby();
        }
        const roomInfo = document.getElementById('room-info');
        if (roomInfo) roomInfo.innerHTML = state.roomCode ? `RUMSKOD: <span class="room-code-display">${state.roomCode}</span>` : `LOKALT SPEL`;
        hideLoading();
    }

    window.updateStarTimerSetting = () => { state.starPowerDuration = parseInt(document.getElementById('star-timer-setting').value); updateCloud(); saveLocal(); };
    window.updateStarChanceSetting = () => { state.starChance = parseInt(document.getElementById('star-chance-setting').value); updateCloud(); saveLocal(); };
    window.toggleManualStars = () => { state.allowManualStars = document.getElementById('setting-manual-stars').checked; updateCloud(); saveLocal(); };
    window.enterGame = () => { state.introSeen = true; applyStateToUI(); saveLocal(); };

    window.initLocalGame = async () => {
        isHost = true;
        state.isHost = true;
        state.modeSelected = true;
        state.roomCode = null;
        saveLocal();
        applyStateToUI();
        try { await scanForLevels(); } catch (e) { console.warn('Nivåerna kunde inte läsas in.', e); }
        saveLocal();
        applyStateToUI();
    };
    window.initCreateRoom = async () => {
        const ok = await initFirebase(); if (!ok) return;
        isHost = true; state.isHost = true; state.modeSelected = true;
        state.roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
        await scanForLevels(); listenToRoom(state.roomCode); updateCloud(); saveLocal(); applyStateToUI();
    };
    window.initJoinRoom = async () => {
        const code = document.getElementById('join-code-input').value.toUpperCase();
        if(!code) return;
        const ok = await initFirebase(); if (!ok) return;
        const snap = await getDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', code));
        if (!snap.exists()) return;
        isHost = false; state.isHost = false; state.modeSelected = true; state.roomCode = code; listenToRoom(code); applyStateToUI();
    };

    window.addPlayer = () => {
        const nameInput = document.getElementById('pName');
        const name = nameInput.value.trim().toUpperCase();
        if (!name) return;
        const finalStars = tempStars; tempStars = 0;
        state.players.push({
            id: Date.now(), name, gender: document.getElementById('pGender').value,
            pref: document.getElementById('pPref').value, vetos: Array.from(document.querySelectorAll('.veto-cb:checked')).map(cb => cb.value), 
            biNoPen: document.getElementById('bi-no-pen').checked, stars: finalStars
        });
        nameInput.value = ""; document.querySelectorAll('.veto-cb').forEach(cb => cb.checked = false);
        renderLobby(); updateCloud(); toggleBiOption(); saveLocal();
    };

    window.removePlayer = (id) => { state.players = state.players.filter(p => p.id !== id); renderLobby(); updateCloud(); saveLocal(); };
    
    window.editPlayer = (id) => {
        const p = state.players.find(x => x.id === id); if (!p) return;
        tempStars = p.stars;
        document.getElementById('pName').value = p.name; document.getElementById('pGender').value = p.gender;
        document.getElementById('pPref').value = p.pref; document.querySelectorAll('.veto-cb').forEach(cb => cb.checked = p.vetos.includes(cb.value));
        toggleBiOption(); removePlayer(id);
    };

    window.startGame = () => {
        if (!isHost) return;
        state.selectedLevels = Array.from(document.querySelectorAll('.lvl-cb:checked')).map(cb => parseInt(cb.value)).sort((a,b)=>a-b);
        if (state.selectedLevels.length === 0) { showLobbyWarning("Du måste välja minst en nivåfil för att kunna starta."); return; }
        if (state.players.length < 2) { showLobbyWarning("Det krävs minst två spelare för att kunna börja."); return; }
        state.isPlaying = true; state.activeLevelIdx = 0; state.currentPlayerIdx = 0; updateCloud(); saveLocal(); applyStateToUI();
    };

    window.generateTurn = () => {
        if (state.timer) stopTimer();
        const active = state.players[state.currentPlayerIdx];
        const validTargets = state.players.filter(p => p.id !== active.id);
        if (validTargets.length === 0) return;
        const target = validTargets[Math.floor(Math.random() * validTargets.length)];
        const curLvlId = state.selectedLevels[state.activeLevelIdx];
        let pool = [];
        if (curLvlId <= 2) pool = (allDares[curLvlId]?.dares || []);
        else state.selectedLevels.filter(id => id > 2).forEach(id => { if (allDares[id]) pool = pool.concat(allDares[id].dares); });

        const filteredPool = pool.filter(d => {
            if (d.tags && d.tags.some(tag => target.vetos.includes(tag) || active.vetos.includes(tag))) return false;
            if (active.gender === 'man' && target.gender === 'man' && target.pref === 'bi' && target.biNoPen && d.tags?.includes('penetration')) return false;
            return true;
        });

        if (filteredPool.length === 0) state.currentTask = "INGA MATCHANDE KORT HITTADES.";
        else {
            const dare = filteredPool[Math.floor(Math.random() * filteredPool.length)];
            const ts = target.name + (target.name.endsWith('S') ? '' : 'S');
            const pronomen = target.gender === 'man' ? 'honom' : 'henne';
            const pronomenPossessiv = target.gender === 'man' ? 'hans' : 'hennes';
            state.currentTask = `<span class="gold-name">${escapeHtml(active.name)}</span>, ${escapeHtml(dare.text)}`.replace(/\[TARGETS\]/g, `<span class="gold-name">${escapeHtml(ts)}</span>`).replace(/\[TARGET\]/g, `<span class="gold-name">${escapeHtml(target.name)}</span>`).replace(/\[HEN\]/g, pronomen).replace(/\[HENS\]/g, pronomenPossessiv);
            if (Math.random() < (state.starChance/100) && active.stars < 4) { active.stars++; if (!state.roomCode) showStarNotif(active.name); }
            state.currentPlayerIdx = (state.currentPlayerIdx + 1) % state.players.length;
        }
        updateCloud(); saveLocal(); applyStateToUI();
    };

    window.skipCard = () => {
        const activeIdx = (state.currentPlayerIdx - 1 + state.players.length) % state.players.length;
        state.currentPlayerIdx = activeIdx; 
        window.generateTurn();
    };

    window.advanceLevel = () => { if(isHost && state.activeLevelIdx < state.selectedLevels.length - 1) { state.activeLevelIdx++; updateCloud(); saveLocal(); } };
    
    window.activateStarPower = () => {
        const active = state.players[selectedPlayerIndex];
        active.stars--; closeModal();
        state.currentTask = `<span class="gold-name">${active.name}</span>, DU HAR KONTROLLEN! Bestäm vad de andra ska göra.`;
        startTimer((state.starPowerDuration || 3) * 60);
        updateCloud(); saveLocal();
    };

    window.showLobbyWarning = (msg) => {
        document.getElementById('modal-player-name').innerText = "OBS!";
        document.getElementById('modal-msg-text').innerText = msg;
        document.getElementById('modal-star-count').innerText = "";
        document.getElementById('btn-use-star').style.display = 'none';
        document.getElementById('manual-star-btn').style.display = 'none';
        document.getElementById('btn-confirm-yes').style.display = 'none';
        document.getElementById('modal-overlay').style.display = 'flex';
    };

    window.requestReset = () => {
        document.getElementById('modal-player-name').innerText = "ÄR DU SÄKER?";
        document.getElementById('modal-msg-text').innerText = "Detta raderar alla spelare, inställningar och din roll som värd på denna enhet.";
        document.getElementById('modal-star-count').innerText = "";
        
        document.getElementById('btn-use-star').style.display = 'none';
        document.getElementById('manual-star-btn').style.display = 'none';
        document.getElementById('btn-confirm-yes').style.display = 'block';
        document.getElementById('modal-overlay').style.display = 'flex';
    };

    window.confirmReset = () => { localStorage.clear(); location.reload(); };

    let selectedPlayerIndex = -1;
    window.openStarModal = (i) => {
        selectedPlayerIndex = i; const p = state.players[i];
        document.getElementById('modal-player-name').innerText = p.name;
        document.getElementById('modal-msg-text').innerText = "Antal Guldstjärnor: ";
        document.getElementById('modal-star-count').innerText = p.stars;
        document.getElementById('btn-use-star').style.display = p.stars > 0 ? 'block' : 'none';
        document.getElementById('manual-star-btn').style.display = (isHost && state.allowManualStars) ? 'block' : 'none';
        document.getElementById('btn-confirm-yes').style.display = 'none';
        document.getElementById('modal-overlay').style.display = 'flex';
    };
    
    window.closeModal = () => { 
        document.getElementById('modal-overlay').style.display = 'none'; 
        document.getElementById('btn-confirm-yes').style.display = 'none';
    };

    window.manualAddStar = () => { if(isHost && state.players[selectedPlayerIndex].stars < 4) { state.players[selectedPlayerIndex].stars++; updateCloud(); saveLocal(); closeModal(); } };
    
    function startTimer(sec) {
        let timeLeft = sec;
        const tick = () => {
            let m = Math.floor(timeLeft/60), s = timeLeft%60;
            state.timer = `${m}:${s<10?'0':''}${s}`;
            timeLeft--;
            if (timeLeft < 0) { state.timer = "KLART!"; clearInterval(window.tInt); }
            updateCloud(); saveLocal(); applyStateToUI();
        };
        clearInterval(window.tInt); window.tInt = setInterval(tick, 1000); tick();
    }
    window.finishTimerEarly = () => { clearInterval(window.tInt); state.timer = null; updateCloud(); applyStateToUI(); };
    function stopTimer() { clearInterval(window.tInt); state.timer = null; }
    
    function renderLobby() { 
        document.getElementById('displayList').innerHTML = state.players.map(p => `
            <div class="player-item">
                <div class="player-info"><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.gender)} • ${escapeHtml(p.pref)}</small></div>
                <div class="action-btns"><span class="edit-btn" onclick="editPlayer(${p.id})">✎</span><span class="delete-btn" onclick="removePlayer(${p.id})">×</span></div>
            </div>`).join(''); 
    }
    
    function renderGameBar() { 
        const activeIdx = (state.currentTask === "TRYCK FÖR KORT") ? -1 : (state.currentPlayerIdx - 1 + state.players.length) % state.players.length;
        document.getElementById('player-status').innerHTML = state.players.map((p, i) => `
            <div class="p-chip ${activeIdx === i ? 'active-turn' : ''}" onclick="openStarModal(${i})">
                <strong>${escapeHtml(p.name)}</strong><div class="star-count">${"⭐".repeat(p.stars)||0}</div>
            </div>`).join(''); 
    }
    
    window.toggleBiOption = () => { 
        const gender = document.getElementById('pGender').value;
        const pref = document.getElementById('pPref').value;
        const biUi = document.getElementById('bi-special-ui');
        if (biUi) biUi.style.display = (gender === 'man' && pref === 'bi') ? 'block' : 'none'; 
    };

    function saveLocal() { localStorage.setItem('dareme_state', JSON.stringify(state)); }
    window.goToLobby = () => { state.isPlaying = false; applyStateToUI(); updateCloud(); saveLocal(); };

    window.addEventListener('load', () => { 
        const saved = localStorage.getItem('dareme_state');
        if (saved) { state = { ...state, ...JSON.parse(saved) }; }
        // Visa gränssnittet även om Firebase eller lokala JSON-filer inte kan läsas.
        // Detta gör att lokalt läge inte fastnar på "Laddar Dare Me...".
        initFirebase().catch(() => false).finally(async () => {
            try { await scanForLevels(); } catch (e) { console.warn('Nivåer kunde inte läsas in.', e); }
            hideLoading();
            toggleBiOption();
            applyStateToUI();
            if (analytics) logEvent(analytics, 'app_open', { platform: 'web' });
        });
    });
