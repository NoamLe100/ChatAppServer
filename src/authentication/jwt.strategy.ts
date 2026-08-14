import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import type { Request } from 'express'; 


const cookieExtractor = (req:Request):string |null =>{
  if (req && req.cookies){
    return req.cookies['token'];
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        const secret = process.env.JWT_SECRET;
        if(!secret){
            throw new Error('JWT_SECRET is not defined in .env');
        }
         super({
       jwtFromRequest: cookieExtractor,
      secretOrKey: secret,
    });
  }
   async validate(payload: { userId: number }) {
    return { userId: payload.userId };
  }
}
