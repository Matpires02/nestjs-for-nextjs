import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from './upload/upload.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { RequestContextModule } from './request-context/request-context.module';
import { AuditModule } from './audit/audit.module';
import { RequestContextMiddleware } from './request-context/request-context.middleware';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 10,
          blockDuration: 5000,
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        if (process.env.DB_TYPE === 'better-sqlite3') {
          return {
            type: 'better-sqlite3',
            database: process.env.DB_DATABASE || './db.sqlite',
            synchronize: process.env.DB_SYNCHRONIZE === '1',
            autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === '1',
          };
        }

        return {
          type: 'postgres',
          url: process.env.DB_DATABASE || '',
          ssl: {
            rejectUnauthorized: false,
          },
          synchronize: false,
          autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === '1',
          migrations: [__dirname + '/migrations/*{.js,.ts}'],
          migrationsRun: process.env.DB_MIGRATIONS_RUN === '1',
        };
      },
    }),
    RequestContextModule,
    AuditModule,
    UploadModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
