import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const transloco = inject(TranslocoService);
  return next(req).pipe(
    catchError((error: unknown) => {
      let message: string;
      if (error instanceof HttpErrorResponse) {
        message =
          (error.error as { message?: string } | null)?.message ??
          error.message ??
          transloco.translate('errors.unexpected');
      } else if (error instanceof Error) {
        message = error.message;
      } else {
        message = transloco.translate('errors.unexpected');
      }
      return throwError(() => new Error(message));
    })
  );
};
