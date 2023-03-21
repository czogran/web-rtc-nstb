import { Injectable } from '@angular/core'
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
} from '@angular/router'
import { LoginService } from '../services/login.service'

@Injectable({
    providedIn: 'root',
})
export class CheckIfUserIsLoggedGuard implements CanActivate {
    constructor(private loginService: LoginService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> | boolean {
        return (
            this.loginService.isUserLogged ||
            this.router.navigateByUrl('/login')
        )
    }
}
