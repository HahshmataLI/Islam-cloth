import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Retrieve the auth token from local storage
  const authToken = localStorage.getItem('authToken');
  console.log('Interceptor executing. Token:', authToken); 
  // If there is a token, clone the request and add the Authorization header
  if (authToken) {
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    
    return next(clonedRequest);
  }

  // If no token, proceed with the original request
  return next(req);
};
