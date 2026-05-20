'use client';

import { useEffect, useMemo, useState } from 'react';

const tournamentConfig = {
  majorLabel: '126TH U.S. OPEN',
  title: 'U.S. OPEN PICK 3 LIVE',
  venue: 'Shinnecock Hills Golf Club',
  location: 'Southampton, New York',
  dates: 'June 18–21, 2026',
  prizePool: '$3,500',
  jackpotRule: 'To win, your picks must include the outright U.S. Open winner. If no entry has the winner, the prize jackpots again.',
  heroImage: 'https://images.unsplash.com/photo-1500932334442-8761ee4810a7?auto=format&fit=crop&w=2400&q=80'
};

// Replace this block when you get the real U.S. Open spreadsheet.
// Keep the same format: player name plus three picks.
const poolEntries = [
  { player: "Barty", picks: ["Scottie Scheffler", "Tom Kim", "Tony Finau"] },
  { player: "Enright", picks: ["Scottie Scheffler", "Tom Kim", "Jordan Spieth"] },
  { player: "Roche SES", picks: ["Scottie Scheffler", "Jordan Spieth", "Tony Finau"] },
  { player: "Kitch", picks: ["Tom Kim", "Jordan Spieth", "Tony Finau"] },

  { player: "Shaw", picks: ["Brooks Koepka", "Keith Mitchell", "Max Greyserman"] },
  { player: "Brian Irish", picks: ["Brooks Koepka", "Keith Mitchell", "Taylor Pendrith"] },
  { player: "Jonesy", picks: ["Brooks Koepka", "Max Greyserman", "Taylor Pendrith"] },
  { player: "Haycock Snr", picks: ["Keith Mitchell", "Max Greyserman", "Taylor Pendrith"] },

  { player: "Mal J", picks: ["Sungjae Im", "Si Woo Kim", "Matti Schmid"] },
  { player: "Doc Campbell", picks: ["Sungjae Im", "Si Woo Kim", "Adam Svensson"] },
  { player: "T Coleman", picks: ["Sungjae Im", "Matti Schmid", "Adam Svensson"] },
  { player: "D Haycock", picks: ["Si Woo Kim", "Matti Schmid", "Adam Svensson"] },

  { player: "P Langley", picks: ["Chris Kirk", "Eric Cole", "Davis Thompson"] },
  { player: "T Wallace", picks: ["Chris Kirk", "Eric Cole", "Jhonattan Vegas"] },
  { player: "K Ferg", picks: ["Chris Kirk", "Davis Thompson", "Jhonattan Vegas"] },
  { player: "JB", picks: ["Eric Cole", "Davis Thompson", "Jhonattan Vegas"] },

  { player: "Matt B", picks: ["Adam Hadwin", "Aaron Wise", "Austin Eckroat"] },
  { player: "L Adams", picks: ["Adam Hadwin", "Aaron Wise", "A.J. Ewart"] },
  { player: "Lamming", picks: ["Adam Hadwin", "Austin Eckroat", "A.J. Ewart"] },
  { player: "R Fowler", picks: ["Aaron Wise", "Austin Eckroat", "A.J. Ewart"] },

  { player: "JD Boy", picks: ["Ben Kohles", "Ben Martin", "Brice Garnett"] },
  { player: "Mr Grant", picks: ["Ben Kohles", "Ben Martin", "Chandler Phillips"] },
  { player: "M Little", picks: ["Ben Kohles", "Brice Garnett", "Chandler Phillips"] },
  { player: "Wazza SB", picks: ["Ben Martin", "Brice Garnett", "Chandler Phillips"] },

  { player: "Crusader", picks: ["Zac Blair", "Patton Kizzire", "Kevin Streelman"] },
  { player: "K. Sanders", picks: ["Zac Blair", "Patton Kizzire", "Justin Lower"] },
  { player: "Doc Campbell 2", picks: ["Zac Blair", "Kevin Streelman", "Justin Lower"] },
  { player: "P Mac", picks: ["Patton Kizzire", "Kevin Streelman", "Justin Lower"] },

  { player: "A Bull", picks: ["Ryan Moore", "Troy Merritt", "Austin Cook"] },
  { player: "J Barbour", picks: ["Ryan Moore", "Troy Merritt", "Tyler Duncan"] },
  { player: "P Lund", picks: ["Ryan Moore", "Austin Cook", "Tyler Duncan"] },
  { player: "Trump H", picks: ["Troy Merritt", "Austin Cook", "Tyler Duncan"] },

  { player: "John Edge", picks: ["Pierceson Coody", "Parker Coody", "Joel Dahmen"] },
  { player: "Trent W", picks: ["Pierceson Coody", "Parker Coody", "Charley Hoffman"] },
  { player: "Sir Steve", picks: ["Pierceson Coody", "Joel Dahmen", "Charley Hoffman"] },
  { player: "Baylis", picks: ["Parker Coody", "Joel Dahmen", "Charley Hoffman"] }
];
// Optional movement baseline.
// Leave empty before the tournament. After a round/cut, paste locked baseline ranks here if you want arrows.
const movementBaselineRanks = {};

