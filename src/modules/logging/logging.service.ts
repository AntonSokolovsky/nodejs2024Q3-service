import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { defaultLogContext, TitleLog } from './constants';
import { resolve } from 'path';
import { mkdir } from 'fs/promises';
import { createStream, RotatingFileStream } from 'rotating-file-stream';

@Injectable()
export class LoggingService extends ConsoleLogger {
  private pathFolder = '../../logs';
  private fileAppLogName = 'app.log';
  private fileErrorLogName = 'error.log';
  private logLevel: LogLevel;
  private logStream: RotatingFileStream;
  private errorLogStream: RotatingFileStream;
  private maxLogSize: string = process.env.MAX_LOG_SIZE || '10M';

  constructor() {
    super();
    this.initializeLog();
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'log';
  }

  private async initializeLog() {
    const logDir = resolve(__dirname, this.pathFolder);
    mkdir(logDir, { recursive: true });

    this.logStream = createStream(this.fileAppLogName, {
      size: this.maxLogSize,
      interval: '1d',
      path: logDir,
    });

    this.errorLogStream = createStream(this.fileErrorLogName, {
      size: this.maxLogSize,
      interval: '1d',
      path: logDir,
    });
  }

  private async writeToLogFile(message: string, isError = false) {
    const stream = isError ? this.errorLogStream : this.logStream;
    stream.write(message + '\n');
  }

  async log(message: string, context?: string) {
    super.log(message, context);
    this.writeToLogFile(
      `${TitleLog.LOG} ${new Date().toISOString()} [${
        context ?? defaultLogContext
      }] ${message}`,
    );
  }

  async error(message: string, trace?: string, context?: string) {
    super.error(message, trace, context);
    this.writeToLogFile(
      `${TitleLog.ERROR} ${new Date().toISOString()} [${
        context ?? defaultLogContext
      }] ${message}\n${trace}`,
    );
  }

  async warn(message: string, context?: string) {
    super.warn(message, context);
    this.writeToLogFile(
      `${TitleLog.WARN} ${new Date().toISOString()} [${
        context ?? defaultLogContext
      }] ${message}`,
    );
  }

  async debug(message: string, context?: string) {
    super.debug(message, context);
    this.writeToLogFile(
      `${TitleLog.DEBUG} ${new Date().toISOString()} [${
        context ?? defaultLogContext
      }] ${message}`,
    );
  }

  async verbose(message: string, context?: string) {
    super.verbose(message, context);
    this.writeToLogFile(
      `${TitleLog.VERBOSE} ${new Date().toISOString()} [${
        context ?? defaultLogContext
      }] ${message}`,
    );
  }
  isLevelEnabled(level: LogLevel): boolean {
    const levels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];
    return levels.indexOf(level) <= levels.indexOf(this.logLevel);
  }
}
