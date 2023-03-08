import { HttpClient } from '@angular/common/http'
import { Injectable, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable, tap } from 'rxjs'
import { apiUrl } from '../../environments/url'
import { UserService } from './user.service'

@Injectable({
    providedIn: 'root',
})
export class LoginService implements OnDestroy {
    isUserLogged: boolean
    constructor(
        private httpClient: HttpClient,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private router: Router
    ) {
        console.log('wwwwwwwwwww')
    }

    login(login: string): Observable<any> {
        return this.httpClient.post(apiUrl.login, { login: login }).pipe(
            tap(() => {
                this.isUserLogged = true
            })
        )
    }

    logout() {
        return this.httpClient
            .post(apiUrl.logout, {})
            .pipe(
                tap(() => {
                    this.isUserLogged = false
                    this.userService.clearUserData()
                    this.router.navigate(['/login'])
                })
            )
            .subscribe()
    }

    ngOnDestroy(): void {
        console.log('ngOnDestroy')
    }
}

interface LoginResponse {
    userIdn: string
}
