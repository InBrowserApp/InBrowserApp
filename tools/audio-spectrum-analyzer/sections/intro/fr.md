## Examiner les fréquences d’un fichier audio

L’analyseur de spectre audio permet de repérer un ronflement grave, de comparer le contenu fréquentiel de plusieurs enregistrements ou de voir à partir de quelle fréquence les aigus disparaissent. Le graphique affiche la fréquence en hertz (Hz) et le niveau en décibels par rapport à la pleine échelle numérique (dBFS). Les pics indiquent les bandes de fréquences qui concentrent le plus d’énergie dans l’enregistrement analysé.

## Comment visualiser un spectre audio

1. Choisissez ou déposez un fichier mono ou stéréo au format WAV, MP3, M4A, FLAC ou OGG. Les formats lisibles dépendent de votre navigateur.
2. Repérez la fréquence dominante. Survolez ou touchez ensuite le graphique pour lire une autre fréquence et son niveau. Le curseur permet de consulter les mêmes valeurs au clavier.
3. Passez de l’échelle logarithmique à l’échelle linéaire selon vos besoins. Lancez la lecture de l’original pour écouter l’enregistrement pendant l’examen du graphique. L’analyse et la lecture se font sur votre appareil.

## Comment lire le graphique FFT

L’outil décode l’audio à 48 kHz et analyse par transformée de Fourier rapide (FFT) de courts extraits répartis sur le fichier et pondérés par une fenêtre de Hann. Il moyenne leur puissance et combine les puissances des canaux stéréo. Les sons déphasés d’un canal à l’autre restent donc visibles. Le graphique monte jusqu’à 24 kHz. Chaque niveau se rapporte à une bande de fréquence de la FFT et diffère du volume global, de la crête des échantillons ou de la sonie intégrée en LUFS.

Un pic marqué autour de 50 ou 60 Hz peut indiquer un ronflement électrique. Une chute soudaine dans les aigus peut venir d’un filtrage ou d’une compression. Un pic isolé peut être une harmonique. Examinez les pics voisins avant de l’utiliser pour déterminer la hauteur d’une note.

## Quand utiliser une échelle logarithmique ou linéaire ?

L’échelle logarithmique accorde plus de place aux basses et aux médiums et facilite la lecture des octaves. Sur l’échelle linéaire, deux écarts égaux en Hz occupent la même distance, ce qui aide à comparer des harmoniques régulièrement espacées. Ce graphique résume le contenu fréquentiel de l’enregistrement. Un spectrogramme permet de voir à quel moment un son apparaît ou comment sa fréquence évolue dans le temps.
