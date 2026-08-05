export type JwtPayload = {
  email: string;
  sub: string;
  type: 'access' | 'refresh';
};
