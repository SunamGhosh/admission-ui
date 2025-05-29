import { CanActivateFn, Router } from '@angular/router';

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  let token = localStorage.getItem('token')
 let r = new Router()
 if (!token){
  let url = r.parseUrl('/login');
  return url
 }else{
  return true;
}}
