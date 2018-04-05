import React from 'react';
import { configure } from '@storybook/react';

// Theming stylesheet to be used by Storybook for development

function loadStories() {
  require('glob-loader!./stories.pattern');
}

configure(loadstories, module);
