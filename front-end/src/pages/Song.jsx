import React, { useState, useEffect } from "react";
import Player from "../components/Player";
import { Link, useParams } from "react-router-dom";
import { songsArray } from "../assets/database/songs";
import { artistArray } from "../assets/database/artists";
import { useNavigate } from "react-router-dom"; 

const Song = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 

  const [currentSong, setCurrentSong] = useState(
    songsArray.filter((song) => song._id === id)[0]
  );
  
  const { image, name, duration, artist, audio } = currentSong;
  
  const artistObj = artistArray.filter((artistObj) => artistObj.name === artist)[0];
  const songsArrayFromArtist = songsArray.filter((song) => song.artist === artist);
  
  const randomIndex = Math.floor(Math.random() * songsArrayFromArtist.length);
  const randomIndex2 = Math.floor(Math.random() * songsArrayFromArtist.length);
  
  const randomIdFromArtist = songsArrayFromArtist[randomIndex]._id;
  const randomId2FromArtist = songsArrayFromArtist[randomIndex2]._id;

  const goToNextSong = () => {
    const currentIndex = songsArrayFromArtist.findIndex(song => song._id === currentSong._id);
    const nextSong = songsArrayFromArtist[(currentIndex + 1) % songsArrayFromArtist.length];
    setCurrentSong(nextSong);
    navigate(`/song/${nextSong._id}`);  
  };

  const goToPreviousSong = () => {
    const currentIndex = songsArrayFromArtist.findIndex(song => song._id === currentSong._id);
    const prevSong = songsArrayFromArtist[(currentIndex - 1 + songsArrayFromArtist.length) % songsArrayFromArtist.length];
    setCurrentSong(prevSong);
    navigate(`/song/${prevSong._id}`); 
  };

  return (
    <div className="song">
      <div className="song__container">
        <div className="song__image-container">
          <img src={image} alt={`Imagem da música ${name}`} />
        </div>
      </div>

      <div className="song__bar">
        <Link to={`/artist/${artistObj._id}`} className="song__artist-image">
          <img
            width={75}
            height={75}
            src={artistObj.image}
            alt={`Imagem do Artista ${artist}`}
          />
        </Link>

        <Player
          duration={duration}
          randomIdFromArtist={randomIdFromArtist}
          randomId2FromArtist={randomId2FromArtist}
          audio={audio}
          goToNextSong={goToNextSong}  
          goToPreviousSong={goToPreviousSong} 
        />

        <div>
          <p className="song__name">{name}</p>
          <p>{artist}</p>
        </div>
      </div>
    </div>
  );
};

export default Song;
