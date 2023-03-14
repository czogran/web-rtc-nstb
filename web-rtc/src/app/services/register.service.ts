import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {apiUrl} from "../../environments/url";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RegisterService {

    constructor(private httpClient: HttpClient,) {
    }


    register(userRegiser: UserRegiser): Observable<any> {
       return  this.httpClient.post(apiUrl.register, userRegiser)
    }
}


export interface UserRegiser {
    login?: string
    name?: string
    surname?: string
    nickname?: string
}