const fallbackPlayers = [
  { name: 'Rory McIlroy', position: 1, positionLabel: 'T1', score: 0, today: '', thru: 'Tee time', teeTime: '8:00 AM' },
  { name: 'Scottie Scheffler', position: 1, positionLabel: 'T1', score: 0, today: '', thru: 'Tee time', teeTime: '8:10 AM' },
  { name: 'Xander Schauffele', position: 1, positionLabel: 'T1', score: 0, today: '', thru: 'Tee time', teeTime: '8:20 AM' },
  { name: 'Ludvig Åberg', position: 1, positionLabel: 'T1', score: 0, today: '', thru: 'Tee time', teeTime: '8:30 AM' },
  { name: 'Jon Rahm', position: 1, positionLabel: 'T1', score: 0, today: '', thru: 'Tee time', teeTime: '8:40 AM' },
  { name: 'Justin Thomas', position: 1, positionLabel: 'T1', score: 0, today: '', thru: 'Tee time', teeTime: '8:50 AM' },
];

function simplifyName(name = '') {
  return String(name)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

const aliasMap = {
  afitzpatrick: 'alexfitzpatrick',
  alexfitzpatrick: 'alexfitzpatrick',
  mfitzpatrick: 'mattfitzpatrick',
  mattfitzpatrick: 'mattfitzpatrick',
  griffin: 'bengriffin',
  griffen: 'bengriffin',
  bengriffin: 'bengriffin',
  goterup: 'chrisgotterup',
  gotterup: 'chrisgotterup',
  chrisgotterup: 'chrisgotterup',
  nhojgaard: 'nicolaihojgaard',
  hojgaard: 'nicolaihojgaard',
  hjgaard: 'nicolaihojgaard',
  nicolaihjgaard: 'nicolaihojgaard',
  nicolaihojgaard: 'nicolaihojgaard',
  homa: 'maxhoma',
  maxhoma: 'maxhoma',
  burns: 'samburns',
  samburns: 'samburns',
  mccarty: 'mattmccarty',
  mattmccarty: 'mattmccarty',
  reitan: 'kristofferreitan',
  kristofferreitan: 'kristofferreitan',
  henley: 'russellhenley',
  russellhenley: 'russellhenley',
  woodland: 'garywoodland',
  garywoodland: 'garywoodland',
  speith: 'jordanspieth',
  spieth: 'jordanspieth',
  jordanspieth: 'jordanspieth',
  fowler: 'rickiefowler',
  rickiefowler: 'rickiefowler',
  mcilroy: 'rorymcilroy',
  rorymcilroy: 'rorymcilroy',
  scheffler: 'scottiescheffler',
  sheffler: 'scottiescheffler',
  scottiescheffler: 'scottiescheffler',
  young: 'cameryoung',
  cameronyoung: 'cameryoung',
  cameryoung: 'cameryoung',
  schauffele: 'xanderschauffele',
  xanderschauffele: 'xanderschauffele',
  dechambeau: 'brysondechambeau',
  brysondechambeau: 'brysondechambeau',
  rahm: 'jonrahm',
  jonrahm: 'jonrahm',
  fleetwood: 'tommyfleetwood',
  tommyfleetwood: 'tommyfleetwood',
  rose: 'justinrose',
  justinrose: 'justinrose',
  thomas: 'justinthomas',
  justinthomas: 'justinthomas',
  aberg: 'ludvigaberg',
  ludvigaberg: 'ludvigaberg',
  koepka: 'brookskoepka',
  brookskoepka: 'brookskoepka',
  hovland: 'viktorhovland',
  viktorhovland: 'viktorhovland',
  cantlay: 'patrickcantlay',
  patrickcantlay: 'patrickcantlay',
  minwoolee: 'minwoolee',
  patrickreed: 'patrickreed',
  justinrose: 'justinrose',
  coreyconners: 'coreyconners',
  adamscott: 'adamscott',
  jjspaun: 'jjspaun',
  spaun: 'jjspaun'
};

function keyName(name) {
  const s = simplifyName(name);
  return aliasMap[s] || s;
}

function scoreLabel(score) {
  if (score === 999) return 'MC';
  const n = Number(score);
  if (!Number.isFinite(n) || n === 0) return 'E';
  return n > 0 ? `+${n}` : String(n);
}

function posLabel(player) {
  if (!player) return '—';

  const label = String(player.positionLabel || '').trim().toUpperCase();
  const hasTeeTime = player.teeTime && String(player.teeTime).trim();

  if (player.position >= 999) {
    if (hasTeeTime && label !== 'CUT' && label !== 'MC') return '—';
    return 'MC';
  }

  if (player.positionLabel && String(player.positionLabel).trim()) {
    return String(player.positionLabel);
  }

  return String(player.position);
}

function sortPlayers(players) {
  return [...players].sort((a,b) => {
    if ((a.position ?? 999) !== (b.position ?? 999)) return (a.position ?? 999) - (b.position ?? 999);
    if ((a.score ?? 999) !== (b.score ?? 999)) return (a.score ?? 999) - (b.score ?? 999);
    return String(a.name).localeCompare(String(b.name));
  });
}

function addPositionLabels(players) {
  const sorted = sortPlayers(players);

  const counts = new Map();

  sorted.forEach(p => {
    if (p.position < 999) {
      counts.set(p.position, (counts.get(p.position) || 0) + 1);
    }
  });

  return sorted.map(p => {
    const hasTeeTime = p.teeTime && String(p.teeTime).trim();
    const existingLabel = String(p.positionLabel || '').trim().toUpperCase();

    if (p.position >= 999) {
      return {
        ...p,
        positionLabel:
          hasTeeTime && existingLabel !== 'CUT' && existingLabel !== 'MC'
            ? '—'
            : 'MC'
      };
    }

    return {
      ...p,
      positionLabel:
        counts.get(p.position) > 1
          ? `T${p.position}`
          : String(p.position)
    };
  });
}

function buildMap(players) {
  const map = new Map();
  players.forEach(p => map.set(keyName(p.name), p));
  return map;
}

function isLivePick(p) {
  if (!p) return false;

  const label = String(p.positionLabel || '').trim().toUpperCase();
  const hasTeeTime = p.teeTime && String(p.teeTime).trim();

  if (p.position >= 999 && hasTeeTime && label !== 'CUT' && label !== 'MC') {
    return true;
  }

  return p.position < 999 && posLabel(p) !== 'MC';
}

function comparePickSets(a, b) {
  for (let i = 0; i < 3; i++) {
    const av = a[i]?.position ?? 999;
    const bv = b[i]?.position ?? 999;
    if (av !== bv) return av - bv;
  }
  return 0;
}

function isDominated(entry, allEntries) {
  const livePicks = entry.sortedPicks.filter(isLivePick);

  // Current rule from PGA Championship: anyone with 3 live picks stays alive.
  if (livePicks.length === 3) return false;
  if (livePicks.length === 0) return true;

  return livePicks.every(winner => {
    return allEntries.some(other => {
      if (other.player === entry.player) return false;
      const otherLive = other.sortedPicks.filter(isLivePick);
      const otherHasWinner = otherLive.some(p => keyName(p.name) === keyName(winner.name));
      if (!otherHasWinner) return false;
      return comparePickSets(otherLive, livePicks) < 0;
    });
  });
}

function rankEntries(entries, hasRealScores, previousRanks = {}) {
  let lastKey = null;
  let currentRank = 0;

  return entries.map((entry, index) => {
    const key = hasRealScores ? entry.sortedPicks.map(p => p.position).join('|') : String(index + 1);
    if (key !== lastKey) {
      currentRank = index + 1;
      lastKey = key;
    }

    const tieCount = hasRealScores
      ? entries.filter(e => e.sortedPicks.map(p => p.position).join('|') === key).length
      : 1;

    const rankLabel = tieCount > 1 ? `T${currentRank}` : String(currentRank);
    const prev = previousRanks?.[entry.player];
    let move = '—', moveClass = 'move-same';

    if (prev && hasRealScores) {
      if (currentRank < prev) { move = `▲ ${prev - currentRank}`; moveClass = 'move-up'; }
      else if (currentRank > prev) { move = `▼ ${currentRank - prev}`; moveClass = 'move-down'; }
    }

    return { ...entry, rankLabel, numericRank: currentRank, move, moveClass };
  });
}

function evaluatePool(entries, players, previousRanks) {
  const map = buildMap(players);
  const hasRealScores = players.some(p => p.thru && !String(p.thru).toLowerCase().includes('tee'));

  const evaluated = entries.map((entry, originalIndex) => {
    const picks = entry.picks.map(pick => map.get(keyName(pick)) || {
      name: pick,
      position: 999,
      positionLabel: 'NS',
      score: 999,
      today: '',
      thru: 'Not Started'
    });

    const sortedPicks = [...picks].sort((a,b) => {
      if ((a.position ?? 999) !== (b.position ?? 999)) return (a.position ?? 999) - (b.position ?? 999);
      if ((a.score ?? 999) !== (b.score ?? 999)) return (a.score ?? 999) - (b.score ?? 999);
      return String(a.name).localeCompare(String(b.name));
    });

    return { ...entry, originalIndex, sortedPicks };
  });

  const ranked = hasRealScores
    ? evaluated.sort((a,b) => {
        for (let i=0;i<3;i++) {
          if (a.sortedPicks[i].position !== b.sortedPicks[i].position) return a.sortedPicks[i].position - b.sortedPicks[i].position;
        }
        return a.originalIndex - b.originalIndex;
      })
    : evaluated.sort((a,b) => a.originalIndex - b.originalIndex);

  const rankedWithStatus = rankEntries(ranked, hasRealScores, previousRanks);
  const cutHasHappened = players.some(p => p.position >= 999 || posLabel(p) === 'MC');

  if (!cutHasHappened) return rankedWithStatus;

  const aliveRaw = rankedWithStatus.filter(entry => !isDominated(entry, rankedWithStatus));
  const alive = rankEntries(aliveRaw, hasRealScores, previousRanks);

  const eliminated = rankedWithStatus
    .filter(entry => isDominated(entry, rankedWithStatus))
    .map(entry => ({
      ...entry,
      eliminated: true,
      rankLabel: '',
      move: 'ELIMINATED',
      moveClass: 'move-down'
    }));

  return [...alive, ...eliminated];
}

export default function Home() {
  const [apiState, setApiState] = useState({
  mode: 'loading',
  players: [],
  updatedAt: null,
  message: ''
});

const [poolExpanded, setPoolExpanded] = useState(false);
const [golfExpanded, setGolfExpanded] = useState(false);

const [movementRanks, setMovementRanks] = useState({});
const [poolStateLoaded, setPoolStateLoaded] = useState(false);

async function loadLeaderboard() {
  try {
    const res = await fetch('/api/leaderboard');
    const data = await res.json();
    setApiState(data);
  } catch (err) {
    setApiState({
      mode: 'error',
      players: [],
      updatedAt: new Date().toISOString(),
      message: err?.message || 'Unable to load scores.'
    });
  }
}

useEffect(() => {
  loadLeaderboard();

  const interval = setInterval(loadLeaderboard, 5 * 60 * 1000);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  async function loadPoolState() {
    try {
      const data = await fetch('/api/pool-state').then(r => r.json());

      setMovementRanks(data.previous_ranks || {});
      setPoolStateLoaded(true);
    } catch {
      setMovementRanks({});
      setPoolStateLoaded(true);
    }
  }

  loadPoolState();
}, [apiState.updatedAt]);

const players = useMemo(
  () =>
    addPositionLabels(
      apiState.players?.length ? apiState.players : fallbackPlayers
    ),
  [apiState]
);

const pool = useMemo(() => {
  return evaluatePool(poolEntries, players, movementRanks);
}, [players, movementRanks]);

useEffect(() => {
  if (!poolStateLoaded || !pool.length || apiState.mode !== 'live') return;

  const currentRanks = {};

  pool.forEach(entry => {
    if (!entry.eliminated && entry.numericRank) {
      currentRanks[entry.player] = entry.numericRank;
    }
  });

  fetch('/api/pool-state', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tournament_name: 'THE CJ CUP Byron Nelson',
      current_ranks: currentRanks
    })
  });
}, [poolStateLoaded, pool, apiState.mode]);

