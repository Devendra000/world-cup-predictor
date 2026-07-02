/* Shared engine: propagate winners through the tree + render the bracket DOM */

const ROUND_ORDER = window.TOURNAMENT.rounds;
const ROUND_LABELS = window.TOURNAMENT.roundLabels;
const CARD_UNIT = 132; // px — base vertical slot for one Round-of-32 match (card height ~100px + gap)

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

/**
 * Merge one "actual" match (from data.js, the ground truth) with the
 * corresponding match from a pasted prediction JSON, for read-only viewing.
 *
 * Rules:
 * - If the actual match is NOT completed yet, the prediction's fields
 *   (teamA/teamB/winner/status/result) win — we're just showing the guess.
 * - If the actual match IS completed, the actual data always wins for
 *   display (real teams/score/winner). But if the prediction had guessed
 *   a winner for it *before* it was completed (i.e. predicted.status is
 *   not "completed"), we grade that guess: checkState becomes "correct"
 *   or "wrong", and predictedWinner is stashed for the team-row badge.
 * - If there's no prediction for this match at all, actual is returned as-is.
 */
function mergeForCheck(base, predicted) {
  if (!predicted) return { ...base, checkState: null, predictedWinner: null };

  if (base.status === "completed") {
    const merged = { ...base, checkState: null, predictedWinner: null };
    if (predicted.status !== "completed" && predicted.winner) {
      merged.predictedWinner = predicted.winner;
      merged.checkState = predicted.winner === base.winner ? "correct" : "wrong";
    }
    return merged;
  }

  return { ...base, ...predicted, checkState: null, predictedWinner: null };
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

  let pickBadge = "";
  if (match.checkState && team && team === match.predictedWinner) {
    if (match.checkState === "correct") {
      classes.push("picked-correct");
      pickBadge = `<span class="pick-badge pick-badge-correct">✓ your pick</span>`;
    } else {
      classes.push("picked-wrong");
      pickBadge = `<span class="pick-badge pick-badge-wrong">✗ your pick</span>`;
    }
  }

  const label = team || "TBD";
  const attrs = clickable ? `role="button" tabindex="0" data-match="${match.id}" data-team="${team}" ${onPickAttr}` : "";

  return `<div class="${classes.join(" ")}" ${attrs}>
    ${flagImg(team)}
    <span class="team-name">${label}</span>
    ${pickBadge}
  </div>`;
}

function statusTag(match) {
  if (match.checkState === "correct") {
    return `<span class="tag tag-correct">✅ CORRECT${match.result ? " · " + match.result : ""}</span>`;
  }
  if (match.checkState === "wrong") {
    return `<span class="tag tag-wrong">❌ WRONG${match.result ? " · " + match.result : ""}</span>`;
  }
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
  const checkClass = match.checkState === "correct" ? " check-correct"
    : match.checkState === "wrong" ? " check-wrong" : "";
  return `<div class="match-card${checkClass}" data-match-id="${match.id}">
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
  drawConnectors(container, matches);

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

function appendLine(svg, x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("class", "connector-line");
  svg.appendChild(line);
}

/**
 * Measures the actual rendered position of every match card, then draws
 * elbow connector lines from each match to the match its winner feeds into —
 * so it's visually obvious which two matches converge on the next round.
 */
function drawConnectors(container, matches) {
  const bracketEl = container.querySelector(".bracket");
  if (!bracketEl) return;

  bracketEl.style.position = "relative";
  const containerRect = bracketEl.getBoundingClientRect();

  const rectsById = {};
  bracketEl.querySelectorAll(".match-card[data-match-id]").forEach(card => {
    const r = card.getBoundingClientRect();
    rectsById[card.dataset.matchId] = {
      left: r.left - containerRect.left,
      right: r.right - containerRect.left,
      centerY: r.top - containerRect.top + r.height / 2
    };
  });

  // group source matches by the target match they feed into
  const targets = {};
  matches.forEach(m => {
    if (!m.feedsInto) return;
    const src = rectsById[m.id];
    if (!src) return;
    targets[m.feedsInto.matchId] = targets[m.feedsInto.matchId] || {};
    targets[m.feedsInto.matchId][m.feedsInto.slot] = src;
  });

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "connectors");
  svg.setAttribute("width", bracketEl.scrollWidth);
  svg.setAttribute("height", bracketEl.scrollHeight);

  Object.keys(targets).forEach(targetId => {
    const pair = targets[targetId];
    const targetRect = rectsById[targetId];
    const sources = [pair.A, pair.B].filter(Boolean);
    if (sources.length === 0) return;

    const sourceRight = sources[0].right;
    const targetLeft = targetRect ? targetRect.left : sourceRight + 34;
    const midX = sourceRight + (targetLeft - sourceRight) / 2;

    sources.forEach(s => appendLine(svg, s.right, s.centerY, midX, s.centerY));

    if (sources.length === 2) {
      appendLine(svg, midX, sources[0].centerY, midX, sources[1].centerY);
      const midY = (sources[0].centerY + sources[1].centerY) / 2;
      if (targetRect) appendLine(svg, midX, midY, targetRect.left, midY);
    } else if (targetRect) {
      appendLine(svg, midX, sources[0].centerY, targetRect.left, sources[0].centerY);
    }
  });

  bracketEl.appendChild(svg);
}

function champion(matches) {
  const final = matches.find(m => m.round === "Final");
  return final ? final.winner : null;
}
