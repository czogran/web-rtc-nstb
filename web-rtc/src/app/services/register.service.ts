import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apiUrl } from '../../environments/url'

@Injectable({
    providedIn: 'root',
})
export class RegisterService {
    constructor(private httpClient: HttpClient) {}

    register(userRegiser: UserRegiser): Observable<any> {
        return this.httpClient.post(apiUrl.register, userRegiser)
    }
}

export interface UserRegiser {
    login?: string
    name?: string
    surname?: string
    nickname?: string
}
