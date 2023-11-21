import dotenv from 'dotenv';
import {
    Command
} from 'commander';


const program = new Command(); //Crea la instancia de comandos de commander.

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del servidor', 8080)
    .option('--mode <mode>', 'Modo de trabajo', 'develop')
    .parse(process.argv);

console.log("Mode Option: ", program.opts().mode);

const environment = program.opts().mode;

let envPath;
if (environment === "production") {
    envPath = "./src/config/.env.production";
} else if (environment === "test") {
    envPath = "./src/config/.env.test";
} else {
    envPath = "./src/config/.env.development";
}

dotenv.config({
    path: envPath
});

export const ENV_CONFIG = {
    PORT: process.env.PORT,
    environment: environment,
    MONGO_URL: process.env.MONGO_URL,
    SECRET_KEY_SESSION: process.env.SECRET_KEY_SESSION,
    JWT_SECRET: process.env.JWT_SECRET,
    CLIENT_ID_GITHUB: process.env.CLIENT_ID_GITHUB,
    CLIENT_SECRET_GITHUB: process.env.CLIENT_SECRET_GITHUB,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    premiumEmail: process.env.PREMIUM_EMAIL,
    premiumPassword: process.env.PREMIUM_PASSWORD,
    PERSISTENCE: process.env.PERSISTENCE,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
}