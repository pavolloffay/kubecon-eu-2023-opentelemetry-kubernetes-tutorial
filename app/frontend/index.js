const express = require("express");
const app = express();
const http = require("http");
const port = process.env.FRONTEND_PORT || 3000;
const backend1url =
  process.env.BACKEND1_URL || "http://localhost:5165/rolldice";
const backend2url =
  process.env.BACKEND2_URL || "http://localhost:5000/rolldice";

app.get("/", (req, res) => {
  const { player1, player2 } = Object.assign({player1: "Player 1", player2: "Player 2"}, req.query)
  console.log(player1, player2)
  const p1 = new Promise((resolve, reject) => {
    http.get(`${backend1url}?player=${player1}`, (response) => {
      let data = [];

      response.on("data", (chunk) => {
        data.push(chunk);
      });
      response.on("end", () => {
        try {
          const result = JSON.parse(Buffer.concat(data).toString());
          res.write("Player 1 rolls: " + result + "\n");
          resolve(result);
        } catch(error) {
          reject(error)
        }
      });
    }).on('error', (error) => {
      reject(error)
    }).end()
  });

  const p2 = new Promise((resolve, reject) => {
    http.get(`${backend2url}?player=${player2}`, (response) => {
      let data = [];

      response.on("data", (chunk) => {
        data.push(chunk);
      });
      response.on("end", () => {
        try {
          const result = Buffer.concat(data).toString();
          res.write("Player 2 rolls: " + result + "\n");
          resolve(result);
        } catch(error) {
          reject(error)
        }
      });
    }).on('error', (error) => {
      reject(error)
    }).end()
  });

  Promise.all([p1, p2]).then(([roll1, roll2]) => {
    if (roll1 > roll2) {
      res.end(`${player1} wins`);
    } else if (roll2 > roll1) {
      res.end(`${player2} wins`);
    } else {
      res.end("Nobody wins");
    }
  }).catch(error => {
    res.sendStatus(500).end()
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
