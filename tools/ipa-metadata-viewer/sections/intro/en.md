## Open an IPA and read the main app metadata

Drop an iOS `.ipa` file or choose **Open IPA file**. The viewer reads the main app's property list at a path such as `Payload/Trail Notes.app/Info.plist`. Try the sample IPA to see the fields before opening your own file. Archive extraction and property-list parsing happen in your browser.

## Understand bundle identifiers, versions, and platforms

The bundle identifier, stored in `CFBundleIdentifier`, identifies the app bundle. The version in `CFBundleShortVersionString` is the release version, and `CFBundleVersion` identifies the build. Use `MinimumOSVersion` and `CFBundleSupportedPlatforms` to check the minimum system version and the platform names recorded in the package. The display name comes from `CFBundleDisplayName` or `CFBundleName`.

## Inspect and export Info.plist

Select **Info.plist** to see the full property list as readable XML, including keys beyond the overview. The viewer can read binary and XML property lists. Choose **Copy XML** to use the readable form in another tool, or **Download Info.plist** to save the original bytes. The displayed archive path tells you which app bundle supplied the metadata.

[Apple Information Property List reference](https://developer.apple.com/documentation/bundleresources/information-property-list)
