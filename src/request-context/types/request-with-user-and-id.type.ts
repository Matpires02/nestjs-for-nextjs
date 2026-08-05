import { AuthenticatedRequest } from 'src/auth/types/autenticated-request';
import { RequestWithId } from './request-with-id.type';

export type RequestWithUser = AuthenticatedRequest & RequestWithId;
