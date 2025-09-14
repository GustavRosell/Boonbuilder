import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Home, BookOpen, Hammer, Users, Heart, LogIn, X } from 'lucide-react';

// Types
interface God {
  godId: number;
  name: string;
  iconUrl: string;
  primaryElement: string;
  secondaryElement?: string;
  statusEffect: string;
}

interface Boon {
  boonId: number;
  name: string;
  type: string;
  slot?: string;
  description: string;
  effect: string;
  iconUrl: string;
  element?: string;
  statusEffect?: string;
  god?: God;
}

interface Weapon {
  weaponId: number;
  type: string;
  name: string;
  iconUrl: string;
  description: string;
  aspects: WeaponAspect[];
}

interface WeaponAspect {
  aspectId: number;
  name: string;
  iconUrl: string;
  description: string;
  isHidden: boolean;
}

interface Build {
  weapon?: Weapon;
  aspect?: WeaponAspect;
  boons: Map<string, Boon>;
}

// Radial Menu Component - The Magic Happens Here!
const RadialMenu: React.FC<{
  onSelectBoon: (boon: Boon) => void;
  selectedBoons: Map<string, Boon>;
}> = ({ onSelectBoon, selectedBoons }) => {
  const [menuState, setMenuState] = useState<'main' | 'weapon' | 'god' | 'boon'>('main');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedGod, setSelectedGod] = useState<God | null>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock data - would come from API
  const slots = [
    { id: 'weapon', name: 'Weapon', icon: '⚔️', angle: 0 },
    { id: 'attack', name: 'Attack', icon: '⚡', angle: 60 },
    { id: 'special', name: 'Special', icon: '✨', angle: 120 },
    { id: 'cast', name: 'Cast', icon: '🔮', angle: 180 },
    { id: 'sprint', name: 'Sprint', icon: '💨', angle: 240 },
    { id: 'magick', name: 'Magick', icon: '💫', angle: 300 }
  ];

  const gods: God[] = [
    { godId: 1, name: 'Aphrodite', iconUrl: '/api/placeholder/60/60', primaryElement: 'Air', statusEffect: 'Weak' },
    { godId: 2, name: 'Apollo', iconUrl: '/api/placeholder/60/60', primaryElement: 'Air', statusEffect: 'Daze' },
    { godId: 3, name: 'Ares', iconUrl: '/api/placeholder/60/60', primaryElement: 'Fire', statusEffect: 'Wounds' },
    { godId: 4, name: 'Demeter', iconUrl: '/api/placeholder/60/60', primaryElement: 'Earth', statusEffect: 'Freeze' },
    { godId: 5, name: 'Hephaestus', iconUrl: '/api/placeholder/60/60', primaryElement: 'Earth', statusEffect: 'Glow' },
    { godId: 6, name: 'Hera', iconUrl: '/api/placeholder/60/60', primaryElement: 'Earth', statusEffect: 'Hitch' },
    { godId: 7, name: 'Hestia', iconUrl: '/api/placeholder/60/60', primaryElement: 'Fire', statusEffect: 'Scorch' },
    { godId: 8, name: 'Poseidon', iconUrl: '/api/placeholder/60/60', primaryElement: 'Water', statusEffect: 'Slip' },
    { godId: 9, name: 'Zeus', iconUrl: '/api/placeholder/60/60', primaryElement: 'Air', statusEffect: 'Blitz' }
  ];

  const renderRadialItem = (item: any, index: number, total: number, radius: number = 150) => {
    const angle = (index * (360 / total) - 90 + rotation) * (Math.PI / 180);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const isHovered = hoveredItem === index;
    
    return (
      <div
        key={item.id || item.godId || index}
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
          {item.iconUrl ? (
            <img src={item.iconUrl} alt={item.name} className="w-12 h-12 rounded-full" />
          ) : (
            <span className="text-2xl">{item.icon}</span>
          )}
        </div>
        {isHovered && (
          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 
            bg-gray-900/95 text-white px-3 py-1 rounded-lg whitespace-nowrap text-sm
            border border-purple-400 shadow-lg">
            {item.name}
          </div>
        )}
      </div>
    );
  };

  const handleItemClick = (item: any) => {
    if (menuState === 'main') {
      if (item.id === 'weapon') {
        setMenuState('weapon');
      } else {
        setSelectedSlot(item.id);
        setMenuState('god');
      }
    } else if (menuState === 'god') {
      setSelectedGod(item);
      setMenuState('boon');
    }
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

  const renderParticles = () => {
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const particles: any[] = [];
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
    
    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
  };

  return (
    <div className="relative w-[600px] h-[600px] bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-full">
      {renderParticles()}
      
      <div className="absolute inset-4 rounded-full border-2 border-purple-500/30 animate-pulse" />
      <div className="absolute inset-8 rounded-full border border-purple-400/20" />
      <div className="absolute inset-12 rounded-full border border-purple-300/10" />
      
      {menuState === 'main' && slots.map((slot, i) => renderRadialItem(slot, i, slots.length))}
      {menuState === 'god' && gods.map((god, i) => renderRadialItem(god, i, gods.length))}
      
      {renderCenterButton()}
    </div>
  );
};

