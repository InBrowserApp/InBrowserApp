## What It Does

فك تشفير ترويسة HTTP Basic Authorization لاستخراج اسم المستخدم وكلمة المرور من Base64. مفيد لاستكشاف الأخطاء وإصلاحها واختبار واجهة برمجة التطبيقات.

## Accepted Input

الصق شيئًا مثل: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