const leader = pool[0];

const poolLeaders = pool.filter(
  p => p.numericRank === pool[0]?.numericRank && !p.eliminated
);

const leaderNames = poolLeaders.map(p => p.player).join(' / ');

const updatedText = apiState.updatedAt
  ? `Updated ${Math.max(
      0,
      Math.round(
        (Date.now() - new Date(apiState.updatedAt).getTime()) / 60000
      )
    )} min ago`
  : 'Waiting for scores';

const golfLeaderNames = players
  .filter(p => p.position === players[0]?.position)
  .map(p => p.name)
  .join(' / ');

const warningText =
  apiState.mode === 'missing-key'
    ? 'API key missing in Vercel. Add SLASH_GOLF_API_KEY.'
    : apiState.mode === 'api-error'
      ? `Live API fallback active: ${apiState.message}`
      : '';

const aliveCount = pool.filter(p => !p.eliminated).length;
const eliminatedCount = pool.filter(p => p.eliminated).length;
  return (
    <main className="page" style={{ '--hero-image': `url(${tournamentConfig.heroImage})` }}>
      <div className="header">
        <div className="logo"><h1>US</h1><div>OPEN</div><div>LIVE</div></div>
        <div className="title">
          <div className="eyebrow">{tournamentConfig.majorLabel}</div>
          <h2>{tournamentConfig.title}</h2>
          <div className="subtitle">{tournamentConfig.venue} • {tournamentConfig.location} • {tournamentConfig.dates}</div>
          <div className="livebar"><div className="live">{apiState.mode === 'live' ? 'LIVE' : 'READY'}</div><div className="updated">{updatedText}</div></div>
        </div>
      </div>

      {warningText && <div className="warning">{warningText}</div>}

      <div className="grid">
        <section className={`panel ${golfExpanded ? 'expanded' : ''}`}>
          <div className="panel-title">U.S. Open Live Leaderboard</div>
          <table>
            <thead><tr><th>Pos</th><th>Player</th><th>Today</th><th>Thru</th><th>Total</th></tr></thead>
            <tbody>
              {players.map((p, idx) => (
                <tr key={`${p.name}-${idx}`} className={idx >= 14 ? 'hidden-row' : ''}>
                  <td>{posLabel(p)}</td><td className="player">{p.name}</td><td className="red">{scoreLabel(p.today)}</td>
                  <td>{p.teeTime && (!p.thru || String(p.thru).toLowerCase().includes('tee')) ? p.teeTime : (p.thru || '—')}</td>
                  <td className="red">{scoreLabel(p.score)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="footer-btn" onClick={() => setGolfExpanded(!golfExpanded)}>{golfExpanded ? 'COLLAPSE U.S. OPEN LEADERBOARD ▲' : 'FULL U.S. OPEN LEADERBOARD ▶'}</button>
        </section>

        <div>
          <section className="panel summary-panel">
            <div className="panel-title">Projected Pool Leader</div>
            <div className="leader-box">
              <div className="big">{leaderNames ? leaderNames.toUpperCase() : 'WAITING'}</div>
              <div className="reason">{golfLeaderNames || 'Waiting for first scores'} currently leads the tournament.<br />{leader ? `${leaderNames || leader.player} leads the pool on current tie-breaks.` : 'Pool leaderboard will update once scores arrive.'}</div>
              <div className="stat-row">
                <div><strong>{tournamentConfig.prizePool}</strong><span>Prize Pool</span></div>
                <div><strong>{aliveCount}</strong><span>Alive</span></div>
                <div><strong>{eliminatedCount}</strong><span>Eliminated</span></div>
              </div>
              <div className="leader-updated">{tournamentConfig.jackpotRule}</div>
            </div>
          </section>

          <section className={`panel pool-panel ${poolExpanded ? 'expanded' : ''}`}>
            <div className="panel-title">Live Pool Leaderboard</div>
            <table>
              <thead><tr><th>Pos</th><th>Move</th><th>Player</th><th>Best Pick</th><th>Next Best</th><th>3rd Pick</th></tr></thead>
              <tbody>
                {pool.map((entry, idx) => {
                  const best = entry.sortedPicks[0], second = entry.sortedPicks[1], third = entry.sortedPicks[2];
                  const isBestLeading = best.position === players[0]?.position;
                  return (
                    <tr key={entry.player} className={`${idx >= 14 ? 'hidden-row' : ''} ${entry.eliminated ? 'eliminated-row' : ''}`}>
                      <td>{entry.rankLabel}</td><td className={entry.moveClass}>{entry.move}</td><td className="player">{entry.player}</td>
                      <td className={isBestLeading ? 'green highlight' : ''}>{best.name} <span className="small">({posLabel(best)})</span></td>
                      <td>{second.name} <span className="small">({posLabel(second)})</span></td>
                      <td>{third.name} <span className="small">({posLabel(third)})</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button className="footer-btn" onClick={() => setPoolExpanded(!poolExpanded)}>{poolExpanded ? 'COLLAPSE POOL LEADERBOARD ▲' : 'FULL POOL LEADERBOARD ▶'}</button>
          </section>
        </div>
      </div>

      <div className="note">Live rankings are decided by best current golf position, then next best and third pick. {tournamentConfig.jackpotRule}</div>
    </main>
  );
}
