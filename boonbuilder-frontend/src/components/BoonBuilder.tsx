import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home, BookOpen, Hammer, Users, Heart, LogIn, X } from 'lucide-react';
import RadialMenu from './RadialMenu';
import { God, Boon, BoonSlot, BuildState, Weapon, WeaponAspect, AvailableBoon, AvailableBoonsResponse } from '../types';
import { godsApi, boonsApi, weaponsApi } from '../services/api';
import { extractSelectedBoonIds, filterAvailableBoons, calculateBuildCompletion, validateBuild } from '../utils/boonPrerequisites';

type PageType = 'home' | 'browse' | 'creator' | 'community' | 'favorites';

const BoonBuilder: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState<BuildState>({
    boons: new Map(),
    duoBoons: [],
    legendaryBoons: [],
    name: '',
    description: ''
  });

  // Data from API
  const [gods, setGods] = useState<God[]>([]);
  const [boons, setBoons] = useState<Boon[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [availableDuoBoons, setAvailableDuoBoons] = useState<AvailableBoon[]>([]);
  const [availableLegendaryBoons, setAvailableLegendaryBoons] = useState<AvailableBoon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [godsData, boonsData, weaponsData] = await Promise.all([
          godsApi.getAll(),
          boonsApi.getAll(),
          weaponsApi.getAll()
        ]);

        setGods(godsData);
        setBoons(boonsData);
        setWeapons(weaponsData);
      } catch (err) {
        setError('Failed to load data. Please check if the API server is running.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelectBoon = (boon: Boon, slot: BoonSlot) => {
    const newBoons = new Map(selectedBuild.boons);
    newBoons.set(slot, boon);
    setSelectedBuild({ ...selectedBuild, boons: newBoons });
  };

  const handleSelectWeapon = (weapon: Weapon, aspect: WeaponAspect) => {
    setSelectedBuild({ ...selectedBuild, weapon, aspect });
  };

  const handleRemoveBoon = (slot: BoonSlot) => {
    const newBoons = new Map(selectedBuild.boons);
    newBoons.delete(slot);
    setSelectedBuild({ ...selectedBuild, boons: newBoons });
  };

  const handleRemoveWeapon = () => {
    setSelectedBuild({ ...selectedBuild, weapon: undefined, aspect: undefined });
  };

  const handleSelectDuoBoon = (boon: AvailableBoon) => {
    const newDuoBoons = [...selectedBuild.duoBoons, boon];
    setSelectedBuild({ ...selectedBuild, duoBoons: newDuoBoons });
  };

  const handleSelectLegendaryBoon = (boon: AvailableBoon) => {
    const newLegendaryBoons = [...selectedBuild.legendaryBoons, boon];
    setSelectedBuild({ ...selectedBuild, legendaryBoons: newLegendaryBoons });
  };

  const handleRemoveDuoBoon = (boonId: number) => {
    const newDuoBoons = selectedBuild.duoBoons.filter(boon => boon.boonId !== boonId);
    setSelectedBuild({ ...selectedBuild, duoBoons: newDuoBoons });
  };

  const handleRemoveLegendaryBoon = (boonId: number) => {
    const newLegendaryBoons = selectedBuild.legendaryBoons.filter(boon => boon.boonId !== boonId);
    setSelectedBuild({ ...selectedBuild, legendaryBoons: newLegendaryBoons });
  };

  // Update available boons when selections change
  useEffect(() => {
    const updateAvailableBoons = async () => {
      try {
        const selectedBoonIds = extractSelectedBoonIds(selectedBuild.boons);
        const availableBoonsResponse = await boonsApi.getAvailable(selectedBoonIds);
        const { availableDuo, availableLegendary, lockedDuo, lockedLegendary } = filterAvailableBoons(availableBoonsResponse);

        // Show both available and locked boons; available first for better UX
        const sortedDuo = [...availableDuo, ...lockedDuo];
        const sortedLegendary = [...availableLegendary, ...lockedLegendary];

        setAvailableDuoBoons(sortedDuo);
        setAvailableLegendaryBoons(sortedLegendary);
      } catch (err) {
        console.error('Error loading available boons:', err);
      }
    };

    if (selectedBuild.boons.size > 0) {
      updateAvailableBoons();
    } else {
      // When no boons selected, still show all boons but they'll all be marked as locked
      setAvailableDuoBoons([]);
      setAvailableLegendaryBoons([]);
    }
  }, [selectedBuild.boons]);

  const renderLoadout = () => {
    const slots = [
      { slot: BoonSlot.Attack, name: 'Attack', icon: '⚡' },
      { slot: BoonSlot.Special, name: 'Special', icon: '✨' },
      { slot: BoonSlot.Cast, name: 'Cast', icon: '🔮' },
      { slot: BoonSlot.Sprint, name: 'Sprint', icon: '💨' },
      { slot: BoonSlot.Magick, name: 'Magick', icon: '💫' }
    ];

    return (
      <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-purple-500/30 h-full flex flex-col">
        <h3 className="text-xl font-bold text-purple-300 mb-4">Current Loadout</h3>
        <div className="space-y-3 flex-1 overflow-y-auto">
          {/* Weapon Section */}
          <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg border-b border-gray-600">
            <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
              {selectedBuild.weapon ? (
                <img
                  src={selectedBuild.weapon.iconUrl}
                  alt={selectedBuild.weapon.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-lg">⚔️</span>
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-400">Weapon</div>
              <div className="text-white font-medium">
                {selectedBuild.weapon ? selectedBuild.weapon.name : 'No Weapon Selected'}
              </div>
              {selectedBuild.aspect && (
                <div className="text-xs text-purple-300">{selectedBuild.aspect.name}</div>
              )}
            </div>
            {selectedBuild.weapon && (
              <button
                onClick={handleRemoveWeapon}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {slots.map(({ slot, name, icon }) => {
            const boon = selectedBuild.boons.get(slot);
            return (
              <div key={slot} className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                  {boon ? (
                    <img
                      src={boon.iconUrl}
                      alt={boon.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-lg">{icon}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-400 capitalize">{name}</div>
                  <div className="text-white font-medium">
                    {boon ? boon.name : 'Empty Slot'}
                  </div>
                  {boon && boon.god && (
                    <div className="text-xs text-purple-300">{boon.god.name}</div>
                  )}
                </div>
                {boon && (
                  <button
                    onClick={() => handleRemoveBoon(slot)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Duo Boons Section */}
          {selectedBuild.duoBoons.length > 0 && (
            <>
              <div className="mt-4 pt-4 border-t border-gray-600">
                <h4 className="text-sm font-semibold text-yellow-300 mb-2">Duo Boons</h4>
                {selectedBuild.duoBoons.map((duoBoon) => (
                  <div key={duoBoon.boonId} className="flex items-center space-x-3 p-2 bg-yellow-900/20 rounded-lg mb-2">
                    <div className="w-10 h-10 rounded-full bg-yellow-600 flex items-center justify-center">
                      <img
                        src={duoBoon.iconUrl}
                        alt={duoBoon.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">{duoBoon.name}</div>
                      <div className="text-xs text-yellow-300">
                        {duoBoon.firstGod?.name} + {duoBoon.secondGod?.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!duoBoon.isAvailable && (
                        <span className="text-[10px] uppercase tracking-wide bg-gray-800 text-yellow-300 px-2 py-0.5 rounded border border-yellow-500/30">
                          Prereqs not met
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoveDuoBoon(duoBoon.boonId)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Legendary Boons Section */}
          {selectedBuild.legendaryBoons.length > 0 && (
            <>
              <div className="mt-4 pt-4 border-t border-gray-600">
                <h4 className="text-sm font-semibold text-orange-300 mb-2">Legendary Boons</h4>
                {selectedBuild.legendaryBoons.map((legendaryBoon) => (
                  <div key={legendaryBoon.boonId} className="flex items-center space-x-3 p-2 bg-orange-900/20 rounded-lg mb-2">
                    <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center">
                      <img
                        src={legendaryBoon.iconUrl}
                        alt={legendaryBoon.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-white font-medium text-sm">{legendaryBoon.name}</div>
                        {!legendaryBoon.isAvailable && (
                          <span className="px-2 py-0.5 bg-red-600/80 text-red-100 text-xs rounded-full">
                            Prereqs not met
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-orange-300">{legendaryBoon.god?.name}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveLegendaryBoon(legendaryBoon.boonId)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="text-lg font-semibold text-purple-300 mb-3">Build Details</h4>
          <input
            type="text"
            placeholder="Build Name"
            value={selectedBuild.name}
            onChange={(e) => setSelectedBuild({ ...selectedBuild, name: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700/50 rounded-lg border border-purple-500/30
              focus:border-purple-400 focus:outline-none mb-3 text-white"
          />
          <textarea
            placeholder="Build Description"
            rows={3}
            value={selectedBuild.description}
            onChange={(e) => setSelectedBuild({ ...selectedBuild, description: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700/50 rounded-lg border border-purple-500/30
              focus:border-purple-400 focus:outline-none mb-3 text-white resize-none"
          />
          <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600
            hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition-all">
            Save Build
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-xl">Loading BoonBuilder...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <p className="text-sm text-gray-400">Make sure the API server is running on https://localhost:7001</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 text-white">
      {/* Sidebar Navigation */}
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
            { id: 'home' as PageType, label: 'Home', icon: Home },
            { id: 'browse' as PageType, label: 'Browse', icon: BookOpen },
            { id: 'creator' as PageType, label: 'Creator', icon: Hammer },
            { id: 'community' as PageType, label: 'Community', icon: Users },
            { id: 'favorites' as PageType, label: 'Favorites', icon: Heart }
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
                <RadialMenu
                  gods={gods}
                  boons={boons}
                  weapons={weapons}
                  availableDuoBoons={availableDuoBoons}
                  availableLegendaryBoons={availableLegendaryBoons}
                  onSelectBoon={handleSelectBoon}
                  onSelectDuoBoon={handleSelectDuoBoon}
                  onSelectLegendaryBoon={handleSelectLegendaryBoon}
                  onSelectWeapon={handleSelectWeapon}
                  selectedBoons={selectedBuild.boons}
                  selectedDuoBoons={selectedBuild.duoBoons}
                  selectedLegendaryBoons={selectedBuild.legendaryBoons}
                  selectedWeapon={selectedBuild.weapon}
                  selectedAspect={selectedBuild.aspect}
                />
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
};

export default BoonBuilder;