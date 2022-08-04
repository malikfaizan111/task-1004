import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class MainAuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        let UrbanpointAdmin = JSON.parse(localStorage.getItem('UrbanpointAdmin'));
        if (UrbanpointAdmin && UrbanpointAdmin.auth_key != null) 
        {
            return true;
        }
        this.router.navigate(['/auth/login']);
        return false;
    }
}

