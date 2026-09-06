type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogPayload {
  message: string;
  timestamp: string;
  level: LogLevel;
  [key: string]: any;
}

function writeLog(level: LogLevel, message: string, meta?: Record<string, any>) {
  const payload: LogPayload = {
    message,
    timestamp: new Date().toISOString(),
    level,
    ...meta,
  };
  
  if (level === 'error') {
    console.error(JSON.stringify(payload));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(payload));
  } else {
    console.log(JSON.stringify(payload));
  }
}

export const logger = {
  info(message: string, meta?: Record<string, any>) {
    writeLog('info', message, meta);
  },
  warn(message: string, meta?: Record<string, any>) {
    writeLog('warn', message, meta);
  },
  error(message: string, error?: Error | unknown, meta?: Record<string, any>) {
    const errorMeta = error instanceof Error 
      ? { errorName: error.name, errorMessage: error.message, errorStack: error.stack }
      : { errorDetail: error };
    writeLog('error', message, { ...errorMeta, ...meta });
  },
  debug(message: string, meta?: Record<string, any>) {
    if (process.env.NODE_ENV !== 'production') {
      writeLog('debug', message, meta);
    }
  }
};
export default logger;
