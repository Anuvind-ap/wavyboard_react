import React from 'react';
import TextToSpeech from '../components/main/TextToSpeech';
import AudioLibrary from '../components/main/AudioLibrary';

const Home = () => {
  return (
    <div className="home-page">
      <TextToSpeech />
      <AudioLibrary />
    </div>
  );
};

export default Home; 