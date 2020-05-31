Java.perform(function () {
    var RootPackages = ["com.noshufou.android.su", "com.noshufou.android.su.elite", "eu.chainfire.supersu",
        "com.koushikdutta.superuser", "com.thirdparty.superuser", "com.yellowes.su", "com.koushikdutta.rommanager",
        "com.koushikdutta.rommanager.license", "com.dimonvideo.luckypatcher", "com.chelpus.lackypatch",
        "com.ramdroid.appquarantine", "com.ramdroid.appquarantinepro", "com.devadvance.rootcloak", "com.devadvance.rootcloakplus",
        "de.robv.android.xposed.installer", "com.saurik.substrate", "com.zachspong.temprootremovejb", "com.amphoras.hidemyroot",
        "com.amphoras.hidemyrootadfree", "com.formyhm.hiderootPremium", "com.formyhm.hideroot", "me.phh.superuser",
        "eu.chainfire.supersu.pro", "com.kingouser.com", "com.topjohnwu.magisk"
    ];

    var RootBinaries = ["su", "busybox", "supersu", "Superuser.apk", "KingoUser.apk", "SuperSu.apk"];

    var RootProperties = {
        "ro.build.selinux": "1",
        "ro.debuggable": "0",
        "service.adb.root": "0",
        "ro.secure": "1"
    };



    var PackageManager = Java.use("android.app.ApplicationPackageManager");

    var Runtime = Java.use('java.lang.Runtime');

    var SystemProperties = Java.use('android.os.SystemProperties');





    PackageManager.getPackageInfo.implementation = function (pname, flags) {
        if (RootPackages.indexOf(pname) > -1) {
            send("Bypass root check for package: " + pname);
            pname = "random.bypass.package";
        }
        return this.getPackageInfo.call(this, pname, flags);
    };

    Runtime.exec.overload('java.lang.String').implementation = function (cmd) {
        if (RootBinaries.indexOf(cmd) != -1) {
            var bypass = "randomcommand";
            send("Bypass " + cmd + " command");
            return exec1.call(this, bypass);
        }
        return exec1.call(this, cmd);
    };


    SystemProperties.get.overload('java.lang.String').implementation = function (name) {

        if (name in RootProperties) {
            send("Bypass " + name);
            return RootProperties[name];
        }


        return this.get.call(this, name);
    };


    

});