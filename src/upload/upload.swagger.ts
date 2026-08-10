import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiUploadPost(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'Upload a file',
      description: 'Upload a file and retrieve your public URL.',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 403, description: 'Forbidden.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: 200,
      type: Object,
      isArray: false,
      description: 'Public URL of uploaded image',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 401, description: 'Unauthorized.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}
