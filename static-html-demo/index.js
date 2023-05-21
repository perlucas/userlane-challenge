const express = require('express')
const app = express()


app.use(express.static('site'))


app.listen(9000, () => {
    console.log('static website ready!')
})