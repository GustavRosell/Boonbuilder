import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { God, Boon, BoonSlot, RadialMenuItem, Weapon, WeaponAspect, Pet, AvailableBoon } from '../types';
import ImageWithFallback from './ImageWithFallback';

interface RadialMenuProps {
  gods: God[];
  boons: Boon[];
  weapons: Weapon[];
  pets: Pet[];
  availableDuoBoons: AvailableBoon[];
  availableLegendaryBoons: AvailableBoon[];
  onSelectBoon: (boon: Boon, slot: BoonSlot) => void;
  onSelectDuoBoon: (boon: AvailableBoon) => void;
  onSelectLegendaryBoon: (boon: AvailableBoon) => void;
  onSelectWeapon: (weapon: Weapon, aspect: WeaponAspect) => void;
  onSelectPet: (pet: Pet) => void;
  selectedBoons: Map<BoonSlot, Boon>;
  selectedDuoBoons: AvailableBoon[];
  selectedLegendaryBoons: AvailableBoon[];
  selectedWeapon?: Weapon;
  selectedAspect?: WeaponAspect;
  selectedPet?: Pet;
}

type MenuState = 'main' | 'weapon' | 'aspect' | 'pet' | 'god' | 'boon' | 'legendary' | 'duo';

const RadialMenu: React.FC<RadialMenuProps> = ({
  gods,
  boons,
  weapons,
  pets,
  availableDuoBoons,
  availableLegendaryBoons,
  onSelectBoon,
  onSelectDuoBoon,
  onSelectLegendaryBoon,
  onSelectWeapon,
  onSelectPet,
  selectedBoons,
  selectedDuoBoons,
  selectedLegendaryBoons,
  selectedWeapon,
  selectedAspect,
  selectedPet,
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
    { id: 'pet', name: 'Pet', icon: '🐸', angle: 40 },
    { id: 'attack', name: 'Attack', icon: '⚡', angle: 80 },
    { id: 'special', name: 'Special', icon: '✨', angle: 120 },
    { id: 'cast', name: 'Cast', icon: '🔮', angle: 160 },
    { id: 'sprint', name: 'Sprint', icon: '💨', angle: 200 },
    { id: 'magick', name: 'Magick', icon: '💫', angle: 240 },
    { id: 'legendary', name: 'Legendary', icon: '⭐', angle: 280 },
    { id: 'duo', name: 'Duo', icon: '🤝', angle: 320 }
  ];

  const renderRadialItem = (
    item: RadialMenuItem | God | Boon | Weapon | WeaponAspect | Pet | AvailableBoon,
    index: number,
    total: number,
    radius: number = 150
  ) => {
    const angle = (index * (360 / total) - 90 + rotation) * (Math.PI / 180);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const isHovered = hoveredItem === index;

    // Check if this is a special boon with availability status
    const isSpecialBoon = (item as any)?.hasOwnProperty?.('isAvailable');
    const isAvailable = isSpecialBoon ? (item as AvailableBoon).isAvailable : true;

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

    // Get tooltip text for locked boons
    const getTooltipText = (): string => {
      const baseName = getName(item);
      if (isSpecialBoon && !isAvailable) {
        const availableBoon = item as AvailableBoon;
        if (availableBoon.type === 'Duo' && availableBoon.firstGod && availableBoon.secondGod) {
          return `${baseName} (Locked: Need boons from ${availableBoon.firstGod.name} and ${availableBoon.secondGod.name})`;
        } else if (availableBoon.type === 'Legendary' && availableBoon.god) {
          return `${baseName} (Locked: Need multiple boons from ${availableBoon.god.name})`;
        }
        return `${baseName} (Prerequisites not met)`;
      }
      return baseName;
    };

    return (
      <div
        key={`${getName(item)}-${index}`}
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer
          ${isHovered ? 'scale-125 z-20' : 'scale-100 z-10'}
          ${!isAvailable ? 'opacity-60 grayscale' : ''}`}
        style={{
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
        }}
        onMouseEnter={() => setHoveredItem(index)}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => handleItemClick(item)}
        title={getTooltipText()}
      >
        <div className={`
          relative w-20 h-20 rounded-full flex items-center justify-center
          bg-gradient-to-br from-purple-600/90 to-blue-600/90
          border-2 ${isHovered ? 'border-yellow-400' : isAvailable ? 'border-purple-300' : 'border-gray-500'}
          shadow-xl backdrop-blur-sm
          ${isHovered ? 'shadow-yellow-400/50' : 'shadow-purple-500/30'}
          transform transition-all duration-300
        `}>
          {getIcon(item).startsWith('http') || getIcon(item).startsWith('/') ? (
            <ImageWithFallback
              src={getIcon(item)}
              alt={getName(item)}
              className="w-12 h-12 rounded-full object-cover"
              fallbackIcon={getName(item).charAt(0)}
            />
          ) : (
            <span className="text-2xl">{getIcon(item)}</span>
          )}

          {/* Lock badge overlay for locked boons */}
          {isSpecialBoon && !isAvailable && (
            <div className="absolute -top-1 -right-1 bg-gray-900/90 text-yellow-300 text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-yellow-500/50">
              <span>🔒</span>
            </div>
          )}
        </div>
        {isHovered && (
          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2
            bg-gray-900/95 text-white px-3 py-1 rounded-lg whitespace-nowrap text-sm
            border border-purple-400 shadow-lg z-30 max-w-xs text-center">
            {getTooltipText()}
          </div>
        )}
      </div>
    );
  };

  const handleItemClick = (item: RadialMenuItem | God | Boon | Weapon | WeaponAspect | Pet | AvailableBoon) => {
    if (menuState === 'main') {
      // Handle slot selection
      const slotItem = item as RadialMenuItem;
      if (slotItem.id === 'weapon') {
        setMenuState('weapon');
      } else if (slotItem.id === 'pet') {
        setMenuState('pet');
      } else if (slotItem.id === 'legendary') {
        setMenuState('legendary');
      } else if (slotItem.id === 'duo') {
        setMenuState('duo');
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
    } else if (menuState === 'legendary') {
      // Handle legendary boon selection
      const legendaryBoon = item as AvailableBoon;
      onSelectLegendaryBoon(legendaryBoon);
      setMenuState('main');
    } else if (menuState === 'duo') {
      // Handle duo boon selection
      const duoBoon = item as AvailableBoon;
      onSelectDuoBoon(duoBoon);
      setMenuState('main');
    } else if (menuState === 'pet') {
      // Handle pet selection
      const pet = item as Pet;
      onSelectPet(pet);
      setMenuState('main');
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
              } else if (menuState === 'weapon' || menuState === 'legendary' || menuState === 'duo') {
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
      case 'pet':
        return pets;
      case 'legendary':
        return availableLegendaryBoons;
      case 'duo':
        return availableDuoBoons;
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
        {menuState === 'legendary' && 'Select Legendary Boon'}
        {menuState === 'duo' && 'Select Duo Boon'}
        {menuState === 'god' && `Select God for ${selectedSlot !== null ? BoonSlot[selectedSlot] : ''}`}
        {menuState === 'boon' && `Select ${selectedGod?.name} Boon`}
      </div>
    </div>
  );
};

export default RadialMenu;