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
    let ans= true
    try{
  jwt.verify(token, jwtSecret)
   }catch(e){
    ans = false
   }
   return ans
}

function decodeToken( token: string) {
    const decoded = jwt.decode(token)

    if(decoded){
        return true
    }else {
        return false
    }
}

const ans = genToken("test", "test")
console.log(ans)
console.log(verifyToken(ans))

