import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  private jwtSecret = process.env.JWT_SECRET_KEY || 'secret';

  use(req: any, res: any, next: () => void) {
    const allowedRoutes = ['/auth/signup', '/auth/login', '/doc', '/'];
    if (allowedRoutes.includes(req.path)) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, this.jwtSecret);
      next();
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
