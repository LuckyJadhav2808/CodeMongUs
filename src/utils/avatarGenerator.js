const DICEBEAR_BASE = 'https://api.dicebear.com/7.x';

export const AVATAR_STYLES = [
  'bottts-neutral',
  'adventurer',
  'avataaars',
  'fun-emoji',
  'lorelei',
  'pixel-art',
];

export function getAvatar(seed, style = 'bottts-neutral', size = 64) {
  return `${DICEBEAR_BASE}/${style}/svg?seed=${encodeURIComponent(seed)}&size=${size}`;
}

export function getAvatarByName(name, style = 'bottts-neutral') {
  return getAvatar(name, style, 80);
}

export function getAvatarWithStyle(seed, style = 'bottts-neutral', size = 80) {
  return getAvatar(seed, style, size);
}

export function getAvatarSmall(name, style = 'bottts-neutral') {
  return getAvatar(name, style, 40);
}
