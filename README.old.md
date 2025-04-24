# Focus With Me

A modern pomodoro timer web application that helps users maintain focus and productivity through customizable study sessions with ambient background music.

## Features

- **Customizable Timer Sessions**
  - Set focus duration (default: 25 minutes)
  - Set break duration (default: 5 minutes)
  - Configure total study hours (1-4 hours)

- **Smart Session Management**
  - Automatic transitions between focus and break periods
  - Session progress tracking
  - Option to postpone breaks
  - "I'm here" confirmation after breaks

- **Ambiance Options**
  - Multiple pre-set vibes with unique themes
  - Custom YouTube integration for personalized background music
  - Volume control and playback options
  - "Lights off" mode for distraction-free focusing

- **Visual Feedback**
  - Progress bar for current session
  - Visual theme changes based on selected vibe
  - Clear indicators for focus/break states

## Development Roadmap

### Phase 1: Core Timer Functionality
- Basic timer implementation with study/break cycles
- Session tracking and progress visualization
- Settings panel for duration customization

### Phase 2: YouTube/Vibe Integration
- Predefined vibe selections
- YouTube player integration
- Theme switching based on selected vibe

### Phase 3: User Experience Enhancements
- Notifications
- "Lights off" mode
- Break management (postpone, "I'm here" button)
- Visual feedback for timer states

### Phase 4: Persistence & Polish
- Local storage for user settings
- Mobile optimization
- PWA capabilities
- UI polish and animations

## Tech Stack

- **Frontend Framework**: React.js
- **Styling**: Tailwind CSS
- **State Management**: React Context API / Redux
- **Media Integration**: YouTube iframe API
- **Animations**: Framer Motion
- **Deployment**: Netlify

## Best Practices

- **Performance**
  - Optimize timer accuracy with timestamp-based calculations
  - Implement code splitting and lazy loading
  - Minimize render cycles with proper memoization

- **User Experience**
  - Accessible design (WCAG AA compliance)
  - Responsive layout for all device sizes
  - Graceful error handling

- **Code Quality**
  - TypeScript for type safety
  - Component-based architecture
  - Comprehensive testing suite

## Development Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/focuswithme.git
cd focuswithme
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Build for production
```bash
npm run build
```

## Deployment

This project is configured for easy deployment to Netlify:

1. Connect your GitHub repository to Netlify
2. Set the build command to `npm run build`
3. Set the publish directory to `build`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 