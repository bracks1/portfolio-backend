import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';
import fs from 'fs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    let dbUrl = process.env.DATABASE_URL || 'file:./dev.db';

    // Handle Vercel serverless environment with ephemeral /tmp
    if (process.env.VERCEL) {
      const tmpDbPath = '/tmp/dev.db';
      const localCandidates = [
        path.resolve(process.cwd(), 'dev.db'),
        path.resolve(process.cwd(), 'prisma/dev.db'),
      ];

      if (!fs.existsSync(tmpDbPath)) {
        for (const candidate of localCandidates) {
          if (fs.existsSync(candidate)) {
            try {
              fs.copyFileSync(candidate, tmpDbPath);
              break;
            } catch {
              // Ignore copy error and let adapter create fresh if needed
            }
          }
        }
      }
      dbUrl = `file:${tmpDbPath}`;
    } else {
      // Normalize path for local / Docker environments
      if (dbUrl.startsWith('file:')) {
        const filePath = dbUrl.slice(5);
        if (!path.isAbsolute(filePath)) {
          const resolvedPath = path.resolve(process.cwd(), filePath);
          dbUrl = `file:${resolvedPath}`;
        }
      } else if (!dbUrl.startsWith('sqlite:')) {
        const resolvedPath = path.resolve(process.cwd(), dbUrl);
        dbUrl = `file:${resolvedPath}`;
      }
    }

    const adapter = new PrismaBetterSqlite3({ url: dbUrl });
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connection successfully established (SQLite).');
    } catch (error) {
      this.logger.error('Failed to establish database connection:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database connection closed.');
  }
}
