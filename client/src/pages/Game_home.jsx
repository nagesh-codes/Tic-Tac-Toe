import { use, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { useSocket } from '../components/SocketProvider'
import './Game_home.css'

const Game_home = () => {
  const [roomid, setRoomid] = useState(sessionStorage.getItem('room') || 'Room ID');
  const [win, setWin] = useState(10);
  const [loose, setLoose] = useState(20);
  const [draw, setDraw] = useState(20);
  const [curPlayer, setCurPlayer] = useState('Nagesh');
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useSocket();
  const [pl1, setPl1] = useState('player1');
  const [pl2, setPl2] = useState('player2');
  const [disable, setDisable] = useState(true);
  const [allCells, setAllCells] = useState('');
  const player = sessionStorage.getItem('pl1') || 'pl2';

  useEffect(() => {
    const data = location.state;
    updateGameStatus(data);
  }, [])

  useEffect(() => {
    if (!socket) return;
    if (!location.state?.data) { }
    if ((sessionStorage.getItem('status') == 'online') && (!sessionStorage.getItem('uni'))) {
      navigate("/");
    }
    return () => {
    }
  }, [socket]);

  const updateGameStatus = (data) => {
    setRoomid(data.roomid);
    setAllCells(document.querySelectorAll('.cell'));
    data.game_status.forEach((ele, index) => {
      if (ele == 1) {
        allCells[index].textContent = 'X';
        allCells[index].classList.add('x');
      } else if (ele == 2) {
        allCells[index].textContent = 'O'
        allCells[index].classList.add('o');
      }
    });
    setPl1(data.pl1);
    setPl2(data.pl2);
    if (data.turn == 0) {
      setCurPlayer(data.pl1);
    };
    player === 'pl1' ? setWin(data.pl1_sta[0]) : setWin(data.pl2_sta[0]);
    player === 'pl1' ? setWin(data.pl1_sta[1]) : setWin(data.pl2_sta[1]);
    setDraw(data.draw);
  }

  const handleClick = () => {
    sessionStorage.removeItem('status');
    sessionStorage.removeItem('uni');
    sessionStorage.removeItem('roomid');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('email');
  };
  return (
    <>
      <div className="game-home-container">
        <div className="wrapper">
          <div className="left-panel">
            <h1>Tic-Tac-Toe Fun!</h1>
            <p className="description hide">Challenge your friend in this vibrant Tic-Tac-Toe match!</p>

            <div className="players-display">
              <div className="player-card player-x active-player">
                <span id="playerXName">{pl1} X</span>
                <i className="fas fa-times"></i>
              </div>
              <div className="player-card player-o">
                <span id="playerOName">{pl2} O</span>
                <i className="far fa-circle"></i>
              </div>
            </div>

            <div id="gameStatus" className="game-status">It`s {curPlayer}  Turn</div>
            <div className="btns">
              <button className="reset-btn">Reset Game</button>
              <button className="restart-btn">Restart Game</button>
            </div>
            <Link className="home-btn" to={"/"} onClick={handleClick}>Go To Home</Link>
          </div>

          <div className="right-panel">
            <div id="gameBoard" className="game-board">
              <div className={`${disable ? 'no-click' : ''}  cell`}></div>
              <div className={`${disable ? 'no-click' : ''}  cell`}></div>
              <div className={`${disable ? 'no-click' : ''}  cell`}></div>
              <div className={`${disable ? 'no-click' : ''}  cell`}></div>
              <div className={`${disable ? 'no-click' : ''}  cell`}></div>
              <div className={`${disable ? 'no-click' : ''}  cell`}></div>
              <div className={`${disable ? 'no-click' : ''}  cell`}></div>
              <div className={`${disable ? 'no-click' : ''}  cell`}></div>
              <div className={`${disable ? 'no-click' : ''}  cell`}></div>
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