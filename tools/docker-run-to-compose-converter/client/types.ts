export type DockerRunToComposeMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  dockerRunLabel: string
  dockerRunDescription: string
  dockerRunPlaceholder: string
  composeLabel: string
  composeDescription: string
  composeEmptyDescription: string
  invalidDockerRunLabel: string
  warningsTitle: string
  useSampleLabel: string
  clearLabel: string
  importFromFileLabel: string
  copyComposeLabel: string
  copiedLabel: string
  downloadComposeLabel: string
}>
