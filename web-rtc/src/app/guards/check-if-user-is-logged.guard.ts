import { Injectable } from '@angular/core'
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { LoginService } from '../services/login.service'
import { UserService } from '../services/user.service'

@Injectable({
    providedIn: 'root',
})
export class CheckIfUserIsLoggedGuard implements CanActivate {
    constructor(
        private loginService: LoginService,
        private userService: UserService,
        private router: Router
    ) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.loginService.isUserLogged || this.router.navigateByUrl('/login')
    }
}
