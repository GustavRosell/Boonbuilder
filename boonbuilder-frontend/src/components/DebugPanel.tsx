import React, { useState, useEffect } from 'react';
import { boonsApi } from '../services/api';
import { Boon, AvailableBoonsResponse } from '../types';
import ImageWithFallback from './ImageWithFallback';

const DebugPanel: React.FC = () => {
  const [allBoons, setAllBoons] = useState<Boon[]>([]);
  const [selectedBoonIds, setSelectedBoonIds] = useState<number[]>([]);
  const [availableBoons, setAvailableBoons] = useState<AvailableBoonsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all boons on mount
  useEffect(() => {
    const loadBoons = async () => {
      try {
        const boons = await boonsApi.getAll();
        console.log('All boons loaded:', boons);
        console.log('Sample boon structure:', boons[0]);
        console.log('Boon types found:', [...new Set(boons.map(b => b.type))]);
        setAllBoons(boons);
      } catch (err) {
        setError('Failed to load boons');
        console.error(err);
      }
    };
    loadBoons();
  }, []);

  // Test prerequisite checking
  const testPrerequisites = async () => {
    if (selectedBoonIds.length === 0) {
      setError('Please select at least one boon first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Testing with selected boon IDs:', selectedBoonIds);
      const response = await boonsApi.getAvailable(selectedBoonIds);
      console.log('API Response:', response);
      setAvailableBoons(response);
    } catch (err) {
      setError('Failed to check prerequisites: ' + (err as any).message);
      console.error('Prerequisites check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBoonSelection = (boonId: number) => {
    setSelectedBoonIds(prev =>
      prev.includes(boonId)
        ? prev.filter(id => id !== boonId)
        : [...prev, boonId]
    );
  };

  // Filter core boons only for selection (easier testing)
  // Handle API response format - check if BoonType.Core (0) works or if API returns different format
  const coreBoons = allBoons.filter(boon => {
    // Try direct enum comparison first
    if (boon.type === 0) return true; // BoonType.Core = 0

    // If API returns string format, handle it
    const typeAsAny = boon.type as any;
    if (typeof typeAsAny === 'string' && typeAsAny.toLowerCase() === 'core') return true;

    return false;
  });

  console.log('Filtering boons - Total:', allBoons.length, 'Core found:', coreBoons.length);
  console.log('Sample core boon:', coreBoons[0]);
  console.log('All boon types in dataset:', allBoons.map(b => ({ name: b.name, type: b.type })).slice(0, 5));

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Debug Panel - Duo Boon Prerequisites</h1>

      {error && (
        <div className="bg-red-600 p-4 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Core Boons Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Select Core Boons (Selected: {selectedBoonIds.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {coreBoons.map(boon => (
            <div
              key={boon.boonId}
              className={`p-3 rounded border-2 cursor-pointer transition-colors ${
                selectedBoonIds.includes(boon.boonId)
                  ? 'border-green-400 bg-green-900/30'
                  : 'border-gray-600 hover:border-gray-400'
              }`}
              onClick={() => toggleBoonSelection(boon.boonId)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded">
                  <ImageWithFallback
                    src={boon.iconUrl}
                    alt={boon.name}
                    className="w-full h-full rounded object-cover"
                    fallbackIcon="🌟"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{boon.name}</div>
                  <div className="text-xs text-gray-400">ID: {boon.boonId}</div>
                  <div className="text-xs text-purple-300">{boon.god?.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Button */}
      <div className="mb-8">
        <button
          onClick={testPrerequisites}
          disabled={loading || selectedBoonIds.length === 0}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-semibold transition-colors"
        >
          {loading ? 'Testing Prerequisites...' : 'Test Prerequisites'}
        </button>
      </div>

      {/* Results */}
      {availableBoons && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Results</h2>

          {/* Duo Boons */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-yellow-300">
              Duo Boons ({availableBoons.duoBoons.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableBoons.duoBoons.map(duo => (
                <div
                  key={duo.boonId}
                  className={`p-4 rounded border-2 ${
                    duo.isAvailable
                      ? 'border-green-400 bg-green-900/20'
                      : 'border-red-400 bg-red-900/20'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-12 h-12 rounded">
                      <ImageWithFallback
                        src={duo.iconUrl}
                        alt={duo.name}
                        className="w-full h-full rounded object-cover"
                        fallbackIcon="🤝"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{duo.name}</div>
                      <div className="text-sm text-gray-400">ID: {duo.boonId}</div>
                    </div>
                    <div className={`ml-auto px-2 py-1 rounded text-xs font-semibold ${
                      duo.isAvailable ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {duo.isAvailable ? 'AVAILABLE' : 'LOCKED'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    {duo.firstGod?.name} + {duo.secondGod?.name}
                  </div>
                  <div className="text-xs text-gray-400">{duo.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Legendary Boons */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-orange-300">
              Legendary Boons ({availableBoons.legendaryBoons.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableBoons.legendaryBoons.map(legendary => (
                <div
                  key={legendary.boonId}
                  className={`p-4 rounded border-2 ${
                    legendary.isAvailable
                      ? 'border-green-400 bg-green-900/20'
                      : 'border-red-400 bg-red-900/20'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-12 h-12 rounded">
                      <ImageWithFallback
                        src={legendary.iconUrl}
                        alt={legendary.name}
                        className="w-full h-full rounded object-cover"
                        fallbackIcon="⭐"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{legendary.name}</div>
                      <div className="text-sm text-gray-400">ID: {legendary.boonId}</div>
                    </div>
                    <div className={`ml-auto px-2 py-1 rounded text-xs font-semibold ${
                      legendary.isAvailable ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {legendary.isAvailable ? 'AVAILABLE' : 'LOCKED'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 mb-2">{legendary.god?.name}</div>
                  <div className="text-xs text-gray-400">{legendary.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-800 rounded">
        <h3 className="font-semibold mb-2">Debug Info</h3>
        <div className="text-xs space-y-1">
          <div>Total Boons Loaded: {allBoons.length}</div>
          <div>Core Boons: {coreBoons.length}</div>
          <div>Selected Boon IDs: [{selectedBoonIds.join(', ')}]</div>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;