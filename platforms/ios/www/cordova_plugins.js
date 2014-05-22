cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.auth0.sdk/www/auth0.js",
        "id": "com.auth0.sdk.Auth0Client",
        "clobbers": [
            "Auth0Client"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js",
        "id": "org.apache.cordova.inappbrowser.inappbrowser",
        "clobbers": [
            "window.open"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.auth0.sdk": "0.1.1",
    "org.apache.cordova.inappbrowser": "0.4.1-dev"
}
// BOTTOM OF METADATA
});