import supertest from 'supertest';
import app from '../src/app.js';

import connection from "../src/connection.js"

// beforeEach(async () => {
//     await connection.query(`DELETE FROM users`);
// });

afterAll(() => {
    connection.end();
});


describe("POST /sign-up", () => {
    it("returns 200 for valid params", async () =>{
        const body = {
           name: "lia",
           email: "socorro@socorro.com",
           password:"sos"
        }

        const result = await supertest(app).post("/sign-up").send(body);
        const status = result.status;
        expect(status).toEqual(200)
    })
})

// describe("POST /amount", () =>{
//     it("returns 201 for valid params", async () =>{
//         const body = {
//             amount: "20000",
//             description: "achei na rua"
//         }

//         const result = await supertest(app).post("/amount").send(body);
//         const status = result.status;

//         expect(status).toEqual(201)
//     })

//     it("returns 401 for invalid params", async () =>{
//         const body = {}

//         const result = await supertest(app).post("/amount").send(body);
//         const status = result.status;

//         expect(status).toEqual(401)
//     })
// })

