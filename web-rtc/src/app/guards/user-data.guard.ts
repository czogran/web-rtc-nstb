import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router'
import {catchError, map, Observable, throwError} from 'rxjs'
import { UserService } from '../services/user.service'
import { isNullOrUndefined } from '../utils/utils'

@Injectable({
    providedIn: 'root',
})
export class UserDataGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        console.log(!isNullOrUndefined(this.userService.userIdn))
        return (
            !isNullOrUndefined(this.userService.userIdn) ||
            this.userService.getUserData().pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        this.router.navigate(['/login'])
                    }
                    return throwError(() => error)
                }),
                map((response) => !isNullOrUndefined(response))
            )
        )
    }
}
