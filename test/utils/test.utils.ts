import { testAuthUtil } from './auth.test';
import { testCommonUtil } from './common.test';
import { testNotificationUtil } from './notification.test';

export const testUtils = () => {
  describe('Test Auth Util', testAuthUtil);
  describe('Test Common Util', testCommonUtil);
  describe('Test Notification Util', testNotificationUtil);
};
