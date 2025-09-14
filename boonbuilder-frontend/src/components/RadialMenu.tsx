import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { God, Boon, BoonSlot, RadialMenuItem, Weapon, WeaponAspect } from '../types';

interface RadialMenuProps {
  gods: God[];
  boons: Boon[];
  weapons: Weapon[];
  onSelectBoon: (boon: Boon, slot: BoonSlot) => void;
  onSelectWeapon: (weapon: Weapon, aspect: WeaponAspect) => void;
  selectedBoons: Map<BoonSlot, Boon>;
  selectedWeapon?: Weapon;
  selectedAspect?: WeaponAspect;
}

type MenuState = 'main' | 'weapon' | 'aspect' | 'god' | 'boon';

const RadialMenu: React.FC<RadialMenuProps> = ({
  gods,
  boons,
  weapons,
  onSelectBoon,
  onSelectWeapon,
  selectedBoons,
  selectedWeapon,
  selectedAspect,
}) => {
  const [menuState, setMenuState] = useState<MenuState>('main');
  const [selectedSlot, setSelectedSlot] = useState<BoonSlot | null>(null);
  const [selectedGod, setSelectedGod] = useState<God | null>(null);
  const [selectedWeaponForAspect, setSelectedWeaponForAspect] = useState<Weapon | null>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Slot definitions for the main menu
  const slots: RadialMenuItem[] = [
    { id: 'weapon', name: 'Weapon', icon: '⚔️', angle: 0 },
    { id: 'attack', name: 'Attack', icon: '⚡', angle: 60 },
    { id: 'special', name: 'Special', icon: '✨', angle: 120 },
    { id: 'cast', name: 'Cast', icon: '🔮', angle: 180 },
    { id: 'sprint', name: 'Sprint', icon: '💨', angle: 240 },
    { id: 'magick', name: 'Magick', icon: '💫', angle: 300 }
  ];

  const renderRadialItem = (
    item: RadialMenuItem | God | Boon | Weapon | WeaponAspect,
    index: number,
    total: number,
    radius: number = 150
  ) => {
    const angle = (index * (360 / total) - 90 + rotation) * (Math.PI / 180);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const isHovered = hoveredItem === index;

    // Get item properties based on type
    const getName = (item: any): string => {
      if ('name' in item) return item.name;
      return item.id || '';
    };

    const getIcon = (item: any): string => {
      if ('iconUrl' in item && item.iconUrl) return item.iconUrl;
      if ('icon' in item) return item.icon;
      return '?';
    };

    return (
      <div
        key={`${getName(item)}-${index}`}
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer
          ${isHovered ? 'scale-125 z-20' : 'scale-100 z-10'}`}
        style={{
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
        }}
        onMouseEnter={() => setHoveredItem(index)}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => handleItemClick(item)}
      >
        <div className={`
          w-20 h-20 rounded-full flex items-center justify-center
          bg-gradient-to-br from-purple-600/90 to-blue-600/90
          border-2 ${isHovered ? 'border-yellow-400' : 'border-purple-300'}
          shadow-xl backdrop-blur-sm
          ${isHovered ? 'shadow-yellow-400/50' : 'shadow-purple-500/30'}
          transform transition-all duration-300
        `}>
          {getIcon(item).startsWith('http') ? (
            <img
              src={getIcon(item)}
              alt={getName(item)}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <span className="text-2xl">{getIcon(item)}</span>
          )}
        </div>
        {isHovered && (
          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2
            bg-gray-900/95 text-white px-3 py-1 rounded-lg whitespace-nowrap text-sm
            border border-purple-400 shadow-lg z-30">
            {getName(item)}
          </div>
        )}
      </div>
    );
  };

  const handleItemClick = (item: RadialMenuItem | God | Boon | Weapon | WeaponAspect) => {
    if (menuState === 'main') {
      // Handle slot selection
      const slotItem = item as RadialMenuItem;
      if (slotItem.id === 'weapon') {
        setMenuState('weapon');
      } else {
        const slotEnum = getSlotEnum(slotItem.id);
        if (slotEnum !== null) {
          setSelectedSlot(slotEnum);
          setMenuState('god');
        }
      }
    } else if (menuState === 'weapon') {
      // Handle weapon selection
      setSelectedWeaponForAspect(item as Weapon);
      setMenuState('aspect');
    } else if (menuState === 'aspect') {
      // Handle aspect selection
      const aspect = item as WeaponAspect;
      if (selectedWeaponForAspect) {
        onSelectWeapon(selectedWeaponForAspect, aspect);
      }
      setMenuState('main');
      setSelectedWeaponForAspect(null);
    } else if (menuState === 'god') {
      // Handle god selection
      setSelectedGod(item as God);
      setMenuState('boon');
    } else if (menuState === 'boon' && selectedSlot !== null) {
      // Handle boon selection
      const boon = item as Boon;
      onSelectBoon(boon, selectedSlot);
      setMenuState('main');
      setSelectedSlot(null);
      setSelectedGod(null);
    }
  };

  const getSlotEnum = (slotId: string): BoonSlot | null => {
    switch (slotId) {
      case 'attack': return BoonSlot.Attack;
      case 'special': return BoonSlot.Special;
      case 'cast': return BoonSlot.Cast;
      case 'sprint': return BoonSlot.Sprint;
      case 'magick': return BoonSlot.Magick;
      default: return null;
    }
  };

  const getFilteredBoons = (): Boon[] => {
    if (!selectedGod || selectedSlot === null) return [];

    return boons.filter(boon =>
      boon.god?.godId === selectedGod.godId &&
      boon.slot === selectedSlot
    );
  };

  const getFilteredAspects = (): WeaponAspect[] => {
    if (!selectedWeaponForAspect) return [];
    return selectedWeaponForAspect.aspects || [];
  };

  const renderCenterButton = () => {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
        {menuState !== 'main' && (
          <button
            onClick={() => {
              if (menuState === 'boon') {
                setMenuState('god');
                setSelectedGod(null);
              } else if (menuState === 'god') {
                setMenuState('main');
                setSelectedSlot(null);
              } else if (menuState === 'aspect') {
                setMenuState('weapon');
                setSelectedWeaponForAspect(null);
              } else if (menuState === 'weapon') {
                setMenuState('main');
              } else {
                setMenuState('main');
              }
            }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900
              border-2 border-purple-400 flex items-center justify-center
              hover:scale-110 transition-transform duration-200 shadow-xl"
          >
            <ChevronLeft className="w-8 h-8 text-purple-300" />
          </button>
        )}
      </div>
    );
  };

  // Initialize particles with useEffect at component level
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 51, 234, ${particle.opacity})`;
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const getCurrentItems = () => {
    switch (menuState) {
      case 'main':
        return slots;
      case 'weapon':
        return weapons;
      case 'aspect':
        return getFilteredAspects();
      case 'god':
        return gods;
      case 'boon':
        return getFilteredBoons();
      default:
        return [];
    }
  };

  return (
    <div className="relative w-[600px] h-[600px] bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-full">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Decorative rings */}
      <div className="absolute inset-4 rounded-full border-2 border-purple-500/30 animate-pulse" />
      <div className="absolute inset-8 rounded-full border border-purple-400/20" />
      <div className="absolute inset-12 rounded-full border border-purple-300/10" />

      {/* Render current items */}
      {getCurrentItems().map((item, i) =>
        renderRadialItem(item, i, getCurrentItems().length)
      )}

      {/* Center back button */}
      {renderCenterButton()}

      {/* Menu state indicator */}
      <div className="absolute bottom-4 left-4 text-sm text-purple-300 bg-gray-900/50 px-3 py-1 rounded">
        {menuState === 'main' && 'Select Category'}
        {menuState === 'weapon' && 'Select Weapon'}
        {menuState === 'aspect' && `Select ${selectedWeaponForAspect?.name} Aspect`}
        {menuState === 'god' && `Select God for ${selectedSlot !== null ? BoonSlot[selectedSlot] : ''}`}
        {menuState === 'boon' && `Select ${selectedGod?.name} Boon`}
      </div>
    </div>
  );
};

export default RadialMenu;