const express = require('express')
const app = express()
const http = require('http');
const port = process.env.FRONTEND_PORT || 3000

app.get('/', (req, res) => {
  const p1 = new Promise((resolve, reject) => {
    http.get('http://localhost:5165/rolldice', response => {
      let data = [];

      response.on('data', chunk => {
        data.push(chunk);
      });
      response.on('end', () => {
        resolve(JSON.parse(Buffer.concat(data).toString()));
      })
    })
  })

  const p2 = new Promise((resolve, reject) => {
    http.get('http://localhost:5000/rolldice', response => {
      let data = [];

      response.on('data', chunk => {
        data.push(chunk);
      });
      response.on('end', () => {
        resolve(JSON.parse(Buffer.concat(data).toString()));
      })
    })
  })

  Promise.all([p1, p2]).then(([player1, player2]) => {
    res.write('Player 1 rolls: ' + player1 + '\n')
    res.write('Player 2 rolls: ' + player2 + '\n')
    if(player1 > player2) {
      res.end('Player 1 wins')
    } else if(player2 > player1) {
      res.end('Player2 wins')
    } else {
      res.end('Nobody wins')
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
