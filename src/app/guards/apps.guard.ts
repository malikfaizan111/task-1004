import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class AppsGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        let roles = route.data["roles"] as Array<string>;
        let UrbanpointAdmin = JSON.parse(localStorage.getItem('UrbanpointAdmin'));
        if (UrbanpointAdmin && UrbanpointAdmin.auth_key != null) 
        {
            if(UrbanpointAdmin.name == '1' && UrbanpointAdmin.role !='2')
            {
                return true;
            }
            if ((UrbanpointAdmin.name == '2' && roles[0] == 'other' || UrbanpointAdmin.name == '3' && roles[0] == 'other' ) && (UrbanpointAdmin.role !='2'))
            {
                return true;
            }
            if((UrbanpointAdmin.name == '1' || UrbanpointAdmin.name == '2' || UrbanpointAdmin.name == '3' || UrbanpointAdmin.name == '4') && (UrbanpointAdmin.role =='2' && roles[1] == '2'))
            {
                return true;
            }
            if((UrbanpointAdmin.name == '5') && (UrbanpointAdmin.role =='3' && roles[2] == '3'))
              {
                return true;
            }
            else
            {
                return false;
            }
        }
        this.router.navigate(['/auth/login']);
        return false;
    }
}

