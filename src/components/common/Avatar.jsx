import { getAvatarByName } from '../../utils/avatarGenerator';

export default function Avatar({ name, size = 48, color, className = '', showBorder = true }) {
  const src = getAvatarByName(name);

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden 
        ${showBorder ? 'border-3 border-on-surface' : ''} bg-surface-highest ${className}`}
      style={{ width: size, height: size, minWidth: size }}
    >
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {color && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
          style={{ backgroundColor: color }}
        />
      )}
    </div>
  );
}
