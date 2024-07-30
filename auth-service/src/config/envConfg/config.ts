import {config} from 'dotenv'
config()
let EMAIL : string  = String(process.env.AUTH_EMAIL)
let PASSWORD : string  = String(process.env.AUTH_PASS)

export {
    EMAIL,
    PASSWORD,
}

