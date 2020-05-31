setImmediate(function () {
    if (Java.available) {
        Java.perform(function () {

            //var ApplicationInfo = Java.use("android.content.pm.ApplicationInfo");
            var ContextWrapper = Java.use("android.content.ContextWrapper");
            var Debug = Java.use("android.os.Debug");
            var FLAG_DEBUGGABLE = 1 << 1;

            ContextWrapper.getApplicationInfo.implementation = function () {

                var appInfo = this.getApplicationInfo.call(this);

                appInfo.flags.value &= ~FLAG_DEBUGGABLE;

                return appInfo;


            };
            Debug.isDebuggerConnected.implementation = function () {
                return false;

            }

        });
    }
});
