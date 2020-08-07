// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  authority: "https://id.getharvest.com",
  clientId: "UQ8SJ45lQcQmPd3a7q91nnq_",
  scope: "harvest:all",
  redirectUri: "http://localhost:4200#",
  requireHttps: false,
  authorizeEndpoint: "https://id.getharvest.com/oauth2/authorize",
};
