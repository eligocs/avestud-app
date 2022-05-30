// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var api_prefix = 'api/v1/auth/';
export const environment = {
  production: false,
  apiUrl: 'https://avestud.com/'+api_prefix,
  //apiUrl: 'https://av.madlipz.ch/'+api_prefix,
  //apiUrl: 'http://127.0.0.1:8000/'+api_prefix,
  //apiUrl: 'http://101.53.133.121:80/'+api_prefix,
  s3url: 'https://aaradhanaclasses.s3.ap-south-1.amazonaws.com/',
  razorpay_key: 'rzp_test_dEB5l9lXVz5Hbo',
};

/* 
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
