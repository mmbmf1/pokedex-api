require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const POKEDEX = require('./pokedex.json')

console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'))

app.use(function validateBearerToken(req, res, next) {

    // console.log(req.get('Authorization')) >> THIS DOESNT WORK!
    // const bearerToken = req.query.Authorization.split(' ')[1];
    //req.get('Authorization') did not work
    const apiToken = process.env.API_TOKEN;
    const authToken = req.query.Authorization;

    console.log('validate bearer token middleware')

    // if(bearerToken !== apiToken) {
    //     return res.status(401).json({ error: 'Unauthorized request' })
    // }
    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    //move to next middlewear
    next()
})

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`];

app.get('/types', function handleGetTypes(req, res) {
    res.json(validTypes)
})

app.get('/pokemon', function handleGetPokemon(req, res) {
    let response = POKEDEX.pokemon;

    if(req.query.name) {
        response = response.filter(pokemon => 
            pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
        )
    }

    if(req.query.type) {
        response = response.filter(pokemon => 
            pokemon.type.includes(req.query.type)
        )
    }

    res.json(response)
})

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})