## Comment connecter un clavier ou un contrôleur MIDI

Connectez un périphérique MIDI et vérifiez que votre système d’exploitation le reconnaît. Sélectionnez **Activer MIDI**, autorisez l’accès MIDI dans le navigateur si nécessaire, puis choisissez une entrée. Utilisez un navigateur compatible via HTTPS. Le moniteur écoute l’entrée sélectionnée et affiche les messages localement.

## Comment tester les notes et leur vélocité

Appuyez sur une touche ou un pad et observez le piano et le journal des messages. Un message Note On indique la note et sa vélocité, généralement une valeur comprise entre 1 et 127. Un message Note Off ou un message Note On avec une vélocité de 0 relâche la note. Le clavier indique la note MIDI 60 sous le nom C4. Modifiez l’octave de départ pour afficher une autre plage. Les notes maintenues sont répertoriées même lorsqu’elles se trouvent hors de la plage affichée.

## Comment examiner les CC, le pitch bend et l’horloge MIDI

Actionnez un bouton rotatif, un curseur ou une pédale pour voir le numéro et la valeur du message de changement de commande (Control Change ou CC). Par exemple, de nombreuses pédales de sustain envoient le CC 64. Le pitch bend est affiché autour d’une valeur centrale de 0. Les impulsions d’horloge MIDI sont comptées séparément du journal des messages. Une horloge MIDI standard envoie 24 impulsions par noire. Le journal affiche les numéros de canal et les octets bruts en hexadécimal pour examiner chaque message.

## Pourquoi mon entrée MIDI ne répond-elle pas ?

Vérifiez le câble, l’alimentation et le mode du périphérique, et assurez-vous que le port sélectionné correspond au contrôleur. Fermez les autres applications susceptibles d’utiliser l’entrée, puis reconnectez-la. La prise en charge dépend du navigateur et du système d’exploitation. Cet outil écoute les messages MIDI standard avec un accès MIDI normal. Les messages System Exclusive (SysEx) propres à un périphérique nécessitent une autorisation supplémentaire.
