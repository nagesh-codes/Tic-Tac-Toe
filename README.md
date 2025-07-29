🎮 Real-time Tic-Tac-Toe Game
A classic Tic-Tac-Toe game with a modern twist, featuring real-time multiplayer capabilities using WebSockets. Challenge your friends by creating or joining a room and enjoy a seamless gaming experience!

✨ Features
Real-time Multiplayer: Play live with a friend in a dedicated game room.

Room Management: Create unique rooms or join existing ones.

Player Status: See who's connected and whose turn it is.

Game State Synchronization: Moves are instantly reflected for both players.

Win/Loss/Draw Tracking: Keeps track of game statistics.

Game Reset/Restart: Options to reset the current game or restart a new one.

Timeout Mechanism: Automatic turn forfeiture if a player doesn't move within a time limit.

Responsive Design: Playable on various screen sizes.

User-friendly Notifications: Success, warning, and error messages for game events.

🚀 Technologies Used
Frontend (Client):

React.js: A JavaScript library for building user interfaces.

React Router DOM: For declarative routing in the React application.

Socket.IO Client: For real-time, bidirectional communication with the server.

CSS: For styling and animations.

Backend (Server):

Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine.

Express.js: A fast, unopinionated, minimalist web framework for Node.js.

Socket.IO: A library for real-time web applications.

Nodemon: (Dev Dependency) For automatically restarting the Node.js server during development.

CORS: Middleware for enabling Cross-Origin Resource Sharing.

📦 Project Structure
Tic-Tac-Toe/
├── client/                 # React frontend
│   ├── public/             # Public assets
│   ├── src/
│   │   ├── assets/         # Images, GIFs
│   │   ├── components/     # Reusable React components (e.g., SocketProvider)
│   │   ├── pages/          # React page components (e.g., Game_home, Home)
│   │   ├── App.js          # Main React component
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles
│   ├── .env                # Environment variables for client (if any)
│   ├── package.json
│   └── README.md
├── server/                 # Node.js backend
│   ├── index.js            # Server entry point (Express, Socket.IO logic)
│   ├── package.json
│   └── .env                # Environment variables for server (if any)
└── README.md               # This file

⚙️ Setup and Local Run
Follow these steps to get the project up and running on your local machine.

Prerequisites
Node.js (v14 or higher recommended)

npm (Node Package Manager)

1. Clone the Repository
git clone https://github.com/nagesh-codes/Tic-Tac-Toe.git
cd Tic-Tac-Toe

2. Install Dependencies
Navigate into both the server and client directories and install their respective dependencies.

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

3. Configure Environment Variables (Optional for Local)
For local development, you generally don't need .env files if your server defaults to port 8000 and your client connects to localhost:8000. However, for clarity:

Server (server/.env):

PORT=8000

Client (client/.env):
If you needed to specify the backend URL (e.g., for different local setups), you might use:

REACT_APP_SERVER_URL=ws://localhost:8000

(Note: The current client code uses a relative path io(), so REACT_APP_SERVER_URL isn't strictly necessary unless you modify SocketProvider.js to use it.)

4. Run the Backend Server
Open a new terminal window, navigate to the server directory, and start the server:

cd server
npm start
# Or if you have nodemon installed globally: nodemon index.js

The server will typically run on http://localhost:8000.

5. Run the Frontend Application
Open another terminal window, navigate to the client directory, and start the React development server:

cd client
npm run dev

This will open the application in your browser, usually at http://localhost:5173.

🤝 Contributing
Feel free to fork the repository, make improvements, and submit pull requests.

📄 License
This project is open-sourced under the MIT License.