const express = require("express")
const cors = require("cors")
const { randomUUID } = require('crypto');

const id = randomUUID();


const app = express()
const PORT = 3000;

app.use(cors())
app.use(express.json())

app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
})