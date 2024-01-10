import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecondConfigModule } from 'src/components/config/config.module';
import { SecondConfigService } from 'src/components/config/config.service';
import { Customer } from 'src/components/customer/entity/customer.entity';
import { Order } from 'src/components/order/entity/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SecondConfigModule],
      inject: [SecondConfigService],
      useFactory: async (secondConfigService: SecondConfigService) => {
        const dbConfig = secondConfigService.getDBConfig();
        return {
          type: 'postgres',
          host: dbConfig.DB_HOST,
          port: Number(dbConfig.DB_PORT),
          username: dbConfig.DB_USER_NAME,
          password: dbConfig.DB_PASSWORD,
          database: dbConfig.DB_DATABASE,
          entities: [Customer, Order],
          synchronize: false,
          logging: true,
          charset: 'utf8mb4',
        };
      },
    }),
  ],
})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      global: true,
    };
  }
}
