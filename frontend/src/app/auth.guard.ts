import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { catchError, map, of, switchMap } from 'rxjs';

export const authGuard = (expectedRole: string) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  let token = localStorage.getItem('access_token');

  if (!token) {
    router.navigate(['/entrar']);
    return of(false);
  }

  function getHomePageForRole(role: string): string {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'user':
        return '/';
      default:
        return '/entrar';
    }
  }

  return authService.validateToken(token).pipe(
    switchMap((user) => {
      if (user.role === expectedRole) {
        return of(true);
      } else {
        const homePageForRole = getHomePageForRole(user.role);
        router.navigate([homePageForRole]);
        return of(false);
      }
    }),
    catchError(() => {
      localStorage.removeItem('access_token');
      router.navigate(['/entrar']);
      return of(false);
    })
  );
};
