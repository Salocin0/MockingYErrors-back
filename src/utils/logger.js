import winston from 'winston';

export const loggerDev = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.colorize({ all: true }),
    }),
  ],
});

const loggerProd = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.colorize({ all: true }),
    }),
    new winston.transports.File({
      filename: './errors.log',
      level: 'error',
      format: winston.format.simple(),
    }),
  ],
});

export const addLogger = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    req.logger = loggerProd;
  } else {
    req.logger = loggerDev;
  }
  next();
};
