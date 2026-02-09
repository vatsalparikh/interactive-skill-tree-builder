/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import './index.css';
import Widget, { configuration, component, journey } from '@forgerock/login-widget';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app.tsx';

const myConfig = configuration();
myConfig.set({
  forgerock: {
    serverConfig: {
      baseUrl: 'https://openam-sdks.forgeblocks.com/am/',
      timeout: 3000,
    },
    clientId: 'ForgeRockSDKClient',
    realmPath: 'alpha',
    redirectUri: window.location.href,
    scope: 'openid profile',
  },
});


// Instantiate the ForgeRock Login Widget and mount to #widget-root

const widgetRootEl = document.getElementById('widget-root');
let componentEvents: ReturnType<typeof component> | null = null;
if (widgetRootEl) {
  new Widget({
    target: widgetRootEl,
  });
  // Initialize component API for modal control
  componentEvents = component();
  // Open the modal on app load
  componentEvents.open();

  // Start the default journey so the modal displays the login form
  const journeyEvents = journey();
  journeyEvents.start();
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
