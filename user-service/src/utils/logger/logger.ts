import wintson from 'winston';

const logger = wintson.createLogger({
    level:'info',
    format: wintson.format.combine(
        wintson.format.json(),
        wintson.format.timestamp()
    ),
    transports: [
        new wintson.transports.Console(),
    ]
});

export default logger;
