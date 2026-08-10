import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { ApiHealth, ApiHealthLive, ApiHealthReady } from './health.swagger';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private readonly healthIndicator: HealthIndicatorService,
  ) {}

  /**
   * Liveness
   *
   * Verifica apenas se a aplicação está funcionando.
   */
  @Get('live')
  @ApiHealthLive()
  @HealthCheck()
  live() {
    return this.health.check([
      () => {
        const indicator = this.healthIndicator.check('api');

        return indicator.up({
          message: 'API is running',
        });
      },
    ]);
  }

  /**
   * Readiness
   *
   * Verifica se a aplicação está pronta
   * para receber requisições.
   */
  @Get('ready')
  @ApiHealthReady()
  @HealthCheck()
  ready() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
    ]);
  }

  /**
   * Health geral da aplicação.
   */
  @Get('')
  @HealthCheck()
  @ApiHealth()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
      () => {
        const indicator = this.healthIndicator.check('api');

        return indicator.up({
          message: 'API is running',
        });
      },
    ]);
  }
}
