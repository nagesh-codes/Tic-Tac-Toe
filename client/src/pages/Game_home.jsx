import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { useSocket } from '../components/SocketProvider'
import { error, warning } from '../App'
import './Game_home.css'

const Game_home = () => {
  const [roomid, setRoomid] = useState(sessionStorage.getItem('room') || 'Room ID');
  const [win, setWin] = useState(10);
  const [loose, setLoose] = useState(20);
  const [draw, setDraw] = useState(20);
  const [curPlayer, setCurPlayer] = useState('Nagesh');
  const { socket } = useSocket();
  const [pl1, setPl1] = useState('player1');
  const [pl2, setPl2] = useState('player2');
  const [disable, setDisable] = useState(true);
  const player = sessionStorage.getItem('player')
  const [sign, setSign] = useState('');
  const navigate = useNavigate();
  let allCells;

  useEffect(() => {
    if (!socket) return;
    if ((!sessionStorage.getItem('room'))) {
      warning('Firstly Create Or Join Another`s The Room');
      navigate("/");
    };

    socket.emit('takeInfo', ({ roomid: sessionStorage.getItem('room'), player: sessionStorage.getItem('player'), name: sessionStorage.getItem('player') }));

    socket.on('getInfo', updateGameStatus);

    socket.on('newGameState', (dd) => {
      console.log(dd);
      updateGameStatus(dd);
    });

    socket.on('discnn', () => {
      error('Your Game Partner Is Disconnected');
      setDisable(true);
    });

    return () => {
      socket.off('getInfo');
      socket.off('newGameState');
      socket.off('discnn');
    }
  }, [socket]);

  const waitForCells = () =>
    new Promise((resolve) => {
      const check = () => {
        const cells = document.querySelectorAll(".cell");
        if (cells.length === 9) {
          resolve(cells);
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });

  const updateGameStatus = async (data) => {
    try {
      console.log(data);
      await waitForCells();
      setRoomid(data.roomid);
      setPl1(`${data.pl1} ${data.pl1_sta[2]}`);
      setPl2(`${data.pl2} ${data.pl2_sta[2]}`);

      if (player === data.pl1) {
        setWin(data.pl1_sta[0]);
        setLoose(data.pl1_sta[1]);
        setSign(data.pl1_sta[2]);
      } else {
        setWin(data.pl2_sta[0]);
        setLoose(data.pl2_sta[1]);
        setSign(data.pl2_sta[2]);
      }

      setDraw(data.draw);

      const nextPlayer = data.turn === 0 ? data.pl1 : data.pl2;
      setCurPlayer(nextPlayer);
      setDisable(nextPlayer !== player);

      allCells = document.querySelectorAll('.cell');
      data.game_status.forEach((ele, index) => {
        if (ele === 'X') {
          allCells[index].textContent = 'X';
          allCells[index].classList.add('x');
        } else if (ele === 'O') {
          allCells[index].textContent = 'O';
          allCells[index].classList.add('o');
        }
      });
    } catch (e) {
      console.error(e);
    }
  };


  const handleCellClick = (e) => {
    allCells = document.querySelectorAll('.cell');
    if (e.target.value) {
      warning('This Box Is Already Filled!');
      return;
    };

    if (player === curPlayer) {
      e.target.textContent = sign;
      e.target.classList.add(sign);
    } else {
      e.target.textContent = sign;
      e.target.classList.add(sign);
    }

    let arr = []
    allCells.forEach((ele, i) => {
      arr[i] = ele.textContent === '' ? '' : ele.textContent;
    });
    socket.emit('cellClick', { roomid, arr, player });
  }

  const handleClick = () => {
    sessionStorage.removeItem('player');
    sessionStorage.removeItem('room');
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
                <span id="playerXName">{pl1}</span>
                <i className="fas fa-times"></i>
              </div>
              <div className="player-card player-o">
                <span id="playerOName">{pl2}</span>
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
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
              <div className={`cell ${disable ? 'no-click' : ''}`} onClick={handleCellClick}></div>
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