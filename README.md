# Wavyboard - Music Streaming Platform

Wavyboard is a modern music streaming platform built with React, Supabase, and Vite. It allows users to discover, play, and organize their favorite music.

## Features

- 🎵 **Music Streaming**: Play your favorite songs with a beautiful audio player
- 🔍 **Advanced Search**: Search songs by title, artist, or genre
- 📚 **Library Management**: Create and manage custom playlists
- 🎨 **Modern UI**: Clean and responsive design with dark theme
- 🔊 **Text-to-Speech**: Convert text to speech using VoiceRSS API
- 🔒 **User Authentication**: Secure login and registration
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account
- VoiceRSS API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/anuvind-ap/Wavyboard_react.git
cd Wavyboard_react
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_VOICERSS_API_KEY=your_voicerss_api_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# VoiceRSS API Configuration
VITE_VOICERSS_API_KEY=your_voicerss_api_key
```

## Project Structure

```
Wavyboard_react/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   │   ├── layout/     # Layout components
│   │   ├── pages/      # Page components
│   │   └── shared/     # Shared components
│   ├── context/        # React context providers
│   ├── lib/            # Utility functions and configurations
│   ├── styles/         # Global styles
│   └── App.jsx         # Main application component
├── index.html          # HTML template
├── package.json        # Project dependencies
└── vite.config.js      # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Features in Detail

### Music Player
- Custom audio player with play/pause controls
- Progress bar with time display
- Volume control
- Next/Previous track navigation

### Search Functionality
- Search by title, artist, or genre
- Real-time search results
- Genre filtering
- Responsive search interface

### Library Management
- Create and manage playlists
- Add/remove songs from playlists
- Organize music by genre
- Favorite songs functionality

### Text-to-Speech
- Convert text to speech
- Multiple language support
- Customizable voice settings
- Download audio files

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.io/)
- [VoiceRSS](https://www.voicerss.org/)
- [React Icons](https://react-icons.github.io/react-icons/)
