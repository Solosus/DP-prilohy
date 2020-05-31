if (Java.available) {

    Java.perform(function () {

        var DefaultConfigSource = Java.use("android.security.net.config.ManifestConfigSource$DefaultConfigSource");
        var ManifestConfigSource = Java.use("android.security.net.config.ManifestConfigSource");
        var ApplicationInfo = Java.use("android.content.pm.ApplicationInfo");
        var NetworkSecurityConfig = Java.use("android.security.net.config.NetworkSecurityConfig");
        var UserCertificateSource = Java.use("android.security.net.config.UserCertificateSource");
        var CertificatesEntryRef = Java.use("android.security.net.config.CertificatesEntryRef");


        ManifestConfigSource.getConfigSource.implementation = function () {

            console.log("Hooking ManifestConfigSource getConfigSource method");

            var source = DefaultConfigSource.$new(true, ApplicationInfo.$new(Java.use('android.app.ActivityThread').currentApplication().getApplicationContext().getApplicationInfo()));

            console.log("returning DefaultConfigSource");
            return source;

        };

        NetworkSecurityConfig.getDefaultBuilder.overload("android.content.pm.ApplicationInfo").implementation = function (info) {
            console.log("Hooking NetworkSecurityConfig getDefaultBuilder method");

            console.log("Calling original method to produce builder");
            var builder = this.getDefaultBuilder.call(this, info);
            console.log("Adding user certificates to trusted");
            builder.addCertificatesEntryRef(CertificatesEntryRef.$new(UserCertificateSource.getInstance(), false));

            console.log("Returning custom builder with trusted user certs");

            return builder;
        };


    })

}