import {HttpClient} from '@angular/common/http'
import {Injectable, OnDestroy} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {CookieService} from 'ngx-cookie-service'
import {Observable, tap} from 'rxjs'
import {apiUrl} from '../../environments/url'
import {UserService} from './user.service'

@Injectable({
    providedIn: 'root',
})
export class LoginService implements OnDestroy {
    isUserLogged: boolean

    cookie: string

    constructor(
        private httpClient: HttpClient,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private router: Router,
        private cookieService: CookieService
    ) {
        console.log('wwwwwwwwwww')
    }

    login(login: string): Observable<any> {
        // let options = new ({ headers: headers, withCredentials: true });

        return this.httpClient.post(apiUrl.login, {login: login}, {responseType: 'text'}).pipe(
            tap((cookie) => {
                this.cookie = cookie
                // console.log('r')
                // console.log(cookie)
                // this.cookieService.set("user", cookie, {secure: true})
                this.isUserLogged = true
            })
        )
    }

    logout() {
        return this.httpClient
            .post(apiUrl.logout, {})
            .pipe(
                tap((r) => {
                    // console.
                    // this.cookie.set()
                })
            )
            .subscribe(() => {
                this.isUserLogged = false
                this.userService.clearUserData()
                this.router.navigate(['/login'])
            })
    }

    ngOnDestroy(): void {
        console.log('ngOnDestroy')
    }
}

interface LoginResponse {
    userIdn: string
}
