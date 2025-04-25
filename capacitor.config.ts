
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b584236843744be5bbafbdd6733ec461',
  appName: 'friendly-split-sums',
  webDir: 'dist',
  server: {
    url: 'https://b5842368-4374-4be5-bbaf-bdd6733ec461.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always',
  },
  android: {
    backgroundColor: '#FFFFFF'
  }
};

export default config;
