import supertest from "supertest";
import {
  describe,
  beforeEach,
  test,
  expect,
  beforeAll,
  afterEach,
  afterAll,
} from "@jest/globals";
import { connect, clearDatabase, closeDatabase } from "./memory-db-handler";
import app from "../src/app";
import userModel from "../src/models/users_model";
import accountModel from "../src/models/accountModel";

import bcrypt from "bcrypt";
import { response } from "express";

//initial declaration for typescript intellisense support
let request = supertest.agent(app);


/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await closeDatabase());

/**
 * Resets the session for each tests.
 */
beforeEach(() => {
  request = supertest.agent(app);
});

const user1Login = {
  email: "chineduemordi@gmail.com",
  password: "123456",
};

const user1Reg = {
  email: "chineduemordi1@gmail.com",
  password: bcrypt.hashSync("123456", 12),
  name: "chinedu",
};

const user2Login = {
  email: "chineduemordi2@gmail.com",
  password: "123456",
};

const user2Reg = {
  email: "chineduemordi2@gmail.com",
  password: bcrypt.hashSync("123456", 12),
  name: "chinexman",
};



const account1 = {
  accountnumber: "20348859383848484",
};


describe("ACCOUNT TEST", () => {
  test("user should be able to create a account ", async () => {
     /*steps
    1. owner should have signed up
    2. owner should have logged in
    */
    // user must be register
    const user1Db = await userModel.create(user1Reg);

    //login user
    const response = await request
      .post("/users/login")
      .send(user1Login)
      .expect(200);
  

    await request
      .post("/accounts/create")
      .set("token", response.body.token)
      .send({ accountnumber: "2093848588483848" })
      .expect(201)
      .expect((res: Response) => {
        expect(res.body.status).toBe("success");
      });
  });



  test("user should be able to get all multiple accounts", async () => {
    const user1Db = await userModel.create(user1Reg);
    const user2Db = await userModel.create(user2Reg);

    //create accountA
    const accountA = accountModel.create({
      accountnumber: "2033949490209",
      owner: user1Db._id,
      accountbalance:0,
      transactions:[]
    });
    //create accountB
    const accountB = accountModel.create({
      accountnumber: "203949494994",
      owner: user2Db._id,
      accountbalance:0,
      transactions:[]
    });

    //login user
    const response = await request
      .post("/users/login")
      .send(user1Login)
      .expect(200);
  

    await request
      .get("/accounts/getaccounts")
      .set("token", response.body.token)
      .expect(200)
      .expect((res: Response) => {
        expect(res.body.accounts.length).toBe(2);
      });
  });

  test("user should be able to manage account", async () => {
    const user1Db = await userModel.create(user1Reg);

    //create accountA
    const accountA = await accountModel.create({
      accountnumber: "3948585949485",
      owner: user1Db._id,
      accountbalance:0,
      transactions:[]
    });

    //login user
    const response = await request
      .post("/users/login")
      .send(user1Login)
      .expect(200);
    

    //user should update account
    const newAccountNumber = "20394959504039459";
    await request
      .put(`/accounts/updateaccount/${accountA._id}`)
      .set("token", response.body.token)
      .send({
        accountnumber: newAccountNumber,
      })
      .expect(200)
      .expect((res: Response) => {
        expect(res.body.updatedAccount.accountnumber).toBe(newAccountNumber);
      });
  });

 
  
 
});

describe("TRANSFER TEST /transfer/:senderId", () => {
  it("should transfer funds successfully", async () => {

     //login user
     const response1 = await request
     .post("/users/login")
     .send(user1Login)
     .expect(200);
    const sender = await userModel.create({
      owner: "user123",
      accountnumber: "ACC123",
      accountbalance: 500,
    });
    const receiver = await userModel.create({
      owner: "user456",
      accountnumber: "ACC456",
      accountbalance: 100,
    });

    const transferData = {
      accountnumber: sender.accountnumber,
      receiver: receiver.accountnumber,
      receiverId: receiver._id.toString(),
      amount: "200",
      description: "Test transfer",
    };

    // Mock user in the request - you might want to mock Authorization middleware to add req.user
    const response = await request
      .post(`/transfer/${sender._id.toString()}`)
      .send(transferData)
      .set("token", response1.body.token)
      .expect(200);

    expect(response.body.msg).toBe("Transfer successful");
    expect(response.body.sender.accountbalance).toBe(300);
    expect(response.body.receiver.accountbalance).toBe(300);
    expect(response.body.transaction.amount).toBe(200);
    expect(response.body.transaction.description).toBe("Test transfer");
  });

  it("should return 400 if validation fails", async () => {
    const response = await request
      .post("/transfer/someSenderId")
      .send({ amount: "bad input" })
      .expect(400);
    expect(response.body.message).toBeDefined();
  });
});
