import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetHeaders = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const { rawHeaders } = context.switchToHttp().getRequest();

    return rawHeaders;
  },
);
