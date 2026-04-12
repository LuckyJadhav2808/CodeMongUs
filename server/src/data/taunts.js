/**
 * Pre-generated sarcastic taunt messages for CodeMongUs.
 * Fetched instantly — no AI latency.
 */

const TAUNTS = {
  commitFail: [
    "Looks like someone copy-pasted from StackOverflow without reading the answers...",
    "That code had more bugs than a rainforest. Try again.",
    "Even the compiler felt sorry for you.",
    "Did you mean to write that, or did your cat walk on the keyboard?",
    "Somewhere, a CS professor just felt a disturbance in the force.",
    "That commit was so bad, even the Impostor cringed.",
    "Have you tried turning your brain off and on again?",
    "Your code just failed a vibe check.",
    "Bold strategy — shipping broken code. Let's see how it plays out.",
    "This is why we have code reviews, people.",
    "Error 418: I'm a teapot, and even I could write better code.",
    "The tests didn't just fail. They filed a restraining order.",
    "Plot twist: the real bug was in your confidence.",
    "Task failed successfully... wait, no. Just failed.",
    "That code looked like it was written during a fire drill.",
  ],

  crewmateWin: [
    "The codebase survived. Somehow. Against all odds.",
    "All bugs squashed! The ship sails on. 🚀",
    "Clean commit. The Senior Devs™ prevail once more.",
    "The Impostor has been exposed. Git blame never lies.",
    "Victory! The pull request has been merged successfully.",
    "The CI/CD pipeline is green. Nature is healing.",
    "Debugging complete. Time to mass merge to production.",
    "The crewmates proved they actually read the documentation.",
    "Ship integrity: restored. Coffee supply: depleted.",
    "Another day, another Impostor caught by unit tests.",
    "The code compiles. The tests pass. The Impostor weeps.",
    "Crewmates: 1, Spaghetti Code: 0.",
  ],

  impostorWin: [
    "The codebase has been compromised. Someone pushed to main without a PR.",
    "The Impostor wins! Your code review process needs work.",
    "Mission failed. The entire repo is now a dumpster fire. 🔥",
    "The Impostor merged their chaos straight to production.",
    "Congratulations, you just deployed a bug to 10 million users.",
    "The ship's codebase is now held together by duct tape and prayers.",
    "The Impostor was in the codebase the whole time. Nobody noticed.",
    "Game over. The tech debt just became tech bankruptcy.",
    "The Impostor slipped through code review. Classic.",
    "Fun fact: the Impostor's code had better variable naming than yours.",
    "The bugs won. The humans lost. As is tradition.",
    "The codebase didn't just break — it shattered into a thousand merge conflicts.",
  ],

  votingEject: [
    "has been yeeted into the void of deprecated code.",
    "was mass-deleted from the repository.",
    "got force-pushed out of existence.",
    "was sent to /dev/null. No return address.",
    "has been permanently banned from the codebase.",
    "was garbage collected. Rest in peace.",
    "was refactored out of the project.",
    "has encountered a fatal exception and was terminated.",
  ],
};

/**
 * Get a random taunt from a category.
 * @param {'commitFail' | 'crewmateWin' | 'impostorWin' | 'votingEject'} category
 * @returns {string}
 */
export function getRandomTaunt(category) {
  const pool = TAUNTS[category];
  if (!pool || pool.length === 0) return '';
  return pool[Math.floor(Math.random() * pool.length)];
}

export default TAUNTS;
