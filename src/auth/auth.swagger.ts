import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiAuthLogin(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({
      summary: 'Auth',
      description: 'Authenticate in API.',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      isArray: false,
      description: 'Login successfull',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 401, description: 'Unauthorized.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}
