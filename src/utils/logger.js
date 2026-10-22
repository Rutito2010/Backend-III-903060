import winston from "winston";

// Notas
// level        -> nivel minimo de importancia para investigar
// format       -> formato del mensaje
// transports   -> Medio por el que se envian los mensajes

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),

    // persistencia de datos
    new winston.transports.File({
      filename: "logs/errors.log",
      level: "error",
    }),

  ],
});

export default logger;
