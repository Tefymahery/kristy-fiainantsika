import React from 'react';
import YouTube from 'react-youtube';

const VideoComponent = () => {
  const videoOptions = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1, // Lancer la vidéo automatiquement
    },
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Regardez cette vidéo !</h2>
      <YouTube
        videoId="fDBnN6pckIg" // Remplace VIDEO_ID par l'ID réel de la vidéo
        opts={videoOptions}
        onEnd={() => console.log('Vidéo terminée')}
      />
    </div>
  );
};

export default VideoComponent;
