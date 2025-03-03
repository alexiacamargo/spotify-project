import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlay,
  faCirclePause,
  faBackwardStep,
  faForwardStep,
} from "@fortawesome/free-solid-svg-icons";

const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(timeInSeconds - minutes * 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
};

const timeInSeconds = (timeString) => {
  const splitArray = timeString.split(":");
  const minutes = Number(splitArray[0]);
  const seconds = Number(splitArray[1]);

  return seconds + minutes * 60;
};

const Player = ({ duration, audio, goToNextSong, goToPreviousSong }) => {
  const audioPlayer = useRef();
  const progressBar = useRef();
  const progressBarContainer = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(formatTime(0)); 
  const [ballPosition, setBallPosition] = useState(0); 
  const [isDragging, setIsDragging] = useState(false);
  const durationInSeconds = timeInSeconds(duration);

  const playPause = () => {
    if (isPlaying) {
      audioPlayer.current.pause();
    } else {
      audioPlayer.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    const rect = progressBarContainer.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = Math.max(0, (clickX / rect.width) * durationInSeconds); 
    audioPlayer.current.currentTime = newTime;
    setCurrentTime(formatTime(newTime));
    setBallPosition((newTime / durationInSeconds) * 100);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    audioPlayer.current.pause();
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      e.preventDefault();
      const rect = progressBarContainer.current.getBoundingClientRect();
      const moveX = e.clientX - rect.left;
      const newPosition = Math.max(0, Math.min((moveX / rect.width) * 100, 100)); 
      setBallPosition(newPosition);
    }
  };

  const handleMouseUp = (e) => {
    if (isDragging) {
      e.preventDefault();
      setIsDragging(false);
      const rect = progressBarContainer.current.getBoundingClientRect();
      const moveX = e.clientX - rect.left;
      const newTime = Math.max(0, (moveX / rect.width) * durationInSeconds); 
      audioPlayer.current.currentTime = newTime;
      setCurrentTime(formatTime(newTime));
      audioPlayer.current.play();
    }
  };

  useEffect(() => {
    const updateProgress = () => {
      if (!isDragging) {
        const current = audioPlayer.current.currentTime;
        setCurrentTime(formatTime(current));
        setBallPosition((current / durationInSeconds) * 100);
      }
    };

    const intervalId = setInterval(updateProgress, 1000);

    return () => clearInterval(intervalId);
  }, [isDragging, durationInSeconds]);

  useEffect(() => {
    if (audioPlayer.current) {
      audioPlayer.current.play();
      setIsPlaying(true);
    }

    const handleEnded = () => {
      goToNextSong();
    };

    const currentAudioPlayer = audioPlayer.current;
    currentAudioPlayer.addEventListener("ended", handleEnded);

    return () => {
      currentAudioPlayer.removeEventListener("ended", handleEnded);
    };
  }, [audio, goToNextSong]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="player">
      <div className="player__controllers">
        <FontAwesomeIcon
          className="player__icon"
          icon={faBackwardStep}
          onClick={goToPreviousSong}
        />
        <FontAwesomeIcon
          className="player__icon player__icon--play"
          icon={isPlaying ? faCirclePause : faCirclePlay}
          onClick={playPause}
        />
        <FontAwesomeIcon
          className="player__icon"
          icon={faForwardStep}
          onClick={goToNextSong}
        />
      </div>
      <div
        className="player__progress"
        ref={progressBarContainer}
        onClick={handleProgressClick}
      >
        <p>{currentTime}</p>
        <div className="player__bar">
          <div
            ref={progressBar}
            className="player__bar-progress"
            style={{ width: `${ballPosition}%` }}
          ></div>
          <div
            className="player__ball"
            style={{
              left: `${ballPosition}%`,
              cursor: isDragging ? "grabbing" : "pointer",
            }}
            onMouseDown={handleMouseDown}
          ></div>
        </div>
        <p>{formatTime(durationInSeconds)}</p>
      </div>
      <audio ref={audioPlayer} src={audio} />
    </div>
  );
};

export default Player;
