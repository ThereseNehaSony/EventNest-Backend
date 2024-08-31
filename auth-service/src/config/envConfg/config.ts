import {config} from 'dotenv'
config()
const EMAIL : string  = String(process.env.AUTH_EMAIL)
const PASSWORD : string  = String(process.env.AUTH_PASS)

export {
    EMAIL,
    PASSWORD,
}

