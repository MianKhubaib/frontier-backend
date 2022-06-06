import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { AssetsService } from './assets/assets.service';
import { AssetsController } from './assets/assets.controller';
import { AssetsModule } from './assets/assets.module';
import { Asset } from './assets/asset.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './files',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      // database: 'frontier',
      // host: '127.0.0.1',
      // username: 'postgres',
      // password: '1234',
      entities: [User, Asset],
      synchronize: true,
      autoLoadEntities: true,
      //extra: { ssl: { rejectUnauthorized: false } },
    }),
    UsersModule,
    AuthModule,
    AssetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
