import Configuration from "./constants/configuration";

export default () => {
    const configuration = Configuration();
    return {
        authority: configuration.okta.domain || "",
        client_id: configuration.okta.clientId || "",
        redirect_uri: window.location.origin + "/idp/okta",
        response_type: "code",
        scope: "openid profile email groups okta.users.read okta.roles.read okta.groups.read",
        post_logout_redirect_uri: window.location.origin + "/login",
        loadUserInfo: true
    };
};

// curl -H "Content-type:application/x-www-form-urlencoded" -v -X POST https://trial-5760180.okta.com/oauth2/v1/introspect -d "client_id=0oa5n9t3tsYb4x2GK697&token_type_hint=access_token&token=eyJraWQiOiJaOHB6SG1rbl9idnFjdUozOWlKa1doNVNDY196dEMwLXhmeEN2VU1SamVvIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULjJnOVVSa1NscnRrSDhwTVp3a28ydXhVcDlYbFdVMlNXWVZ3VkY5ZEJKUW8iLCJpc3MiOiJodHRwczovL3RyaWFsLTU3NjAxODAub2t0YS5jb20iLCJhdWQiOiJodHRwczovL3RyaWFsLTU3NjAxODAub2t0YS5jb20iLCJzdWIiOiJ2aW5lZXQua3VtYXJAcHJpdmFkby5haSIsImlhdCI6MTY4NTMyMTAyMiwiZXhwIjoxNjg1MzI0NjIyLCJjaWQiOiIwb2E1bjl0M3RzWWI0eDJHSzY5NyIsInVpZCI6IjAwdTVuOXRsdjIxSmg2SnRZNjk3Iiwic2NwIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJlbWFpbCJdLCJhdXRoX3RpbWUiOjE2ODUzMjAzNzR9.dhbqAfm_1Rbu_uiYGWUeFa0wmiIEIhN1qMLPAljqbObzguDtwqDDSR2vZhjVTjcdJ3LpjgRZDWSvlOU26j7wGB2ulztoWshiaz7Mo9-FtmeGoLcaW_Q-qVH28ax-72ncLrk21BRTAuAq_UeHRUtHtzjOyF9ilOf74Rle-Qcju2WsZYn2xMWhVw19upAov5yiasKNxRXYlIk7Hx7FuQvstElbKaArvWvLQp9RZEt2Cb11ewWM-3fzwk3K0ez3FcrS7JVdrcVBNrAzpuZkBe_wUd1iwiX97pikoskHJIlGOD5tz-2s6PdNMXaujL9pHforL0CAEkFm2IhWCsYBGYNU9A"
