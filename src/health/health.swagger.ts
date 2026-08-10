import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiHealthLive(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({
      summary: 'Verify if API is running',
      description: 'Check if API is running',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      type: Object,
      isArray: false,
      description: 'Status of API',
    })(target, propertyKey, descriptor);
  };
}

export function ApiHealthReady(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({
      summary: 'Verify if Database and memory of API',
      description: 'Check if Database and memory of API is UP',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      type: Object,
      isArray: false,
      description: 'Database and memory status of API',
    })(target, propertyKey, descriptor);
  };
}

export function ApiHealth(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({
      summary: 'Full Check API',
      description: 'Check Database, memory and API of API',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      type: Object,
      isArray: false,
      description: 'Database, memory and API status of API',
    })(target, propertyKey, descriptor);
  };
}
