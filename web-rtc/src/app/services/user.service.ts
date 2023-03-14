import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map, Observable, tap } from 'rxjs'
import { apiUrl } from '../../environments/url'

@Injectable({
    providedIn: 'root',
})
export class UserService {
    public loggedUser: User | undefined
    public userIdn: string | undefined
    constructor(private httpClient: HttpClient) {}

    getUserData(): Observable<User> {
        return this.httpClient.post(apiUrl.userData, {}).pipe(
            map((response) => response as User),
            tap((response) => {
                this.userIdn = response.idn
                this.loggedUser = response
            })
        )
    }

    clearUserData() {
        this.loggedUser = undefined
        this.userIdn = undefined
    }
}

export interface User {
    idn: string
    name?: string
    surname?: string
    nickname?: string
}
