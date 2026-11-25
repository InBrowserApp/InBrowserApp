## Open an APK and read its manifest

Drop an Android `.apk` file or choose **Open APK or manifest**. The viewer opens the packaged `AndroidManifest.xml`, including the compiled binary XML found in most APKs. You can also open a previously extracted binary or text manifest. Try the sample APK to explore the overview and decoded XML. Your files stay in your browser.

## Understand the package, version, and SDK fields

The **Package name** identifies the Android app. The version name is the release label shown to users, while the version code is the number Android uses to order updates. The minimum SDK is the earliest Android API level the manifest declares, and the target SDK identifies the API level the app targets. Fields omitted from the manifest appear as unspecified.

## Inspect permissions and export AndroidManifest.xml

The overview lists permission names declared by the package. Android determines actual grants on the device using the OS version, app settings, and user choices. Open **Manifest XML** to read components, intent filters, and conditional permission declarations. Use **Copy XML** or **Download XML** to keep the decoded file. References to compiled resources may appear as IDs such as `@0x7f010001`.

[Android manifest structure and elements](https://developer.android.com/guide/topics/manifest/manifest-intro)
