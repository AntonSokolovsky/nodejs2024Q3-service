import { Injectable, Logger } from '@nestjs/common';
import { defaultLogContext, TitleLog } from './constants';
import { dirname, resolve } from 'path';
import { mkdir } from 'fs/promises';
import { createWriteStream, WriteStream } from 'fs';

@Injectable()
export class LoggingService extends Logger {
  private logFileStream: WriteStream | null = null;
  private pathFolder = '../../logs';
  private pathFile = 'app.log';

  constructor() {
    super();
    this.initializeLogFile();
  }

  private async initializeLogFile() {
    const logFilePath = resolve(__dirname, this.pathFolder, this.pathFile);
    mkdir(dirname(logFilePath), { recursive: true });
    this.logFileStream = createWriteStream(logFilePath, { flags: 'a' });
  }

  private async writeToLogFile(message: string) {
    if (this.logFileStream) {
      this.logFileStream.write(message + '\n');
    }
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
}
