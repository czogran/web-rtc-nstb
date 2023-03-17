import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { Observable, tap } from 'rxjs'
import { apiUrl } from '../../environments/url'
import { UserService } from './user.service'

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    isUserLogged: boolean

    cookie: string

    constructor(
        private httpClient: HttpClient,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private router: Router,
        private cookieService: CookieService
    ) {
        this.cookie = this.cookieService.get('user')
    }

    login(login: string): Observable<any> {
        return this.httpClient
            .post(apiUrl.login, { login: login }, { responseType: 'text' })
            .pipe(
                tap((cookie) => {
                    this.cookie = cookie
                    this.cookieService.set('user', cookie)
                    this.isUserLogged = true
                })
            )
    }

    logout() {
        return this.httpClient.post(apiUrl.logout, {}).subscribe(() => {
            this.isUserLogged = false
            this.userService.clearUserData()
            this.cookie = null
            this.cookieService.delete('user')
            this.router.navigate(['/login'])
        })
    }
}
