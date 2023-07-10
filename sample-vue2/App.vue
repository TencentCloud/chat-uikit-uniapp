<script lang="ts">
import { TUIChatKit } from "./TUIKit";
TUIChatKit.init();
const SDKAppID = 0; // Your SDKAppID
const secretKey = ""; //Your secretKey

uni.$chat_SDKAppID = SDKAppID;
uni.$chat_secretKey = secretKey;

export default {
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};

</script>
<style>
/*每个页面公共css */
uni-page-body,
html,
body,
page {
  width: 100% !important;
  height: 100% !important;
  overflow: hidden;
}
</style>
