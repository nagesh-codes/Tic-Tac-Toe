import React from 'react'
import './Game_home.css'
import { Link } from 'react-router-dom'

const Game_home = () => {
  return (
    <>
      <div className="game-home-container">
        <div className="wrapper">
          <div className="left-panel">
            <h1>Pink Tic-Tac-Toe Fun!</h1>
            <p className="description">Challenge your friend in this vibrant Tic-Tac-Toe match!</p>

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

            <div id="gameStatus" className="game-status">Player X's Turn</div>
            <button id="resetButton" className="reset-btn">Reset Game</button>
          </div>

          <div className="right-panel">
            <div id="gameBoard" className="game-board">
              <div className="cell" data-cell-index="0">X</div>
              <div className="cell" data-cell-index="1">O</div>
              <div className="cell" data-cell-index="2"></div>
              <div className="cell" data-cell-index="3"></div>
              <div className="cell" data-cell-index="4"></div>
              <div className="cell" data-cell-index="5"></div>
              <div className="cell" data-cell-index="6"></div>
              <div className="cell" data-cell-index="7"></div>
              <div className="cell" data-cell-index="8"></div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Game_home