/* FIFA World Cup 2026 — bracket seed data
   Matches are listed in "visual bracket order": every consecutive pair of
   Round of 32 matches feeds the same Round of 16 match, every consecutive
   pair of Round of 16 matches feeds the same Quarterfinal, and so on.
   That's what lets the renderer draw a clean left-to-right bracket purely
   from array order + the feedsInto links (used for computing winners). */

window.TOURNAMENT = {
  name: "FIFA World Cup 2026",
  rounds: ["RO32", "RO16", "RO8", "RO4", "Final"],
  roundLabels: {
    RO32: "Round of 32",
    RO16: "Round of 16",
    RO8: "Quarterfinals",
    RO4: "Semifinals",
    Final: "Final"
  },
  matches: [
    // ---------- ROUND OF 32 (16 matches) ----------
    { id: "M74", round: "RO32", region: "Boston",       date: "Mon, Jun 29", kickoff: "4:30 PM ET", teamA: "Germany",     teamB: "Paraguay",              status: "completed", winner: "Paraguay",              result: "1-1 (3-4 pen.)", feedsInto: { matchId: "M89", slot: "A" } },
    { id: "M77", round: "RO32", region: "Boston",       date: "Tue, Jun 30", kickoff: "5:00 PM ET", teamA: "France",      teamB: "Sweden",                status: "completed", winner: "France",                result: "3-0",            feedsInto: { matchId: "M89", slot: "B" } },
    { id: "M73", round: "RO32", region: "Boston",       date: "Sun, Jun 28", kickoff: "3:00 PM ET", teamA: "South Africa",teamB: "Canada",                status: "completed", winner: "Canada",                result: "0-1",            feedsInto: { matchId: "M90", slot: "A" } },
    { id: "M75", round: "RO32", region: "Boston",       date: "Mon, Jun 29", kickoff: "9:00 PM ET", teamA: "Netherlands", teamB: "Morocco",               status: "completed", winner: "Morocco",               result: "1-1 (2-3 pen.)", feedsInto: { matchId: "M90", slot: "B" } },

    { id: "M83", round: "RO32", region: "Los Angeles",  date: "Thu, Jul 2",  kickoff: "7:00 PM ET", teamA: "Portugal",    teamB: "Croatia",               status: "completed", winner: "Portugal", result: "2-1", feedsInto: { matchId: "M93", slot: "A" } },
    { id: "M84", round: "RO32", region: "Los Angeles",  date: "Thu, Jul 2",  kickoff: "3:00 PM ET", teamA: "Spain",       teamB: "Austria",               status: "completed", winner: "Spain", result: "3-0", feedsInto: { matchId: "M93", slot: "B" } },
    { id: "M81", round: "RO32", region: "Los Angeles",  date: "Wed, Jul 1",  kickoff: "8:00 PM ET", teamA: "USA",         teamB: "Bosnia and Herzegovina",status: "completed", winner: "USA", result: "2-0", feedsInto: { matchId: "M94", slot: "A" } },
    { id: "M82", round: "RO32", region: "Los Angeles",  date: "Wed, Jul 1",  kickoff: "4:00 PM ET", teamA: "Belgium",     teamB: "Senegal",               status: "completed", winner: "Belgium", result: "3-2", feedsInto: { matchId: "M94", slot: "B" } },

    { id: "M76", round: "RO32", region: "Miami",        date: "Mon, Jun 29", kickoff: "1:00 PM ET", teamA: "Brazil",      teamB: "Japan",                 status: "completed", winner: "Brazil",  result: "2-1", feedsInto: { matchId: "M91", slot: "A" } },
    { id: "M78", round: "RO32", region: "Miami",        date: "Tue, Jun 30", kickoff: "1:00 PM ET", teamA: "Ivory Coast", teamB: "Norway",                status: "completed", winner: "Norway",  result: "1-2", feedsInto: { matchId: "M91", slot: "B" } },
    { id: "M79", round: "RO32", region: "Miami",        date: "Tue, Jun 30", kickoff: "9:00 PM ET", teamA: "Mexico",      teamB: "Ecuador",               status: "completed", winner: "Mexico",  result: "2-0", feedsInto: { matchId: "M92", slot: "A" } },
    { id: "M80", round: "RO32", region: "Miami",        date: "Wed, Jul 1",  kickoff: "12:00 PM ET",teamA: "England",     teamB: "DR Congo",              status: "completed", winner: "England", result: "2-1", feedsInto: { matchId: "M92", slot: "B" } },

    { id: "M86", round: "RO32", region: "Kansas City",  date: "Fri, Jul 3",  kickoff: "6:00 PM ET", teamA: "Argentina",   teamB: "Cape Verde",            status: "completed", winner: "Argentina", result: "3-2", feedsInto: { matchId: "M95", slot: "A" } },
    { id: "M88", round: "RO32", region: "Kansas City",  date: "Fri, Jul 3",  kickoff: "2:00 PM ET", teamA: "Australia",   teamB: "Egypt",                 status: "completed", winner: "Egypt", result: "1-1 (2-4 pen.)", feedsInto: { matchId: "M95", slot: "B" } },
    { id: "M85", round: "RO32", region: "Kansas City",  date: "Thu, Jul 2",  kickoff: "11:00 PM ET",teamA: "Switzerland", teamB: "Algeria",               status: "completed", winner: "Switzerland", result: "2-0", feedsInto: { matchId: "M96", slot: "A" } },
    { id: "M87", round: "RO32", region: "Kansas City",  date: "Fri, Jul 3",  kickoff: "9:30 PM ET", teamA: "Colombia",    teamB: "Ghana",                 status: "completed", winner: "Colombia", result: "1-0", feedsInto: { matchId: "M96", slot: "B" } },

    // ---------- ROUND OF 16 (8 matches) — teams fill in as picks are made ----------
    { id: "M89", round: "RO16", region: "Boston",      date: "Jul 5",  teamA: "Paraguay", teamB: "France", status: "completed", winner: "France", result: "0-1", feedsInto: { matchId: "M97", slot: "A" } },
    { id: "M90", round: "RO16", region: "Boston",      date: "Jul 4",  teamA: "Canada", teamB: "Morocco", status: "completed", winner: "Morocco", result: "0-3", feedsInto: { matchId: "M97", slot: "B" } },
    { id: "M93", round: "RO16", region: "Los Angeles", date: "Jul 7",  teamA: "Portugal", teamB: "Spain", status: "completed", winner: "Spain", result: "0-1", feedsInto: { matchId: "M98", slot: "A" } },
    { id: "M94", round: "RO16", region: "Los Angeles", date: "Jul 7",  teamA: "USA", teamB: "Belgium", status: "completed", winner: "Belgium", result: "1-4", feedsInto: { matchId: "M98", slot: "B" } },
    { id: "M91", round: "RO16", region: "Miami",       date: "Jul 6",  teamA: "Brazil", teamB: "Norway", status: "completed", winner: "Norway", result: "1-2", feedsInto: { matchId: "M99", slot: "A" } },
    { id: "M92", round: "RO16", region: "Miami",       date: "Jul 6",  teamA: "Mexico", teamB: "England", status: "completed", winner: "England", result: "2-3", feedsInto: { matchId: "M99", slot: "B" } },
    { id: "M95", round: "RO16", region: "Kansas City", date: "Jul 7",  teamA: "Argentina", teamB: "Egypt", status: "completed", winner: "Argentina", result: "3-2", feedsInto: { matchId: "M100", slot: "A" } },
    { id: "M96", round: "RO16", region: "Kansas City", date: "Jul 8",  teamA: "Switzerland", teamB: "Colombia", status: "completed", winner: "Switzerland", result: "0-0 (4-3 pen.)", feedsInto: { matchId: "M100", slot: "B" } },

    // ---------- QUARTERFINALS (4 matches) ----------
    { id: "M97",  round: "RO8", region: "Boston",      date: "Jul 10", teamA: "France", teamB: "Morocco", status: "completed", winner: "France", result: "2-0", feedsInto: { matchId: "M101", slot: "A" } },
    { id: "M98",  round: "RO8", region: "Los Angeles", date: "Jul 11", teamA: "Spain", teamB: "Belgium", status: "completed", winner: "Spain", result: "2-1", feedsInto: { matchId: "M101", slot: "B" } },
    { id: "M99",  round: "RO8", region: "Miami",       date: "Jul 12", teamA: "Norway", teamB: "England", status: "completed", winner: "England", result: "1-2", feedsInto: { matchId: "M102", slot: "A" } },
    { id: "M100", round: "RO8", region: "Kansas City", date: "Jul 12", teamA: "Argentina", teamB: "Switzerland", status: "completed", winner: "Argentina", result: "3-1", feedsInto: { matchId: "M102", slot: "B" } },

    // ---------- SEMIFINALS (2 matches) ----------
    { id: "M101", round: "RO4", region: "Semifinal 1", date: "Jul 15", teamA: "France", teamB: "Spain", status: "completed", winner: "Spain", result: "0-2", feedsInto: { matchId: "M104", slot: "A" } },
    { id: "M102", round: "RO4", region: "Semifinal 2", date: "Jul 16", teamA: "England", teamB: "Argentina", status: "completed", winner: "Argentina", result: "1-2", feedsInto: { matchId: "M104", slot: "B" } },

    // ---------- FINAL ----------
    { id: "M104", round: "Final", region: "Final", date: "Jul 20", teamA: "Spain", teamB: "Argentina", status: "pending", winner: null, result: null, feedsInto: null }
  ]
};

/* Team name -> flagcdn.com country code */
window.FLAGS = {
  "South Africa": "za", "Canada": "ca", "Brazil": "br", "Japan": "jp",
  "Germany": "de", "Paraguay": "py", "Netherlands": "nl", "Morocco": "ma",
  "Ivory Coast": "ci", "Norway": "no", "France": "fr", "Sweden": "se",
  "Mexico": "mx", "Ecuador": "ec", "England": "gb-eng", "DR Congo": "cd",
  "Belgium": "be", "Senegal": "sn", "USA": "us", "Bosnia and Herzegovina": "ba",
  "Spain": "es", "Austria": "at", "Portugal": "pt", "Croatia": "hr",
  "Switzerland": "ch", "Algeria": "dz", "Australia": "au", "Egypt": "eg",
  "Argentina": "ar", "Cape Verde": "cv", "Colombia": "co", "Ghana": "gh"
};