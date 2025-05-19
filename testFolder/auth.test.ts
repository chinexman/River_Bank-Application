import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import userModel from "../src/models/users_model";
import bcrypt from "bcrypt";
import { connect, clearDatabase, closeDatabase } from "./memory-db-handler";
import jwt from "jsonwebtoken";


jest.setTimeout(20000); // increase timeout globally for this file

beforeAll(async () => {
  // connect to in-memory db or test db
  
  await connect();

//   const res2 = await userModel.create({
//     name: "Chinedu",
//    email: "chineduemordi@gmail.com",
//    password: "password123",
//  });
  
});

afterAll(async () => {
  await closeDatabase();
});

// describe("Auth Routes", () => {
//   it("should register a new user", async () => {
//     const res = await request(app).post("/users/register").send({
//       name: "John Doe",
//       email: "john@example.com",
//       password: "password123",
//     });

//     expect(res.statusCode).toBe(201);
//     expect(res.body.data.email).toBe("john@example.com");
//   });

//   it("should login an existing user", async () => {
//     // You can also manually create the user in DB for more control
//     await userModel.create({
//       name: "Jane Doe",
//       email: "jane@example.com",
//       password: await bcrypt.hash("pass1234", 10),
//     });

//     const res = await request(app).post("/users/login").send({
//       email: "jane@example.com",
//       password: "pass1234",
//     });

//     expect(res.statusCode).toBe(200);
//     expect(res.body.token).toBeDefined();
//   });
// });


describe("User Auth and Account Tests", () => {
    let token: string;
    let accountId: string;  
    let token2: string;
    let receiverId:string;
    let receiverUserId :string
  
    it("should register a user", async () => {
      const res = await request(app).post("/users/register").send({
        name: "Alice",
        email: "alice@example.com",
        password: "password123",
      });
  
      expect(res.statusCode).toBe(201);
      expect(res.body.data.email).toBe("alice@example.com");
    });
  
    it("should login and return token", async () => {
      const res = await request(app).post("/users/login").send({
        email: "alice@example.com",
        password: "password123",
      });
  
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
  
      token = res.body.token;
    });

  
    it("should create a new account", async () => {
        console.log("token",token)

      const res = await request(app)
        .post("/accounts/create")
        // .set("Authorization", `Bearer ${token}`)
        .set("token", token) // <<< Add this
    .send({ accountnumber: "9876543210" });

  console.log("Response:", res.body); //
  
      expect(res.statusCode).toBe(201);
      expect(res.body.data.accountnumber).toBe("9876543210");
  
      accountId = res.body.data._id;
    });
    

    it("should get updateAccount", async () => {
        const res = await request(app)
          .put(`/accounts/updateaccount/${accountId}`)
          .set("token", token) 
          .send({ accountnumber: "98765432145"});
    
        expect(res.statusCode).toBe(200);
        expect(res.body.updatedAccount.accountnumber).toBe("98765432145");
    });
      
    it("should get account balance", async () => {
        const res = await request(app)
          .post("/accounts/getaccountbalance")
          .set("token", token) 
          .send({ accountnumber: "98765432145"});
    
        expect(res.statusCode).toBe(200);
        expect(res.body.balance).toBe(0);
      });
  
    it("should deposit money", async () => {
      const res = await request(app)
        .post(`/accounts/deposit/${accountId}`)
        .set("token", token) 
        .send({ accountnumber: "98765432145", amount: "10000" });
  
      expect(res.statusCode).toBe(200);
      expect(res.body.updatedAccount.accountbalance).toBe(10000);
    });
  
    it("should withdraw money", async () => {
      const res = await request(app)
        .post(`/accounts/withdraw/${accountId}`)
        .set("token", token) 
        .send({ accountnumber: "98765432145", amount: "5000" });
  
      expect(res.statusCode).toBe(200);
      expect(res.body.updatedAccount.accountbalance).toBe(5000);
    });

    it("should register another user", async () => {
        const res2 = await request(app).post("/users/register").send({
          name: "Chinedu",
          email: "chineduemordi@gmail.com",
          password: "password123",
        });
    
        expect(res2.statusCode).toBe(201);
        expect(res2.body.data.email).toBe("chineduemordi@gmail.com");
        receiverUserId = res2.body._id;

      });

    

      it("should login another user and return token", async () => {
        const res2 = await request(app).post("/users/login").send({
          email: "chineduemordi@gmail.com",
          password: "password123",
        });
    
        expect(res2.statusCode).toBe(200);
        expect(res2.body.token).toBeDefined();

        token2 = res2.body.token;
      });
  
    
      it("should create a another account", async () => {
          console.log("token2",token2)
  
        const res = await request(app)
          .post("/accounts/create")
          .set("token", token2) 
      .send({ accountnumber: "234556677888" });
  
    console.log("Response2:", res.body); //
    
        expect(res.statusCode).toBe(201);
        expect(res.body.data.accountnumber).toBe("234556677888");
    
        receiverId = res.body.data._id;
      });

    it("should transfer  money from one account to the other ", async () => {
        const res = await request(app)
          .post(`/accounts/transfer/${accountId}`)
          .set("token", token) 
          .send({ accountnumber: "98765432145",receiver:"234556677888", receiverId, amount: "1000",description:"rent" });
    console.log("res.body.sender.updateSenderAccount",res.body)
        expect(res.statusCode).toBe(200);
        expect(res.body.sender.accountbalance).toBe(4000);
        expect(res.body.receiver.accountbalance).toBe(1000);
        expect(res.body.transaction).toBeDefined();
        expect(res.body.transaction.amount).toBe(1000);

      });

      it("should fail if insufficient funds", async () => {
        const res = await request(app)
          .post(`/accounts/transfer/${accountId}`)
          .set("token", token) 
          .send({ accountnumber: "98765432145",receiver:"234556677888", receiverId, amount: "20000",description:"rent" });
    console.log("res.body.",res.body)
        expect(res.statusCode).toBe(200);
        expect(res.body.msg).toBe("Insuficient Funds");


      });
      it("should fail if receiver account does not exist", async () => {
        const res = await request(app)
          .post(`/accounts/transfer/${accountId}`)
          .set("token", token) 
          .send({ accountnumber: "98765432145",receiver:"234556677558", receiverId, amount: "20000",description:"rent" });
    console.log("res.body.",res.body)
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Reciever Account does not exist.");


      });


      it("should fail if user tries to transfer from someone else's account", async () => {

        const fakeToken = jwt.sign({ user_id: receiverUserId }, process.env.TOKEN_KEY || "secret");

        const res = await request(app)
          .post(`/accounts/transfer/${accountId}`)
          .set("token", fakeToken) 
          .send({ accountnumber: "98765432145",receiver:"234556677888", receiverId, amount: "20000",description:"rent" });
    console.log("res.body.",res.body)
    expect(res.statusCode).toBe(403);
    expect(res.body.msg).toBe("You are not authorized to update this account.");


      });
  });