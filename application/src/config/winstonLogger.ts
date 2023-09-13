import { Logger } from "winston"
import winston from "winston"

export const winstonLogger: Logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "warn.log", level: "warn" }),
    ],
})

if (process.env.NODE_ENV !== "production") {
    winstonLogger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    )
}
