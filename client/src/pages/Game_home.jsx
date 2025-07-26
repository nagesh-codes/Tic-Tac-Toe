import { useState } from 'react';
import './Game_home.css'
import { Link } from 'react-router-dom'

const Game_home = () => {
  const [win, setWin] = useState(0);
  const [loose, setLoose] = useState(0);
  const [draw, setDraw] = useState(0);
  const [curPlayer, setCurPlayer] = useState('Nagesh');
  return (
    <>
      <div className="game-home-container">
        <div className="wrapper">
          <div className="left-panel">
            <h1>Tic-Tac-Toe Fun!</h1>
            <p className="description hide">Challenge your friend in this vibrant Tic-Tac-Toe match!</p>

            <div className="players-display">
              <div className="player-card player-x active-player">
                <span id="playerXName">Nagesh X</span>
                <i className="fas fa-times"></i>
              </div>
              <div className="player-card player-o">
                <span id="playerOName">Mahesh O</span>
                <i className="far fa-circle"></i>
              </div>
            </div>

            <div id="gameStatus" className="game-status">It`s {curPlayer}  Turn</div>
            <div className="btns">
              <button className="reset-btn">Reset Game</button>
              <button className="restart-btn">Restart Game</button>
            </div>
            <div className="home-btn">
              <Link to={"/"}>Go To Home</Link>
            </div>
          </div>

          <div className="right-panel">
            <div id="gameBoard" className="game-board">
              <div className="cell">X</div>
              <div className="cell">O</div>
              <div className="cell"></div>
              <div className="cell"></div>
              <div className="cell"></div>
              <div className="cell"></div>
              <div className="cell"></div>
              <div className="cell"></div>
              <div className="cell"></div>
            </div>
            <div className="info-area">
              <div className="game-btn win">WIN: <span>{win}</span></div>
              <div className="game-btn loose">Loose: <span>{loose}</span></div>
              <div className="game-btn draw">DRAW: <span>{draw}</span></div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Game_home