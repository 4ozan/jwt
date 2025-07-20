import jwt from "jsonwebtoken";

//decode , verify, generate

const value = {
    name: "John",
    age: 30,
    city: "New York"
}

// creating the workbook
const token = jwt.sign(value, "secret")

console.log(token);