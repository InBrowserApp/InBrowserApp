import type { ClaimCheck } from "../core/jwt-claims"
import type { JwtDecodeErrorCode, JwtVerifyErrorCode } from "../core/jwt-types"

type JwtDecoderVerifierMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  token: {
    title: string
    description: string
    label: string
    placeholder: string
    useSample: string
    clear: string
  }
  decoded: {
    title: string
    description: string
    headerTitle: string
    payloadTitle: string
    copyJson: string
    copied: string
    emptyTitle: string
    emptyDescription: string
  }
  verification: {
    title: string
    description: string
    algorithmLabel: string
    algorithmDescription: string
    autoAlgorithm: string
    keyLabel: string
    keyDescription: string
    keyPlaceholder: string
    waitingTitle: string
    waitingDescription: string
    pendingTitle: string
    verifiedTitle: string
    verifiedDescription: string
    failedTitle: string
    failedDescription: string
  }
  claims: {
    title: string
    description: string
    emptyTitle: string
    emptyDescription: string
    severities: Record<ClaimCheck["severity"], string>
    messages: Record<ClaimCheck["code"], string>
  }
  decodeErrors: Record<JwtDecodeErrorCode, string>
  verifyErrors: Record<JwtVerifyErrorCode, string>
}>

export type { JwtDecoderVerifierMessages }
