setImmediate(function () {
    if (Java.available) {

        Java.perform(function () {

            console.log("hooking");

            var Build = Java.use('android.os.Build');
            var TelephonyManager = Java.use('android.telephony.TelephonyManager');
            Build.ABI.value = "arm64-v8a";
            Build.ABI2.value = "arm64-v8a";
            Build.BOARD.value = "random";
            Build.BRAND.value = "google";
            Build.DEVICE.value = "crosshatch";
            Build.FINGERPRINT.value = "google/crosshatch/crosshatch:9/PD1A.180720.030/4972053:user/release-keys";
            Build.HARDWARE.value = "random";
            Build.HOST.value = "abfarm640";
            Build.ID.value = "PD1A.180720.030";
            Build.MANUFACTURER.value = "Google";
            Build.MODEL.value = "Pixel 3 XL";
            Build.PRODUCT.value = "crosshatch";
            Build.USER.value = "android-build";

            TelephonyManager.getDeviceId.implementation = function () {
                return "123456789";
            };

            TelephonyManager.getLine1Number.implementation = function () {
                return "123456789";
            };

            TelephonyManager.getNetworkCountryIso.implementation = function () {
                return "sk";
            };

            TelephonyManager.getNetworkType.implementation = function () {
                return "5";
            };

            TelephonyManager.getNetworkOperator.implementation = function () {
                return "14523698";
            };

            TelephonyManager.getPhoneType.implementation = function () {
                return "2";
            };

            TelephonyManager.getSimCountryIso.implementation = function () {
                return "sk";
            };
            TelephonyManager.getSimSerialNumber.implementation = function () {
                return "123456789";
            };
            TelephonyManager.getSubscriberId.implementation = function () {
                return "123456789";
            };

            TelephonyManager.getVoiceMailNumber.implementation = function () {
                return "123456789";
            };


            // var EmulatorProperties = {
            //     "ro.product.cpu.abi": "arm64-v8a",
            //     "ro.product.cpu.abilist": "arm64-v8a,armeabi-v7a,armeabi",
            //     "ro.product.cpu.abilist32": "armeabi-v7a,armeabi",
            //     "ro.product.cpu.abilist64": "arm64-v8a",
            //     "ro.build.id": "PD1A.180720.030",
            //     "ro.build.user": "android-build",
            //     "ro.build.host": "abfarm640",
            //     "ro.build.tags": "release-keys",
            //     "ro.product.model": "Pixel 3 XL",
            //     "ro.product.brand": "google",
            //     "ro.product.device": "crosshatch",
            //     "ro.product.name": "crosshatch",
            //     "ro.build.fingerprint": "google/crosshatch/crosshatch:9/PD1A.180720.030/4972053:user/release-keys",
            //     "ro.product.manufacturer": "Google",
            // };


            Build.getRadioVersion.implementation = function () {
                return "123456";
            };

            Build.getSerial.implementation = function () {
                return "123456";
            };


        });
    }
});
