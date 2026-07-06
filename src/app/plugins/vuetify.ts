import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'printLab',
    themes: {
      printLab: {
        dark: false,
        colors: {
          background: '#f4efe7',
          surface: '#fffaf1',
          primary: '#155f5b',
          secondary: '#d86f45',
          accent: '#f4bd4f',
          error: '#b42318',
          info: '#2f6f9f',
          success: '#287d4f',
          warning: '#b7791f',
        },
      },
    },
  },
});
