export const authConfig = {
    // Url of the Identity Provider
    issuer: 'https://github.com/login/oauth/authorize',

    // URL of the SPA to redirect the user to after login
    redirectUri: window.location.origin + '/home.html',

    // The SPA's id. The SPA is registerd with this id at the auth-server
    clientId: '004b2ee1deb1794c5e96',

    // set the scope for the permissions the client should request
    // The first three are defined by OIDC. The 4th is a usecase-specific one
    scope: 'openid profile email voucher',
};
