import { Type } from '@sinclair/typebox';

export const UserBox = Type.Object({
  _id: Type.String(),
  username: Type.String(),
  email: Type.String({ format: 'email' }),
  fullName: Type.String(),
  status: Type.Boolean(),
  otpEnabled: Type.Boolean(),
  otpVerified: Type.Boolean(),
});

export const RoleBox = Type.Object({
  role: Type.Union([
    Type.Literal('viewer'),
    Type.Literal('editor'),
    Type.Literal('admin'),
    Type.Literal('custom'),
  ]),
  permissions: Type.Array(Type.Any()),
});
