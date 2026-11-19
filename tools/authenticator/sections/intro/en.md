## Get a 2FA code from a setup key or QR code

Open two-factor authentication settings on the site you want to protect and choose the authenticator app option. Upload or scan its QR code, or paste the setup key or `otpauth://` link and select **Add account**. Copy the current code into the site's verification field to finish setup.

## Move accounts from another authenticator

In Google Authenticator, choose **Transfer accounts** and export the accounts you want to move. Scan the export QR codes here with **Use camera**, or upload saved QR images one at a time. In the [original InBrowser.App Authenticator](https://authenticator.inbrowser.app/), open **Export**, choose **Google Authenticator**, then download the QR image and upload it here.

Accounts are saved in this browser. Download a backup from **Export accounts** before clearing site data or moving to another browser. Keep the backup private, since it contains your setup keys.

## Why is my verification code rejected?

Most sites use time-based codes (TOTP). Check that your device sets its time automatically, then try the next code if the current one is about to expire. Counter-based codes (HOTP) stay the same until you select **Next code**. For either type, use the code for the correct account and match any custom settings provided by the site.
