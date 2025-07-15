// components/Logos.tsx

const commonProps = {
  className: "w-full h-auto text-gray-400 group-hover:text-primary-500 transition-colors duration-300",
  fill: "currentColor",
  viewBox: "0 0 128 128",
};

export const MercedesLogo = () => (
  <svg {...commonProps}>
    <path d="M64 128c35.4 0 64-28.6 64-64S99.4 0 64 0 0 28.6 0 64s28.6 64 64 64zM7.5 64c0 31.2 25.3 56.5 56.5 56.5S120.5 95.2 120.5 64 95.2 7.5 64 7.5 7.5 32.8 7.5 64zm56.5-44.1V64h44.1c-4.4-24.3-25.4-42.3-49.8-44.1H64zM19.9 64h44.1V19.9C39.7 21.7 21.7 39.7 19.9 64zm0 0v44.1C44.3 103.7 62.3 85.7 64 61.3V64H19.9z" />
  </svg>
);

export const BmwLogo = () => (
  <svg {...commonProps}>
    <path d="M64 0C28.6 0 0 28.6 0 64s28.6 64 64 64 64-28.6 64-64S99.4 0 64 0zm0 120.5c-31.2 0-56.5-25.3-56.5-56.5S32.8 7.5 64 7.5s56.5 25.3 56.5 56.5S95.2 120.5 64 120.5z" />
    <path d="M64 7.5v56.5h56.5C118 36.3 91.7 10 64 7.5z" fill="#0099ff" />
    <path d="M7.5 64h56.5V7.5C36.3 10 10 36.3 7.5 64z" />
    <path d="M64 120.5V64H7.5c2.5 27.7 28.8 53 56.5 55.5z" fill="#0099ff" />
    <path d="M120.5 64H64v56.5c27.7-2.5 53-28.8 55.5-56.5z" />
  </svg>
);

export const AudiLogo = () => (
  <svg {...commonProps} viewBox="0 0 200 70">
    <circle cx="35" cy="35" r="30" stroke="currentColor" strokeWidth="9" fill="transparent" />
    <circle cx="85" cy="35" r="30" stroke="currentColor" strokeWidth="9" fill="transparent" />
    <circle cx="135" cy="35" r="30" stroke="currentColor" strokeWidth="9" fill="transparent" />
    <circle cx="185" cy="35" r="30" stroke="currentColor" strokeWidth="9" fill="transparent" />
  </svg>
);

export const PeugeotLogo = () => (
  <svg {...commonProps} viewBox="0 0 24 24">
    <path d="M4.31,8.35a1,1,0,0,0,0,1.41L9,14.41V21a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V14.41l4.69-4.65a1,1,0,0,0,0-1.41L15,3.59V3a1,1,0,0,0-1-1H10A1,1,0,0,0,9,3V3.59Z" />
  </svg>
);

export const RenaultLogo = () => (
  <svg {...commonProps} viewBox="0 0 24 24">
    <path d="M12,2,2,12l10,10,10-10L12,2Zm0,2.83,7.17,7.17L12,19.17,4.83,12,12,4.83Z" />
    <path d="M12,8.83,15.17,12,12,15.17,8.83,12,12,8.83Z" />
  </svg>
);

export const VolkswagenLogo = () => (
  <svg {...commonProps}>
    <path d="M64 0C28.6 0 0 28.6 0 64s28.6 64 64 64 64-28.6 64-64S99.4 0 64 0zm0 120.5c-31.2 0-56.5-25.3-56.5-56.5S32.8 7.5 64 7.5s56.5 25.3 56.5 56.5-25.3 56.5-56.5 56.5z" />
    <path d="m31.7 20 12.5 54.3L56 46.1zM58.3 47.9 64 20l5.7 27.9zM65.8 46.1 77.5 74.3 90.3 20z" fill="currentColor" />
    <path d="m50.4 78 4.9 21.5L64 78h-4.3zM68.3 78l8.4 21.5L81.6 78z" fill="currentColor" />
  </svg>
); 