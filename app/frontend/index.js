const express = require('express')
const app = express()
const http = require('http');
const port = process.env.FRONTEND_PORT || 3000
const backend1url = process.env.BACKEND1_URL || 'http://localhost:5165/rolldice'
const backend2url = process.env.BACKEND2_URL || 'http://localhost:5000/rolldice'

app.get('/', (req, res) => {
  const p1 = new Promise((resolve, reject) => {
    http.get(backend1url, response => {
      let data = [];

      response.on('data', chunk => {
        data.push(chunk);
      });
      response.on('end', () => {
	const result = JSON.parse(Buffer.concat(data).toString())
        res.write('Player 1 rolls: ' + result + '\n')
        resolve(result);
      })
    })
  })

  const p2 = new Promise((resolve, reject) => {
    http.get(backend2url, response => {
      let data = [];

      response.on('data', chunk => {
        data.push(chunk);
      });
      response.on('end', () => {
	const result = JSON.parse(Buffer.concat(data).toString())
        res.write('Player 2 rolls: ' + result + '\n')
      	resolve(result)
      })
    })
  })

  Promise.all([p1, p2]).then(([player1, player2]) => {

    
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
