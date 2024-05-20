const getAndroidNotificationAuth = () => {
  const main = plus.android.runtimeMainActivity();
  let NotificationManagerCompat = plus.android.importClass(
    'android.support.v4.app.NotificationManagerCompat',
  );
  // android.support.v4 升级为 androidx
  if (!NotificationManagerCompat) {
    NotificationManagerCompat = plus.android.importClass(
      'androidx.core.app.NotificationManagerCompat',
    );
  }
  const isNotificationsEnabled
    = NotificationManagerCompat.from(main).areNotificationsEnabled();
  if (!isNotificationsEnabled) {
    uni.showModal({
      title: '推送需要通知栏权限',
      content: '是否开启通知栏权限?',
      success: (res) => {
        if (res.confirm) {
          openAndroidNotification();
        } else if (res.cancel) {
          console.warn('用户点击取消');
        }
      },
    });
  }
};

const getIOSNotificationAuth = () => {
  const UIApplication = plus.ios.import('UIApplication');
  const app = UIApplication.sharedApplication();
  if (app.currentUserNotificationSettings) {
    const settings = app.currentUserNotificationSettings();
    const enabledTypes = settings?.plusGetAttribute('types');
    console.log('enabledTypes:' + enabledTypes);
    if (enabledTypes === 0) {
      uni.showModal({
        title: '推送需要通知栏权限',
        content: '是否开启通知栏权限?',
        success: (res) => {
          if (res.confirm) {
            openIOSNotification();
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    }
    plus.ios.deleteObject(settings);
  }
};

export const getNotificationAuth = () => {
  const platform = uni.getSystemInfoSync().platform;
  if (platform === 'ios') {
    getIOSNotificationAuth();
  } else if (platform === 'android') {
    getAndroidNotificationAuth();
  }
};

const openAndroidNotification = () => {
  const main = plus.android.runtimeMainActivity();
  const pkName = main.getPackageName();
  const uid = main.getApplicationInfo().plusGetAttribute('uid');
  const Intent = plus.android.importClass('android.content.Intent');
  const Build = plus.android.importClass('android.os.Build');
  const intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
  // 安卓不同版本差异
  if (Build.VERSION.SDK_INT >= 26) {
    intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
  } else if (Build.VERSION.SDK_INT >= 21) {
    intent.putExtra('app_package', pkName);
    intent.putExtra('app_uid', uid);
  } else {
    intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
    const uri = Uri.fromParts(
      'package',
      mainActivity.getPackageName(),
      null,
    );
    intent.setData(uri);
  }
  // 跳转到该应用的系统通知设置页
  main.startActivity(intent);
};

const openIOSNotification = () => {
  const UIApplication = plus.ios.import('UIApplication');
  const app = UIApplication.sharedApplication();
  const settings = app.currentUserNotificationSettings();
  const NSURL = plus.ios.import('NSURL');
  const appSetting = NSURL.URLWithString('app-settings:');
  const application = UIApplication.sharedApplication();
  application.openURL(appSetting);
  plus.ios.deleteObject(appSetting);
  plus.ios.deleteObject(NSURL);
  plus.ios.deleteObject(application);
  plus.ios.deleteObject(settings);
};
