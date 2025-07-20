import jwt from "jsonwebtoken"
import { z } from "zod"

const jwtSecret = "secret"

const emailSchemna = z.string().email()
const passwordSchema = z.string().min(6)

//generate, decode , verify
function genToken(username: string, password: string) {
    const usernameResponse = emailSchemna.safeParse(username)
    const passwordResponse = passwordSchema.safeParse(password)
    if(!usernameResponse.success || !passwordResponse){
      return null
    }
    
const signature = jwt.sign({
        username,
        password
    }, jwtSecret, {expiresIn: "1h"});
    return signature;
}

function verifyToken(token:string){
   const verified = jwt.verify(token, jwtSecret)
   return verified
}

function decodeToken( token: string) {
    const decoded= jwt.decode(token)
    return decoded
}

const ans = genToken("test", "test")

