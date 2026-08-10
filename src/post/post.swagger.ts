import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { PostResponseDto } from './dto/post-response.dto';

export function ApiPostCreate(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'Create a new Post',
      description: 'Create a new Post',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 403, description: 'Forbidden.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: 200,
      type: PostResponseDto,
      isArray: false,
      description: 'New Post created',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 401, description: 'Unauthorized.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: 400,
      description: 'Invalid Data',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 500, description: 'Internal Error.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}

export function ApiPostById(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiParam({
      name: 'id',
      description: 'Post ID',
      required: true,
      type: String,
    })(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'Get Post by id',
      description: 'Retrieve a specific Post by its unique identifier.',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      type: PostResponseDto,
      isArray: false,
      description: 'Post finded successefuly',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 403, description: 'Forbidden.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({ status: 401, description: 'Unauthorized.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: 400,
      description: 'Invalid Data',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 500, description: 'Internal Error.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}

export function ApiPostMyAllPost(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'Get all my posts',
      description: 'Retrieve any posts publicated by authenticated user.',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      type: PostResponseDto, //TODO: Verificar
      isArray: true,
      description: 'All posts created by authenticated user',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 403, description: 'Forbidden.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({ status: 401, description: 'Unauthorized.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: 400,
      description: 'Invalid Data',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 500, description: 'Internal Error.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}

export function ApiPostUpdate(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiParam({
      name: 'id',
      description: 'Post ID',
      required: true,
      type: String,
    })(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'Update a Post',
      description: 'Update a Post',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 403, description: 'Forbidden.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: 200,
      type: PostResponseDto,
      isArray: false,
      description: 'Post updated successfuly',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 401, description: 'Unauthorized.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: 400,
      description: 'Invalid Data',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 500, description: 'Internal Error.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}

export function ApiPostDelete(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiParam({
      name: 'id',
      description: 'Post ID',
      required: true,
      type: String,
    })(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'Delete a Post',
      description: 'Delete a Post',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 403, description: 'Forbidden.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: 200,
      description: 'Post deleted successfuly',
      type: PostResponseDto,
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 401, description: 'Unauthorized.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: 400,
      description: 'Invalid Data',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 500, description: 'Internal Error.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}

export function ApiPostBySlug(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiParam({
      name: 'slug',
      description: 'Slug of Post',
      required: true,
      type: String,
    })(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'Get a published Post by slug',
      description: 'Retrieve a specific publishedd Post by slug.',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      type: PostResponseDto,
      isArray: false,
      description: 'Post find successfuly',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 403, description: 'Forbidden.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({ status: 401, description: 'Unauthorized.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: 400,
      description: 'Invalid Data',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 500, description: 'Internal Error.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}

export function ApiPostGetAllPublishedPosts(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({
      summary: 'Get all published posts',
      description: 'Retrieve all posts publicated.',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      type: PostResponseDto,
      isArray: true,
      description: 'All public posts',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 403, description: 'Forbidden.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({ status: 401, description: 'Unauthorized.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({ status: 500, description: 'Internal Error.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}