// Main App Component
export default function BoonBuilder() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedBuild, setSelectedBuild] = useState<Build>({
    boons: new Map()
  });
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start minimized

  const handleSelectBoon = (boon: Boon) => {
    if (boon.slot) {
      const newBoons = new Map(selectedBuild.boons);
      newBoons.set(boon.slot, boon);
      setSelectedBuild({ ...selectedBuild, boons: newBoons });
    }
  };

  const renderLoadout = () => {
    const slots = ['attack', 'special', 'cast', 'sprint', 'magick'];
    
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-purple-500/30 h-full flex flex-col">
        <h3 className="text-xl font-bold text-purple-300 mb-4">Current Loadout</h3>
        <div className="space-y-3 flex-1 overflow-y-auto">
          {slots.map(slot => {
            const boon = selectedBuild.boons.get(slot);
            return (
              <div key={slot} className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                  {boon ? (
                    <img src={boon.iconUrl} alt={boon.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <span className="text-gray-400">?</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-400 capitalize">{slot}</div>
                  <div className="text-white font-medium">
                    {boon ? boon.name : 'Empty Slot'}
                  </div>
                </div>
                {boon && (
                  <button
                    onClick={() => {
                      const newBoons = new Map(selectedBuild.boons);
                      newBoons.delete(slot);
                      setSelectedBuild({ ...selectedBuild, boons: newBoons });
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="text-lg font-semibold text-purple-300 mb-3">Build Details</h4>
          <input
            type="text"
            placeholder="Build Name"
            className="w-full px-4 py-2 bg-gray-700/50 rounded-lg border border-purple-500/30 
              focus:border-purple-400 focus:outline-none mb-3"
          />
          <textarea
            placeholder="Build Description"
            rows={3}
            className="w-full px-4 py-2 bg-gray-700/50 rounded-lg border border-purple-500/30 
              focus:border-purple-400 focus:outline-none mb-3"
          />
          <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 
            hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition-all">
            Save Build
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 text-white">
      {/* Sidebar Navigation - Minimizable */}
      <div className={`fixed left-0 top-0 h-full bg-gray-800/95 backdrop-blur-sm border-r border-purple-500/30 
        transition-all duration-300 z-40 ${sidebarOpen ? 'w-[250px]' : 'w-[60px]'}`}>
        
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-6 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center
            hover:bg-purple-700 transition-colors"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        
        <div className="p-4">
          {sidebarOpen ? (
            <>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                BoonBuilder
              </h1>
              <p className="text-sm text-gray-400 mt-1">Hades II Build Creator</p>
            </>
          ) : (
            <div className="text-center text-purple-400 font-bold text-xl">BB</div>
          )}
        </div>
        
        <nav className="px-2 mt-4">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'browse', label: 'Browse', icon: BookOpen },
            { id: 'creator', label: 'Creator', icon: Hammer },
            { id: 'community', label: 'Community', icon: Users },
            { id: 'favorites', label: 'Favorites', icon: Heart }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} 
                px-3 py-3 rounded-lg mb-2 transition-colors
                ${currentPage === item.id 
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50' 
                  : 'hover:bg-gray-700/50 text-gray-300'}`}
              title={!sidebarOpen ? item.label : ''}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 
              bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-[60px]'}`}>
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-purple-500/30 px-6 py-4">
          <h2 className="text-xl font-semibold">
            {currentPage === 'creator' ? 'Build Creator' : 
             currentPage === 'browse' ? 'Browse Builds' :
             currentPage === 'community' ? 'Community Builds' :
             currentPage === 'favorites' ? 'Favorite Builds' : 'Welcome to BoonBuilder'}
          </h2>
        </header>
        
        <main className="p-6">
          {currentPage === 'creator' ? (
            <div className="flex gap-6 h-[calc(100vh-8rem)]">
              {/* Left side - Radial Menu */}
              <div className="flex-1 flex items-center justify-center bg-gray-800/30 rounded-xl p-4">
                <RadialMenu onSelectBoon={handleSelectBoon} selectedBoons={selectedBuild.boons} />
              </div>
              
              {/* Right side - Loadout */}
              <div className="w-[400px]">
                {renderLoadout()}
              </div>
            </div>
          ) : currentPage === 'home' ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-8 border border-purple-500/30">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Welcome to BoonBuilder
                </h1>
                <p className="text-lg text-gray-300 mb-6">
                  Create, share, and discover the best builds for Hades II. 
                  Master the divine powers and forge your path through the Underworld.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
                    <Hammer className="w-12 h-12 text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Build Creator</h3>
                    <p className="text-gray-400">Craft your perfect build with our intuitive radial menu system</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
                    <BookOpen className="w-12 h-12 text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Browse Builds</h3>
                    <p className="text-gray-400">Explore top-rated builds from S-tier to experimental</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
                    <Users className="w-12 h-12 text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Community</h3>
                    <p className="text-gray-400">Share your creations and learn from other players</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-purple-500/30">
                <p className="text-center text-gray-400">
                  {currentPage === 'browse' ? 'Build browser coming soon...' :
                   currentPage === 'community' ? 'Community builds coming soon...' :
                   currentPage === 'favorites' ? 'Favorite builds coming soon...' :
                   'Page under construction...'}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}