## Convertir un dessin DXF en SVG

Cliquez sur **Ouvrir un fichier DXF** ou déposez un dessin `.dxf` au format ASCII. Cliquez sur **Essayer un exemple** pour charger un support avec son profil, ses perçages, ses traits d’axe et ses annotations. L’outil lit le dessin dans votre navigateur et affiche un aperçu vectoriel. Cliquez sur **Télécharger le SVG** pour enregistrer la géométrie sélectionnée de l’espace objet dans un fichier SVG autonome.

## Choisir les calques à exporter

Dans **Calques**, sélectionnez les calques que vous souhaitez exporter. L’aperçu se met à jour lorsque vous ajoutez ou retirez un calque. Par exemple, exportez le contour et les perçages pour une illustration, ou ajoutez les traits d’axe et les annotations pour une vue annotée. Le SVG conserve les calques sélectionnés sous forme de groupes vectoriels distincts.

## Conserver l’échelle du dessin

Si le DXF indique une unité de longueur, par exemple des millimètres ou des pouces, le SVG enregistre les dimensions physiques en millimètres. La géométrie conserve son échelle d’origine dans le fichier. Pour un DXF sans unité, la `viewBox` du SVG utilise les coordonnées du dessin. L’aperçu s’adapte à l’espace disponible à l’écran. [Variables d’en-tête DXF](https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-DXF/files/GUID-A85E8E67-27CD-4C59-BE61-4DC9FADBE74A.htm)

## Exporter la géométrie de l’espace objet

Le convertisseur exporte les lignes, polylignes, arcs, cercles, blocs et textes pris en charge. Les courbes sont tracées avec des segments vectoriels et les textes compatibles sont convertis en contours vectoriels à l’aide des polices disponibles. Pour une présentation, déplacez la géométrie dans l’espace objet avant d’exporter le DXF. Pour examiner le dessin, déplacez la vue, zoomez et affichez ou masquez les calques dans la [Visionneuse DXF](../dxf-viewer/).
