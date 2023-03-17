import { Injectable } from '@angular/core'
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router'
import { Observable, of } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class UserDataResolver implements Resolve<boolean> {
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return of(true)
    }
}
