import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSocket } from '../components/SocketProvider';
import { error, success, warning } from '../App';
import winning from '../assets/winning.gif';
import lose from '../assets/lose.gif';
import Draw from '../assets/draw.gif';
import './Game_home.css';

const Game_home = () => {
  const [roomid, setRoomid] = useState(sessionStorage.getItem('room') || 'Room ID');
  const [win, setWin] = useState(0);
  const [loose, setLoose] = useState(0);
  const [draw, setDraw] = useState(0);
  const [curPlayer, setCurPlayer] = useState('');
  const { socket } = useSocket();
  const [pl1, setPl1] = useState('Player 1');
  const [pl2, setPl2] = useState('Player 2');
  const [disable, setDisable] = useState(true);
  const player = sessionStorage.getItem('player');
  const [sign, setSign] = useState('');
  const [gameStatus, setGameStatus] = useState(Array(9).fill(''));
  const [gif, setGif] = useState('');
  const [showImg, setShowImg] = useState(false);
  const [disCurPla, setDisCurPla] = useState('...')
  const navigate = useNavigate();

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
      setGameStatus(data.game_status);
      if (data.isDisabled) {
        setDisable(true);
      } else {
        setDisable(nextPlayer !== player);
      }
      const txt = `It's ${player === nextPlayer ? 'Your' : nextPlayer} Turn`;
      setDisCurPla(txt);
      if (data.draw) {
        setGif(Draw);
        setShowImg(true);
        setDisCurPla('You Both Have Same IQ!');
        success('It\'s a Draw!');
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  const handleCellClick = (e) => {
    const index = Array.from(e.target.parentNode.children).indexOf(e.target);
    if (gameStatus[index] !== '') {
      warning('This box is already filled!');
      return;
    }

    if (player === curPlayer) {
      const newGameStatus = [...gameStatus];
      newGameStatus[index] = sign;
      setGameStatus(newGameStatus);
      socket.emit('cellClick', { roomid, arr: newGameStatus, player });
    } else {
      warning("It's not your turn!");
    }
  };

  const handleClick = () => {
    sessionStorage.removeItem('room');
    sessionStorage.removeItem('player');
    sessionStorage.removeItem('wait');
    socket.emit('leaveRoom', { roomid })
  };

  const handleReset = () => {
    socket.emit('resetGame', { roomid });
  }

  const handleRestart = () => {
    socket.emit('resetGame', { roomid, restart: true });
  }

  useEffect(() => {
    const applyCellStyles = async () => {
      const allCells = await waitForCells();
      gameStatus.forEach((value, index) => {
        const cell = allCells[index];
        cell.classList.remove('x', 'o');
        cell.textContent = '';
        if (value === 'X' || value === 'O') {
          cell.textContent = value;
          cell.classList.add(value.toLowerCase());
        }
      });
    };

    if (gameStatus.some(cell => cell !== '')) {
      applyCellStyles();
    }

  }, [gameStatus]);

  useEffect(() => {
    if (!socket) return;
    if (!sessionStorage.getItem('room')) {
      warning('Please create or join a room first.');
      navigate("/");
      return;
    }

    socket.emit('takeInfo', {
      roomid: sessionStorage.getItem('room'),
      player: sessionStorage.getItem('player'),
      name: sessionStorage.getItem('player')
    });

    socket.on('getInfo', updateGameStatus);
    socket.on('newGameState', updateGameStatus);

    socket.on('discnn', () => {
      error('Your game partner has disconnected.');
      setDisable(true);
    });

    socket.on('youWin', () => {
      setGif(winning);
      setShowImg(true);
      setDisCurPla('You Won The Match!')
      success('You Win!');
    })

    socket.on('youLoose', () => {
      setGif(lose);
      setDisCurPla('You Lose The Match!')
      setShowImg(true);
      error(`You Lose!`);
    });

    socket.on('goToHome', () => {
      navigate('/');
    });

    socket.on('resetedGame', (data) => {
      const allCells = document.querySelectorAll('.cell');
      allCells.forEach(cell => {
        cell.classList.remove('x', 'o');
        cell.textContent = '';
      });
      setShowImg(false);
      success('Game has been reset!');
      updateGameStatus(data);
    });

    socket.on('serverErr', () => {
      error('Server Error! Please try again later.');
    });

    socket.on('partnerLeft', () => {
      error('Your game partner has left the room.');
      sessionStorage.removeItem('room');
      sessionStorage.removeItem('player');
      if (window.confirm('You Want To Leave? Your Partner is Quited!')) {
        navigate('/');
      } else {
        alert('Your Room Data Is All Cleared From The Server. So Do Not Refresh This Page, If You Refresh This Page Then You Will Be Directed To The Home Page!');
      }
    });

    socket.on('partnerJoined', () => {
      success('Your game partner is connected!');
    })

    return () => {
      socket.off('getInfo');
      socket.off('newGameState');
      socket.off('discnn');
      socket.off('youWin');
      socket.off('youLoose');
      socket.off('goToHome');
      socket.off('resetedGame');
      socket.off('partnerJoined');
      socket.on('partnerLeft');
      socket.off('serverErr');
    };
  }, [socket, navigate]);


  return (
    <>
      <div className="game-home-container">
        <div className="wrapper">
          <div className="left-panel">
            <h1>Tic-Tac-Toe Fun!</h1>
            <p className="description hide">Challenge your friend in this vibrant Tic-Tac-Toe match!</p>
            <div className="players-display">
              <div className={`player-card player-x ${curPlayer === pl1.split(" ")[0] ? 'active-player' : ''}`}>
                <span id="playerXName">{pl1}</span>
              </div>
              <div className={`player-card player-0 ${curPlayer === pl2.split(" ")[0] ? 'active-player' : ''}`}>
                <span id="playerOName">{pl2}</span>
              </div>
            </div>
            <div id="gameStatus" className="game-status">{disCurPla}</div>
            <div className="btns">
              <button className="reset-btn" onClick={handleReset}>Reset Game</button>
              <button className="restart-btn" onClick={handleRestart}>Restart Game</button>
            </div>
            <Link className="home-btn" to={"/"} onClick={handleClick}>Leave The Room</Link>
          </div>

          <div className="right-panel">
            <div className="celebration">
              {showImg ? <img src={gif} alt={gif} /> : ''}
            </div>
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
              <div className="game-btn loose">Lose: <span>{loose}</span></div>
              <div className="game-btn draw">DRAW: <span>{draw}</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Game_home;