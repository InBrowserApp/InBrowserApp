declare module "webrtc-ips" {
  type Candidate = Readonly<{
    address: string
    v6?: boolean
  }>

  export function getIPs(): Promise<readonly Candidate[]>
}
