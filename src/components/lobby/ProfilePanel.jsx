import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../config/firebase';
import useGameStore from '../../store/gameStore';
import { AVATAR_STYLES, getAvatarWithStyle } from '../../utils/avatarGenerator';
import Button from '../common/Button';

const STYLE_LABELS = {
  'bottts-neutral': '🤖 Bottts',
  'adventurer': '🧑 Adventurer',
  'avataaars': '😎 Avataaars',
  'fun-emoji': '🤪 Fun Emoji',
  'lorelei': '✨ Lorelei',
  'pixel-art': '👾 Pixel Art',
};

export default function ProfilePanel() {
  const { user, profile, setProfile, setUser, saveProfileToFirestore } = useGameStore();
  const [nameInput, setNameInput] = useState(profile.displayName || user?.name || '');
  const [seedInput, setSeedInput] = useState(profile.avatarSeed || user?.name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentStyle = profile.avatarStyle || 'bottts-neutral';
  const currentSeed = seedInput || user?.name || 'Player';

  // Sync name input when profile loads
  useEffect(() => {
    if (profile.displayName) setNameInput(profile.displayName);
    else if (user?.name) setNameInput(user.name);
  }, [profile.displayName, user?.name]);

  const handleStyleChange = (style) => {
    setProfile({ avatarStyle: style });
    saveProfileToFirestore({ avatarStyle: style });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      // Update profile in store
      setProfile({
        displayName: nameInput.trim() || 'Player',
        avatarSeed: seedInput.trim(),
      });

      // Sync to Firestore
      await saveProfileToFirestore({
        displayName: nameInput.trim() || 'Player',
        avatarSeed: seedInput.trim(),
        avatarStyle: currentStyle,
      });

      // Update Firebase profile
      if (auth.currentUser && nameInput.trim()) {
        await updateProfile(auth.currentUser, { displayName: nameInput.trim() });
        // Update the user in store
        setUser({
          ...user,
          name: nameInput.trim(),
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Profile update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="card !shadow-chunky-lg">
        <h2 className="font-display font-extrabold text-2xl text-on-surface mb-1 flex items-center gap-2">
          <span>👤</span> Player Profile
        </h2>
        <p className="font-body text-sm text-on-surface-variant mb-6">
          Customize your crewmate identity.
        </p>

        {/* Avatar Preview */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            key={`${currentStyle}-${currentSeed}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="relative"
          >
            <div className="w-28 h-28 rounded-full border-4 border-on-surface bg-surface-highest overflow-hidden shadow-chunky">
              <img
                src={getAvatarWithStyle(currentSeed, currentStyle, 120)}
                alt="Your avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-secondary text-on-secondary 
              rounded-full w-8 h-8 flex items-center justify-center border-2 border-on-surface text-sm">
              ✏️
            </div>
          </motion.div>
          <p className="font-display font-bold text-lg text-on-surface mt-3">
            {nameInput || 'Player'}
          </p>
          <p className="font-body text-xs text-on-surface-variant">
            {user?.email || 'Guest player'}
          </p>
        </div>

        {/* Divider */}
        <div className="h-[3px] bg-outline-variant rounded-full mb-6" />

        {/* Avatar Style Picker */}
        <div className="mb-6">
          <label className="block font-display font-bold text-sm text-on-surface mb-3">
            🎨 Choose Avatar Style
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {AVATAR_STYLES.map((style) => (
              <motion.button
                key={style}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStyleChange(style)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-3 transition-all duration-200
                  ${currentStyle === style
                    ? 'border-secondary bg-secondary-container shadow-chunky-blue'
                    : 'border-outline-variant bg-surface-lowest hover:border-on-surface hover:shadow-chunky-sm'}`}
              >
                <img
                  src={getAvatarWithStyle(currentSeed, style, 48)}
                  alt={style}
                  className="w-12 h-12 rounded-full"
                />
                <span className="text-[10px] font-display font-bold text-on-surface-variant leading-tight text-center">
                  {STYLE_LABELS[style]?.split(' ')[1] || style}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Display Name */}
        <div className="mb-4">
          <label className="block font-display font-bold text-xs text-on-surface-variant mb-1 uppercase tracking-wider">
            Display Name
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Your in-game name..."
            className="input-field"
            maxLength={20}
          />
        </div>

        {/* Avatar Seed */}
        <div className="mb-6">
          <label className="block font-display font-bold text-xs text-on-surface-variant mb-1 uppercase tracking-wider">
            Avatar Seed
          </label>
          <input
            type="text"
            value={seedInput}
            onChange={(e) => {
              setSeedInput(e.target.value);
              setProfile({ avatarSeed: e.target.value });
            }}
            placeholder="Type anything for a unique avatar..."
            className="input-field"
          />
          <p className="text-[10px] text-on-surface-variant mt-1 font-body">
            Different seeds generate different avatars. Try your name, a word, or anything!
          </p>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon={saved ? '✅' : '💾'}
            onClick={handleSave}
            disabled={saving}
            className="flex-1"
          >
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
