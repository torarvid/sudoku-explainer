const express = require('express')

const app = express()

app.use(express.static('docs'))

const listener = app.listen(8008, () => {
    console.log(`Listening on ${listener.address().port}`)
})
