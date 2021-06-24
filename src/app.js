import cors from 'cors';
import express from 'express';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';

import connection from "./connection.js"



const app = express();
app.use(express.json());
app.use(cors());

app.post("/sign-up", async (req, res) => {
    const {name, email, password} = req.body;

    const hash = bcrypt.hashSync(password, 10);

    try{
        await connection.query(`
        INSERT INTO users (name, email, password) 
        VALUES ($1, $2, $3)
        `, [name, email, hash])

        res.sendStatus(200);

    } catch{
        res.sendStatus(500);
    }
})

app.post("/log-in", async (req, res) => {
    const {email, password} = req.body;
    const token = uuid();

    try{
        const result = await connection.query(`
        SELECT * FROM users
        WHERE email = $1        
        `, [email])

        const user = result.rows[0];
        if(user && bcrypt.compareSync(password, user.password)){
            await connection.query(`
            INSERT INTO sessions (userId, session) 
            VALUES ($1,$2)
            `, [user.id, token]);

            res.status(200).send(token);
            
        }

    } catch{
        res.sendStatus(500);
    }
})


app.post("/amount", async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');
    const {amount, description} = req.body;
    const date = dayjs().format('DD/MM');

    try{
        if(!token) return res.sendStatus(401)

        const result = await connection.query(`
        SELECT *
        FROM sessions
        WHERE session = $1
        `, [token])

        const user = result.rows[0]

        await connection.query(`
        INSERT INTO balance (userId, date, amount, description)
        VALUES ($1, $2, $3, $4)
        `, [user.userid, date, amount, description])

        res.sendStatus(200);

    } catch{
        res.sendStatus(500);
    }
})


app.get("/main-page", async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');
    
    try{
        if(!token) return res.sendStatus(401)

        const result = await connection.query(`
            SELECT *
            FROM sessions
            WHERE session = $1
        `, [token])

        const user = result.rows[0]

        const balanceResult = await connection.query(`
            SELECT * 
            FROM balance
            WHERE userId = $1        
        `, [user.userid]);

        res.send(balanceResult.rows)
        
    } catch{
        res.sendStatus(500);
    }
})

export default app;

