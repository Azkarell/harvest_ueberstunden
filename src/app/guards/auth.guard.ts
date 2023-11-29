import { OauthService } from '../services/oauth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard  {
  constructor(public auth: OauthService, public router: Router) {}

  async canActivate(): Promise<boolean> {
    await this.auth.tryLogin();
    return true;
  }
}
