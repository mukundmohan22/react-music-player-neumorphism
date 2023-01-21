import { useEffect, useRef, useState } from "react";
import "./App.css";
import { songs } from "./constant";

import { isNaN } from "lodash";

function App() {
  /**
   * Local State variable
   */
  const [currentSong, setCurrentSong] = useState(0);
  const [repeatSongs, setRepeatSongs] = useState(false);
  const [songName, setSongName] = useState("");
  const [songAuthor, setSongAuthor] = useState("");
  const [playerProgress, setPlayerProgress] = useState({ max: null, value: null });
  const [playerDuration, setPlayerDuration] = useState(null);
  const [playerCurrentTime, setPlayerCurrentTime] = useState(null);
  const [playerVolume, setPlayerVolume] = useState(1);

  /**
   * Reference for html tag
   */
  const btnPlayIcon = useRef(null);
  const audioPlayer = useRef(null);
  const btnRepeat = useRef(null);
  const btnVolumeIcon = useRef(null);

  /**
   * helper functions
   */

  const togglePlaySong = () => {
    if (audioPlayer.current.paused) {
      audioPlayer.current.play();
      btnPlayIcon.current.classList.replace("bi-play-fill", "bi-pause-fill");
    } else {
      audioPlayer.current.pause();
      btnPlayIcon.current.classList.replace("bi-pause-fill", "bi-play-fill");
    }
  };

  const changeSong = (next = true) => {
    let cSong = 0;
    if (next && currentSong < songs.length - 1) {
      cSong = currentSong + 1;
    } else if (!next && currentSong > 0) {
      cSong = currentSong - 1;
    } else {
      cSong = 0;
    }
    setCurrentSong(cSong);
    updatePlayer(cSong);
    togglePlaySong();
  };
  const updatePlayer = (currentSong) => {
    // debugger;
    const song = songs[currentSong];
    setSongName(song.name);
    setSongAuthor(song.author);
    audioPlayer.current.src = song.path;
    const { currentTime, duration } = audioPlayer.current;
    if (!isNaN(duration)) {
      setPlayerProgress({ max: duration, value: currentTime });
    }
  };

  const toggleRepeatSong = () => {
    btnRepeat.current.classList.toggle("btn-activated");
    setRepeatSongs(!repeatSongs);
  };

  const timeUpdate = () => {
    // debugger;
    const { currentTime, duration } = audioPlayer.current;
    if (!isNaN(duration)) {
      setPlayerDuration(formatSecondsToMinutes(duration));
      setPlayerCurrentTime(formatSecondsToMinutes(currentTime));
      setPlayerProgress({ max: duration, value: currentTime });
    }
  };

  const changeVolume = (e) => {
    const { value } = e.target;
    setPlayerVolume(value);
    audioPlayer.current.volume = value;
    if (value === 0) {
      btnVolumeIcon.current.classList.replace("bi-volume-up-fill", "bi-volume-mute-fill");
    } else {
      btnVolumeIcon.current.classList.replace("bi-volume-mute-fill", "bi-volume-up-fill");
    }
  };

  const changeTime = ({ target }) => {
    audioPlayer.current.currentTime = target.value;
    setPlayerProgress({ ...playerProgress, value: target.value });
  };

  const formatSecondsToMinutes = (seconds) => {
    return new Date(seconds * 1000).toISOString().slice(14, 19);
  };

  const ended = () => {
    repeatSongs ? togglePlaySong() : changeSong(true);
  };

  useEffect(() => {
    updatePlayer(0);
    audioPlayer.current.addEventListener("timeupdate", timeUpdate);
    audioPlayer.current.addEventListener("ended", ended);
  }, []);

  return (
    <div className="container">
      <div className="player">
        <audio ref={audioPlayer}></audio>
        <h2 className="song-name">{songName}</h2>
        <p className="song-author">{songAuthor}</p>
        <div className="player-progress">
          <div className="progress-values">
            <span>{playerCurrentTime ? playerCurrentTime : "--:--"}</span>
            <span>{playerDuration ? playerDuration : "--:--"}</span>
          </div>

          <input
            type="range"
            id="player-progress"
            value={playerProgress.value}
            max={playerProgress.max}
            onChange={changeTime}
          />
        </div>
        <div className="player-buttons">
          <button className="btn btn-repeat" onClick={toggleRepeatSong} ref={btnRepeat}>
            <i className="bi bi-repeat"></i>
          </button>
          <button className="btn btn-prev" onClick={() => changeSong(false)}>
            <i className="bi bi-rewind-fill"></i>
          </button>
          <button className="btn btn-play" onClick={togglePlaySong}>
            <i id="btn-play-icon" ref={btnPlayIcon} className="bi bi-play-fill"></i>
          </button>
          <button className="btn btn-next" onClick={() => changeSong()}>
            <i className="bi bi-fast-forward-fill"></i>
          </button>

          <div className="dropdown">
            <button id="btn-volume" className="btn btn-volume">
              <i className="bi bi-volume-up-fill" ref={btnVolumeIcon}></i>
            </button>

            <div className="dropdown-content">
              <input
                type="range"
                id="player-volume"
                value={playerVolume}
                min="0"
                max="1"
                step="0.01"
                onChange={changeVolume}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
