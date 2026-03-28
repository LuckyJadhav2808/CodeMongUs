export const PLAYERS = [
  { id: 1, name: 'Captain_Dev', color: '#C51111', status: 'alive', role: 'impostor' },
  { id: 2, name: 'BugFixer_99', color: '#132ED1', status: 'alive', role: 'crewmate' },
  { id: 3, name: 'NullPointer', color: '#1B9638', status: 'alive', role: 'crewmate' },
  { id: 4, name: 'StackTrace', color: '#ED54BA', status: 'alive', role: 'crewmate' },
  { id: 5, name: 'GitGuru', color: '#EF7D0E', status: 'eliminated', role: 'crewmate' },
  { id: 6, name: 'CSS_Queen', color: '#F5F557', status: 'alive', role: 'crewmate' },
  { id: 7, name: 'NodeNinja', color: '#3F474E', status: 'alive', role: 'crewmate' },
  { id: 8, name: 'ReactRanger', color: '#6B2FBB', status: 'alive', role: 'crewmate' },
];

export const CHAT_MESSAGES = [
  { id: 1, player: 'BugFixer_99', message: 'I think I saw Red in Electrical venting...', time: '3:42' },
  { id: 2, player: 'Captain_Dev', message: "I'm literally doing the code task in front of you. 🙄", time: '3:40' },
  { id: 3, player: 'StackTrace', message: 'Wait, I just finished the thruster function!', time: '3:38' },
  { id: 4, player: 'CSS_Queen', message: 'Has anyone checked the npm audit logs? 👀', time: '3:35' },
  { id: 5, player: 'NodeNinja', message: 'The deployment pipeline is looking sus...', time: '3:30' },
  { id: 6, player: 'ReactRanger', message: "I was pair programming with BugFixer the whole time.", time: '3:28' },
];

export const VOTING_MESSAGES = [
  { id: 1, player: 'BugFixer_99', message: 'I saw Captain_Dev venting in the Coding Bay!', time: '0:55' },
  { id: 2, player: 'Captain_Dev', message: "That's a lie, I was busy fixing the JS production build! 🚩", time: '0:50' },
  { id: 3, player: 'NullPointer', message: 'Wait, BugFixer_99 was with me in the Lobby the whole time.', time: '0:45' },
  { id: 4, player: 'StackTrace', message: 'Self report? The meeting was called instantly after the sabotage.', time: '0:40' },
  { id: 5, player: 'CSS_Queen', message: "I'm voting Captain_Dev, too suspicious.", time: '0:35' },
];

export const TASKS = [
  { id: 1, title: 'Fix Wiring in Electrical', difficulty: 'Normal', completed: false },
  { id: 2, title: 'Refuel Engines', difficulty: 'Easy', completed: true },
  { id: 3, title: 'Download Code Schematics', difficulty: 'Hard', completed: false },
  { id: 4, title: 'Debug Navigation System', difficulty: 'Normal', completed: false },
  { id: 5, title: 'Align Engine Output', difficulty: 'Easy', completed: true },
];

export const SABOTAGE_ABILITIES = [
  { id: 'flashbang', name: 'Flashbang', icon: '💡', desc: 'Flash editor to light mode', cooldown: 30, ready: true },
  { id: 'typo', name: 'Typo Injection', icon: '✏️', desc: 'Inject random typos into code', cooldown: 20, ready: true },
  { id: 'ghost', name: 'Cursor Ghosting', icon: '👻', desc: 'Spawn fake cursors', cooldown: 25, ready: false },
  { id: 'lag', name: 'Lag Spike', icon: '🐌', desc: 'Simulate network lag', cooldown: 45, ready: true },
];

export const CODE_SNIPPET = `// mission.js — Ship Navigation Module
import { calculateTrajectory } from './nav-utils';
import { getCrewStatus } from './crew-manager';

const SHIP_SPEED = 9.8; // km/s

export function navigateToStation(coords) {
  const crew = getCrewStatus();
  if (crew.some(c => c.status === 'eliminated')) {
    console.warn('⚠️ Crew member down!');
  }

  const trajectory = calculateTrajectory(coords, SHIP_SPEED);
  console.log(\`Setting course: \${trajectory.heading}°\`);

  return {
    eta: trajectory.time,
    fuelCost: trajectory.fuel,
    route: trajectory.waypoints,
  };
}

export function emergencyMeeting(caller) {
  console.log(\`🚨 EMERGENCY MEETING called by \${caller}!\`);
  // TODO: implement voting logic
  return { phase: 'voting', timer: 60 };
}
`;

export const ROOM_CODE = 'GIT-BLAME-42';
