/**
 * BuildControlsPanel - Build Creation and Management Controls
 *
 * Provides interface for:
 * - Build name and description
 * - Favorites toggle
 * - Tier and difficulty selection
 * - Save/publish actions
 */

import React from 'react';
import { Star, Save, Share2 } from 'lucide-react';
import { BuildDifficulty, BuildTier } from '../types';

interface BuildControlsPanelProps {
  buildName: string;
  buildDescription: string;
  isFavorite: boolean;
  difficulty?: BuildDifficulty;
  tier?: BuildTier;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onFavoriteToggle: () => void;
  onDifficultyChange: (difficulty: BuildDifficulty) => void;
  onTierChange: (tier: BuildTier) => void;
  onSave: () => void;
  onShare?: () => void;
}

const difficultyLabels: Record<BuildDifficulty, string> = {
  [BuildDifficulty.Easy]: 'Easy',
  [BuildDifficulty.Medium]: 'Medium',
  [BuildDifficulty.Hard]: 'Hard',
  [BuildDifficulty.Expert]: 'Expert'
};

const tierLabels: Record<BuildTier, string> = {
  [BuildTier.S]: 'S',
  [BuildTier.A]: 'A',
  [BuildTier.B]: 'B',
  [BuildTier.C]: 'C',
  [BuildTier.D]: 'D'
};

const BuildControlsPanel: React.FC<BuildControlsPanelProps> = ({
  buildName,
  buildDescription,
  isFavorite,
  difficulty,
  tier,
  onNameChange,
  onDescriptionChange,
  onFavoriteToggle,
  onDifficultyChange,
  onTierChange,
  onSave,
  onShare
}) => {
  return (
    <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/50 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <div className="flex-1"></div>
        <h3 className="text-lg font-semibold text-purple-300">Build Details</h3>
        <div className="flex-1 flex justify-end">
          <button
            onClick={onFavoriteToggle}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite
                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                : 'bg-gray-700/30 text-gray-400 hover:bg-gray-600/40'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Build Name */}
      <div className="mb-3">
        <label className="block text-xs text-gray-400 mb-1">Build Name</label>
        <input
          type="text"
          placeholder="Enter build name..."
          value={buildName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700/50 rounded border border-gray-600/50
            focus:border-purple-500 focus:outline-none text-white text-sm
            placeholder-gray-500"
        />
      </div>

      {/* Build Description */}
      <div className="mb-3">
        <div className="flex items-center mb-1">
          <div className="flex-1"></div>
          <label className="text-xs text-gray-400">Description</label>
          <div className="flex-1 flex justify-end">
            <span className={`text-xs ${buildDescription.length >= 300 ? 'text-yellow-400' : 'text-gray-500'}`}>
              {buildDescription.length}/300
            </span>
          </div>
        </div>
        <textarea
          placeholder="Describe your build strategy..."
          rows={6}
          value={buildDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          maxLength={300}
          className="w-full px-3 py-2 bg-gray-700/50 rounded border border-gray-600/50
            focus:border-purple-500 focus:outline-none text-white text-sm resize-none
            placeholder-gray-500"
        />
      </div>

      {/* Tier and Difficulty Selectors */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Tier Selector */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Tier</label>
          <div className="flex gap-1">
            {Object.entries(tierLabels).map(([value, label]) => (
              <button
                key={value}
                onClick={() => onTierChange(Number(value) as BuildTier)}
                className={`flex-1 py-1.5 rounded text-sm font-semibold transition-colors ${
                  tier === Number(value)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selector */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(Number(e.target.value) as BuildDifficulty)}
            className="w-full px-2 py-1.5 bg-gray-700/50 rounded border border-gray-600/50
              focus:border-purple-500 focus:outline-none text-white text-sm"
          >
            {Object.entries(difficultyLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2
            bg-gradient-to-r from-purple-600 to-blue-600
            hover:from-purple-700 hover:to-blue-700
            rounded-lg font-semibold text-sm transition-all shadow-lg"
        >
          <Save className="w-4 h-4" />
          Save Build
        </button>
        {onShare && (
          <button
            onClick={onShare}
            className="px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50
              rounded-lg transition-colors"
            title="Share build"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Core Boons:</span>
            <span className="text-gray-400">0/5</span>
          </div>
          <div className="flex justify-between">
            <span>Special Boons:</span>
            <span className="text-gray-400">0 selected</span>
          </div>
          <div className="flex justify-between">
            <span>Build Status:</span>
            <span className="text-yellow-400">Incomplete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildControlsPanel;
