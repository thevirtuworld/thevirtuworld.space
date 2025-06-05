"use client";

import { useState, useEffect } from 'react';
import { aiService } from '../../services/AIService';

interface AISettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AISettings: React.FC<AISettingsProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    provider: 'local',
    apiKey: '',
    model: 'gpt-3.5-turbo',
    baseURL: 'https://api.openai.com/v1'
  });

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isOpen) {
      const currentSettings = aiService.getCurrentSettings();
      setSettings(prev => ({ ...prev, ...currentSettings }));
    }
  }, [isOpen]);

  const handleSave = () => {
    aiService.updateProvider(
      settings.provider,
      settings.apiKey,
      settings.model,
      settings.baseURL
    );
    onClose();
  };

  const handleTest = async () => {
    if (settings.provider === 'local') {
      setTestStatus('success');
      return;
    }

    setTestStatus('testing');
    
    try {
      // Create a temporary AI service to test the connection
      const testEntity = {
        id: 'test',
        health: 50,
        food: 30,
        wood: 10,
        stone: 5,
        level: 1,
        aiPersonality: { aggression: 0.5, cooperation: 0.5, exploration: 0.5, efficiency: 0.5 }
      };
      
      const testContext = {
        weather: 'sunny',
        season: 'spring',
        nearbyEntities: 0,
        availableResources: 'food(50)',
        timeOfDay: 'morning',
        generation: 1,
        totalEntities: 1
      };

      // Test the API with current settings
      aiService.updateProvider(settings.provider, settings.apiKey, settings.model, settings.baseURL);
      const result = await aiService.generateEntityDecision(testEntity, testContext);
      
      if (result && result.action) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch (error) {
      console.error('AI test failed:', error);
      setTestStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">AI Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              AI Provider
            </label>
            <select
              value={settings.provider}
              onChange={(e) => setSettings(prev => ({ ...prev, provider: e.target.value }))}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="local">Local AI (Built-in)</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>

          {settings.provider === 'openai' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="sk-..."
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Your API key is stored locally in your browser
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Model
                </label>
                <select
                  value={settings.model}
                  onChange={(e) => setSettings(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Base URL (Optional)
                </label>
                <input
                  type="text"
                  value={settings.baseURL}
                  onChange={(e) => setSettings(prev => ({ ...prev, baseURL: e.target.value }))}
                  placeholder="https://api.openai.com/v1"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  For custom endpoints or proxy servers
                </p>
              </div>
            </>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleTest}
              disabled={testStatus === 'testing'}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded transition-colors"
            >
              {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </button>
            
            {testStatus === 'success' && (
              <div className="flex items-center text-green-400">
                ✓ Working
              </div>
            )}
            
            {testStatus === 'error' && (
              <div className="flex items-center text-red-400">
                ✗ Failed
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4 border-t border-gray-600">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 px-4 bg-primary hover:bg-primary/80 text-white rounded transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-700 rounded text-sm text-gray-300">
          <strong>Local AI:</strong> Fast, reliable rule-based decisions.<br/>
          <strong>External AI:</strong> More creative and contextual decisions using your API key.
        </div>
      </div>
    </div>
  );
};

export default AISettings;
