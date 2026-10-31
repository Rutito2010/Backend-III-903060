import winston from "winston";
import DailyRotateFile from "winston/lib/winston/transports";

// Notas
// level        -> nivel minimo de importancia para investigar
// format       -> formato del mensaje
// transports   -> Medio por el que se envian los mensajes

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),

    // persistencia de datos
    //new winston.transports.File({
    //  filename: "logs/errors.log",
    //  level: "error",
    //}),

    // guardar diariamente en logs nuevos
    
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "14d",
      maxSize: "10m"
    })
  ],
});

export default logger;
