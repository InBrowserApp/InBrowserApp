type TextStatisticsLocalizedCatalog = Readonly<{
  inputEyebrow: string
  inputTitle: string
  inputDescription: string
  placeholder: string
  loadSample: string
  clearText: string
  snapshotTitle: string
  snapshotDescription: string
  styleTitle: string
  styleDescription: string
  structureTitle: string
  structureDescription: string
  repeatedTermsTitle: string
  repeatedTermsDescription: string
  repeatedTermsEmpty: string
  characters: string
  charactersNoSpaces: string
  words: string
  uniqueWords: string
  sentences: string
  paragraphs: string
  lines: string
  readingTime: string
  speakingTime: string
  averageWordLength: string
  averageSentenceWords: string
  lexicalDiversity: string
  longestSentenceWords: string
  longestParagraphWords: string
}>

type TextStatisticsMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  TextStatisticsLocalizedCatalog

export type { TextStatisticsLocalizedCatalog, TextStatisticsMessages }
