const cors = require('cors');
import express from 'express';
import dotenv from 'dotenv';
import mustache from 'mustache-express';
import path from 'path';

import routes from './routes'

dotenv.config();


const server = express()

server.set('view engine', 'mustache');
server.engine('mustache', mustache());
server.set('views', path.join(__dirname, 'views'));


server.use(express.static(path.join(__dirname, '../public')))

//routes
server.use(cors())

server.use(routes)
server.use((req, res) => {
    res.send('pagina não encontrada')
    
})

try {
    server.listen(process.env.PORT);
    
} catch (error) {
    console.error(error)
}

