import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';

export function ApiUserGetMe(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'Get authenticated user',
      description: 'Retrieve a authenticated User',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 403, description: 'Forbidden.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: 200,
      type: UserResponseDto,
      isArray: false,
      description: 'Logged User',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 401, description: 'Unauthorized.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}

export function ApiUserCreate(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({
      summary: 'Create a new User',
      description: 'Create a new user',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      type: UserResponseDto,
      isArray: false,
      description: 'User created',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 500, description: 'Internal Error.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}

export function ApiUserUpdate(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({
      summary: 'Update a User',
      description: 'Update a logged user',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      type: UserResponseDto,
      isArray: false,
      description: 'User updated successfuly',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 500, description: 'Internal Error.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({ status: 401, description: 'Unauthorized.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({ status: 403, description: 'Forbidden.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiBearerAuth()(target, propertyKey, descriptor);
  };
}

export function ApiUserPasswordUpdate(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({
      summary: 'Update a User password',
      description: 'Update a logged user password',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      type: UserResponseDto,
      isArray: false,
      description: 'User password updated successfuly',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 500, description: 'Internal Error.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({ status: 401, description: 'Unauthorized.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({ status: 403, description: 'Forbidden.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiBearerAuth()(target, propertyKey, descriptor);
  };
}

export function ApiUserDelete(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'Delete a User',
      description: 'Delete a user',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      type: UserResponseDto,
      isArray: false,
      description: 'User deleted successfuly',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 500, description: 'Internal Error.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({ status: 401, description: 'Unauthorized.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({ status: 403, description: 'Forbidden.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}
