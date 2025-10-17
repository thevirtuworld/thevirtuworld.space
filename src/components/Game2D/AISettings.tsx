"use client";

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
  Stack,
  IconButton,
  Alert,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
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

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>AI Settings</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>AI Provider</InputLabel>
            <Select
              value={settings.provider}
              onChange={(e) => setSettings(prev => ({ ...prev, provider: e.target.value }))}
              label="AI Provider"
            >
              <MenuItem value="local">Local AI (Built-in)</MenuItem>
              <MenuItem value="openai">OpenAI</MenuItem>
            </Select>
          </FormControl>

          {settings.provider === 'openai' && (
            <>
              <Box>
                <TextField
                  fullWidth
                  type="password"
                  label="API Key"
                  value={settings.apiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="sk-..."
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                  Your API key is stored locally in your browser
                </Typography>
              </Box>

              <FormControl fullWidth>
                <InputLabel>Model</InputLabel>
                <Select
                  value={settings.model}
                  onChange={(e) => setSettings(prev => ({ ...prev, model: e.target.value }))}
                  label="Model"
                >
                  <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                  <MenuItem value="gpt-4">GPT-4</MenuItem>
                  <MenuItem value="gpt-4-turbo">GPT-4 Turbo</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <TextField
                  fullWidth
                  label="Base URL (Optional)"
                  value={settings.baseURL}
                  onChange={(e) => setSettings(prev => ({ ...prev, baseURL: e.target.value }))}
                  placeholder="https://api.openai.com/v1"
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                  For custom endpoints or proxy servers
                </Typography>
              </Box>
            </>
          )}

          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              onClick={handleTest}
              disabled={testStatus === 'testing'}
              variant="contained"
              fullWidth
            >
              {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </Button>
            
            {testStatus === 'success' && (
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'success.main' }}>
                <CheckCircleIcon fontSize="small" />
                <Typography variant="body2">Working</Typography>
              </Stack>
            )}
            
            {testStatus === 'error' && (
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'error.main' }}>
                <ErrorIcon fontSize="small" />
                <Typography variant="body2">Failed</Typography>
              </Stack>
            )}
          </Stack>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Local AI:</strong> Fast, reliable rule-based decisions.<br/>
              <strong>External AI:</strong> More creative and contextual decisions using your API key.
            </Typography>
          </Alert>
        </Stack>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AISettings;
