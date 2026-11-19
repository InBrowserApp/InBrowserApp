## Obtenir un code 2FA à partir d’une clé ou d’un code QR

Ouvrez les paramètres d’authentification à deux facteurs du site à protéger et choisissez l’option d’application d’authentification. Importez ou scannez son code QR, ou collez la clé de configuration ou le lien `otpauth://` et sélectionnez **Ajouter un compte**. Collez le code actuel dans le champ de vérification du site pour terminer la configuration.

## Transférer des comptes depuis un autre authentificateur

Dans Google Authenticator, choisissez **Transférer des comptes**, puis exportez les comptes à transférer. Ici, scannez les codes QR d’exportation avec **Utiliser la caméra**, ou importez les images enregistrées ensemble. Dans [l’authentificateur InBrowser.App d’origine](https://authenticator.inbrowser.app/), ouvrez **Export**, choisissez **Google Authenticator**, puis téléchargez l’image du code QR et importez-la ici.

Les comptes TOTP importés via les codes QR de transfert Google utilisent un intervalle de 30 secondes. Pour conserver les intervalles personnalisés de l’authentificateur d’origine, transférez les comptes séparément. Cliquez sur l’icône d’engrenage de chaque compte, dépliez **Key URI** dans **Config** et collez le lien ici.

Les comptes sont enregistrés dans ce navigateur. Avant d’effacer les données du site ou de changer de navigateur, récupérez une sauvegarde via **Exporter les comptes**. Gardez-la pour vous, car elle contient vos clés de configuration.

## Pourquoi mon code de vérification est-il refusé ?

La plupart des sites utilisent des codes qui dépendent de l’heure (TOTP). Vérifiez que l’heure de votre appareil est réglée automatiquement. Si le code actuel est sur le point d’expirer, attendez le suivant. Les codes basés sur un compteur (HOTP) restent identiques tant que vous ne sélectionnez pas **Code suivant**. Dans les deux cas, utilisez le code du bon compte et respectez les paramètres personnalisés indiqués par le site.
