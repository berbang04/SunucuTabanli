const express = require('express');
const mysql = require('mysql2');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const registerRoutes = require('./routes/register');

const app = express();
const port = 3000;


const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'football_project',
});

const promisePool = pool.promise();
app.use('/', registerRoutes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
      session({
            secret: "gizli_anahtar",
            resave: false,
            saveUninitialized: false,
            cookie: { secure: false }
      })
);


app.post("/login", (req, res) => {
      const { kullanici_adi, sifre } = req.body;

      const query = "SELECT * FROM users WHERE username = ? AND password = ?";
      db.query(query, [kullanici_adi, sifre], (err, results) => {
            if (err) {
                  console.error("Veritabanı sorgusunda hata:", err);
                  return res.status(500).send({ message: "Sunucu hatası!" });
            }

            if (results.length > 0) {

                  req.session.loggedIn = true;
                  req.session.kullanici_adi = results[0].username;
                  return res.status(200).send({ message: "Giriş başarılı!" });
            } else {
                  return res.status(401).send({ message: "Geçersiz kullanıcı adı veya şifre!" });
            }
      });
});









app.use(cors());

const db = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'football_db'
});

db.connect((err) => {
      if (err) {
            console.error('MySQL bağlantısı başarısız: ', err);
            return;
      }
      console.log('MySQL bağlantısı başarılı.');
});





app.get('/api/team-positions', (req, res) => {
      const query = `
          SELECT position, AVG(average_rating) as average_rating
          FROM players
          GROUP BY position;
      `;
      db.query(query, (err, result) => {
            if (err) {
                  res.status(500).json({ error: 'Veri çekme hatası' });
                  return;
            }
            res.json(result);
      });
});

app.get('/api/loan-suggestions', (req, res) => {
      const query = `
      SELECT players.name, players.average_rating, player_details.age, player_details.cost
          FROM players
          JOIN player_details ON players.id = player_details.player_id
          
          WHERE age < 20 
          ORDER BY average_rating ASC 
          LIMIT 8
      `;

      db.query(query, (err, results) => {
            if (err) {
                  console.error(err);
                  return res.status(500).send('Veri çekme hatası');
            }
            res.json(results);
      });
});

app.get('/api/permanent-suggestions', (req, res) => {
      const query = `
      SELECT players.name, players.average_rating, player_details.age, player_details.cost
          FROM players
          JOIN player_details ON players.id = player_details.player_id
          
          WHERE age > 20 
          ORDER BY average_rating ASC 
          LIMIT 8
      `;

      db.query(query, (err, results) => {
            if (err) {
                  console.error(err);
                  return res.status(500).send('Veri çekme hatası');
            }
            res.json(results);
      });
});



app.get('/api/transfer-suggestions', (req, res) => {
      const query = `
          SELECT players.name, players.average_rating, player_details.age, player_details.cost
          FROM players
          JOIN player_details ON players.id = player_details.player_id
      `;

      db.query(query, (err, results) => {
            if (err) {
                  console.error('Veri çekme hatası:', err);
                  return res.status(500).send('Veri çekme hatası');
            }
            res.json(results);
      });
});

app.get('/api/team-rating', (req, res) => {
      const query = `
    SELECT general_positions.position_name AS position, AVG(players.average_rating) AS avg_rating
    FROM players
    JOIN general_positions ON players.position_id = general_positions.id
    WHERE general_positions.id IN (99, 98, 97, 96)
    GROUP BY general_positions.position_name
`;

      db.query(query, (err, results) => {
            if (err) {
                  console.error(err);
                  return res.status(500).json({ error: 'Veri çekme hatası' });
            }

            const teamRatings = results.map(row => ({
                  position: row.position,
                  avgRating: row.avg_rating ? parseFloat(row.avg_rating).toFixed(2) : null
            }));

            res.json(teamRatings);
      });
});



app.get('/api/players', (req, res) => {
      db.query('SELECT * FROM players', (err, results) => {
            if (err) {
                  console.error('Veritabanı sorgu hatası: ', err);
                  return res.status(500).send('Veritabanı hatası');
            }
            res.json(results);
      });
})
      ;

app.get("/", (req, res) => {
      if (!req.session.loggedIn) {

            res.sendFile(path.join(__dirname, 'public', 'login.html'));
      }

      res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/about', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/loan', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'loan.html'));
});
app.get('/permanent', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'permanent.html'));
});
app.get('/get-kullanici-adi', (req, res) => {
      if (req.session.loggedIn) {
            res.json({ username: req.session.kullanici_adi });
      } else {
            res.status(401).send('Kullanıcı girişi yapılmamış.');
      }
});

app.get('/logout', (req, res) => {
      req.session.destroy((err) => {
            if (err) {
                  console.error('Çıkış sırasında bir hata oluştu:', err);
                  return res.status(500).send('Çıkış yapılamadı. Lütfen tekrar deneyin.');
            }
            res.redirect('/login');
      });
});





app.use(express.static("public"));

app.listen(port, () => {
      console.log(`Sunucu ${port} portunda çalışıyor.`);
});

