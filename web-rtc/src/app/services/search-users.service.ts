import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'
import { apiUrl } from '../../environments/url'
import { User } from './user.service'

@Injectable({
    providedIn: 'root',
})
export class SearchUsersService {
    constructor(private httpClient: HttpClient) {}

    searchUsers(query: string): Observable<{ users: User[] }> {
        return this.httpClient
            .post(apiUrl.searchUsers, { query: query })
            .pipe(map((response) => response as { users: User[] }))
    }
}
