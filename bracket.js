/* Shared engine: propagate winners through the tree + render the bracket DOM */

const ROUND_ORDER = window.TOURNAMENT.rounds;
const ROUND_LABELS = window.TOURNAMENT.roundLabels;
const CARD_UNIT = 96; // px — base vertical slot for one Round-of-32 match

function flagImg(team) {
  if (!team) return '<span class="flag flag-empty" aria-hidden="true"></span>';
  const code = window.FLAGS[team];
  if (!code) return '<span class="flag flag-empty" aria-hidden="true"></span>';
  return `<img class="flag" src="https://flagcdn.com/w40/${code}.png" alt="${team} flag" width="24" height="18" loading="lazy">`;
}

/* Build id -> match lookup */
function indexById(matches) {
  const idx = {};
  matches.forEach(m => (idx[m.id] = m));
  return idx;
}

/* Build target match id -> {A: sourceMatchId, B: sourceMatchId} */
function reverseFeeds(matches) {
  const rev = {};
  matches.forEach(m => {
    if (m.feedsInto) {
      const { matchId, slot } = m.feedsInto;
      rev[matchId] = rev[matchId] || {};
      rev[matchId][slot] = m.id;
    }
  });
  return rev;
}

/**
 * Given the base match list and a { matchId: winnerName } picks map,
 * returns a full deep-cloned match list with teamA/teamB/winner resolved
 * as far downstream as the picks (and locked results) allow.
 */
function computeBracket(baseMatches, picks) {
  const matches = baseMatches.map(m => ({ ...m }));
  const idx = indexById(matches);
  const rev = reverseFeeds(matches);

  ROUND_ORDER.forEach(round => {
    matches.filter(m => m.round === round).forEach(m => {
      if (round !== "RO32") {
        const src = rev[m.id] || {};
        const a = src.A ? idx[src.A] : null;
        const b = src.B ? idx[src.B] : null;
        m.teamA = a ? a.winner || null : null;
        m.teamB = b ? b.winner || null : null;
      }
      if (m.status !== "completed") {
        m.winner = (m.teamA && m.teamB) ? (picks[m.id] || null) : null;
      }
    });
  });

  return matches;
}

/* Group a computed match list by round, preserving array order within each round */
function groupByRound(matches) {
  const byRound = {};
  ROUND_ORDER.forEach(r => (byRound[r] = []));
  matches.forEach(m => byRound[m.round].push(m));
  return byRound;
}

function teamRowHTML(match, side, interactive, onPickAttr) {
  const team = side === "A" ? match.teamA : match.teamB;
  const isWinner = match.winner && team === match.winner;
  const isLoser = match.winner && team && team !== match.winner;
  const clickable = interactive && match.status !== "completed" && match.teamA && match.teamB;

  const classes = ["team-row"];
  if (isWinner) classes.push("is-winner");
  if (isLoser) classes.push("is-loser");
  if (!team) classes.push("is-tbd");
  if (clickable) classes.push("is-pickable");

  const label = team || "TBD";
  const attrs = clickable ? `role="button" tabindex="0" data-match="${match.id}" data-team="${team}" ${onPickAttr}` : "";

  return `<div class="${classes.join(" ")}" ${attrs}>
    ${flagImg(team)}
    <span class="team-name">${label}</span>
  </div>`;
}

function statusTag(match) {
  if (match.status === "completed") {
    return `<span class="tag tag-result">RESULT${match.result ? " · " + match.result : ""}</span>`;
  }
  if (match.winner) {
    return `<span class="tag tag-pick">YOUR PICK</span>`;
  }
  if (match.teamA && match.teamB) {
    return `<span class="tag tag-open">PICK WINNER</span>`;
  }
  return `<span class="tag tag-waiting">AWAITING</span>`;
}

function matchCardHTML(match, interactive) {
  const meta = [match.region, match.date].filter(Boolean).join(" · ");
  return `<div class="match-card" data-match-id="${match.id}">
    <div class="match-meta">
      <span class="match-region">${meta}</span>
      ${statusTag(match)}
    </div>
    <div class="match-teams">
      ${teamRowHTML(match, "A", interactive, 'data-role="pick"')}
      ${teamRowHTML(match, "B", interactive, 'data-role="pick"')}
    </div>
  </div>`;
}

/**
 * Render the full bracket into `container`.
 * options: { interactive: bool, onPick: fn(matchId, teamName) }
 */
function renderBracket(container, matches, options = {}) {
  const { interactive = false, onPick = null } = options;
  const byRound = groupByRound(matches);

  const columnsHTML = ROUND_ORDER.map((round, r) => {
    const slotHeight = CARD_UNIT * Math.pow(2, r);
    const cards = byRound[round]
      .map(m => `<div class="match-slot" style="height:${slotHeight}px">${matchCardHTML(m, interactive)}</div>`)
      .join("");
    return `<div class="round-column">
      <div class="round-header">${ROUND_LABELS[round]}</div>
      <div class="round-body">${cards}</div>
    </div>`;
  }).join("");

  container.innerHTML = `<div class="bracket">${columnsHTML}</div>`;

  if (interactive && onPick) {
    container.querySelectorAll('[data-role="pick"]').forEach(el => {
      el.addEventListener("click", () => onPick(el.dataset.match, el.dataset.team));
      el.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPick(el.dataset.match, el.dataset.team);
        }
      });
    });
  }

  return byRound.Final[0] || null;
}

function champion(matches) {
  const final = matches.find(m => m.round === "Final");
  return final ? final.winner : null;
}
