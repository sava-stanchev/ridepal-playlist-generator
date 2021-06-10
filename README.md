# RidePal Playlist Generator

### Description
RidePal Playlist Generator is a single-page application that enables users to generate playlists for specific travel duration periods, based on their preferred genres.

### Tech Stack
React.js, Express.js, Node.js, MariaDB, MySQL

### External Services
- Microsoft Bing Maps
- Deezer

### Setup
Backend:
- Inside the `server` folder, run `npm install` to restore all dependencies.
- Import the database schema from the `full-database` file in the `database` folder.
- Inside the `server` folder, create a `.env` file with the following configuration:
```js
PORT=5555
HOST=localhost
DB_PORT=3306
USER= // insert MariaDB database username
PASSWORD= // insert MariaDB database password 
DATABASE=playlist_generator
PRIVATE_KEY=secretkey
```
- Run `npm start`.
  
Frontend:
- Inside the `client` folder, run `npm install` to restore all dependencies.
- Run `npm start`.