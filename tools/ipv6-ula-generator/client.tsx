import { startTransition, useEffect, useState } from "react"

import { DetailsCard } from "./components/details-card"
import { PrefixCard } from "./components/prefix-card"
import { SubnetPlannerCard } from "./components/subnet-planner-card"
import {
  ULA_SUBNET_COUNT,
  deriveIpv6UlaSubnet,
  generateIpv6UlaPrefix,
  normalizeSubnetId,
} from "./core/ipv6-ula"

import type { Ipv6UlaPrefix } from "./core/ipv6-ula"
import type { Ipv6UlaMessages } from "./types"

type GenerationState = Readonly<{
  prefix: Ipv6UlaPrefix | null
  hasError: boolean
}>

type Ipv6UlaGeneratorClientProps = Readonly<{
  messages: Ipv6UlaMessages
  language: string
}>

const INITIAL_GENERATION_STATE: GenerationState = {
  prefix: null,
  hasError: false,
}

function createGenerationState(): GenerationState {
  try {
    return {
      prefix: generateIpv6UlaPrefix(),
      hasError: false,
    }
  } catch {
    return {
      prefix: null,
      hasError: true,
    }
  }
}

function Ipv6UlaGeneratorClient({
  messages,
  language,
}: Ipv6UlaGeneratorClientProps) {
  const [generation, setGeneration] = useState(INITIAL_GENERATION_STATE)
  const [subnetIdInput, setSubnetIdInput] = useState("0000")

  useEffect(() => {
    setGeneration(createGenerationState())
  }, [])

  const prefix = generation.prefix
  const subnet = prefix ? deriveIpv6UlaSubnet(prefix, subnetIdInput) : null
  const subnetIdIsValid = normalizeSubnetId(subnetIdInput) !== null
  const formattedSubnetCount = new Intl.NumberFormat(language).format(
    ULA_SUBNET_COUNT
  )

  const regenerate = () => {
    startTransition(() => {
      setGeneration(createGenerationState())
    })
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <PrefixCard
          messages={messages}
          prefix={prefix}
          isLoading={!prefix && !generation.hasError}
          hasError={generation.hasError}
          onRegenerate={regenerate}
        />
        <DetailsCard
          messages={messages}
          prefix={prefix}
          formattedSubnetCount={formattedSubnetCount}
        />
      </div>

      <SubnetPlannerCard
        messages={messages}
        prefix={prefix}
        subnet={subnet}
        subnetIdIsValid={subnetIdIsValid}
        subnetIdInput={subnetIdInput}
        onSubnetIdChange={setSubnetIdInput}
      />
    </div>
  )
}

export default Ipv6UlaGeneratorClient
