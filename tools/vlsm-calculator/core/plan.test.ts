import { describe, expect, test } from "vitest"
import { planSubnets, type Requirement } from "./plan"

function standard(hosts: string, name = ""): Requirement {
  return { hosts, name, type: "standard" }
}

describe("planSubnets", () => {
  test("normalizes the parent and places larger blocks first with a minimal free CIDR cover", () => {
    expect(
      planSubnets(" 192.168.10.29/24 ", [
        standard("20", "Lab"),
        standard("100", " Office "),
        standard("50", "Guest Wi-Fi"),
      ])
    ).toEqual({
      status: "success",
      plan: {
        parent: "192.168.10.0/24",
        allocated: 224,
        unallocated: 32,
        allocations: [
          {
            name: "Office",
            cidr: "192.168.10.0/25",
            mask: "255.255.255.128",
            first: "192.168.10.1",
            last: "192.168.10.126",
            broadcast: "192.168.10.127",
            usable: 126,
          },
          {
            name: "Guest Wi-Fi",
            cidr: "192.168.10.128/26",
            mask: "255.255.255.192",
            first: "192.168.10.129",
            last: "192.168.10.190",
            broadcast: "192.168.10.191",
            usable: 62,
          },
          {
            name: "Lab",
            cidr: "192.168.10.192/27",
            mask: "255.255.255.224",
            first: "192.168.10.193",
            last: "192.168.10.222",
            broadcast: "192.168.10.223",
            usable: 30,
          },
        ],
        freeBlocks: ["192.168.10.224/27"],
      },
    })
  })

  test("keeps standard LAN reservations and supports explicit point-to-point and host blocks", () => {
    const result = planSubnets("255.255.255.248/29", [
      standard("1", "LAN"),
      { name: "Link", hosts: "", type: "pointToPoint" },
      { name: "Loopback", hosts: "", type: "singleHost" },
    ])
    expect(result).toMatchObject({
      status: "success",
      plan: {
        freeBlocks: ["255.255.255.255/32"],
        allocations: [
          {
            cidr: "255.255.255.248/30",
            first: "255.255.255.249",
            last: "255.255.255.250",
            broadcast: "255.255.255.251",
            usable: 2,
          },
          {
            cidr: "255.255.255.252/31",
            first: "255.255.255.252",
            last: "255.255.255.253",
            broadcast: null,
            usable: 2,
          },
          {
            cidr: "255.255.255.254/32",
            first: "255.255.255.254",
            last: "255.255.255.254",
            broadcast: null,
            usable: 1,
          },
        ],
      },
    })
  })

  test("handles the full IPv4 address space and the highest /32", () => {
    expect(
      planSubnets("255.255.255.255/0", [standard("4294967294")])
    ).toMatchObject({
      status: "success",
      plan: {
        parent: "0.0.0.0/0",
        unallocated: 0,
        freeBlocks: [],
        allocations: [{ mask: "0.0.0.0", last: "255.255.255.254" }],
      },
    })
    expect(
      planSubnets("255.255.255.255/32", [
        { name: "", hosts: "", type: "singleHost" },
      ])
    ).toMatchObject({
      status: "success",
      plan: { allocations: [{ cidr: "255.255.255.255/32" }] },
    })
  })

  test("decomposes free space in allocation order", () => {
    expect(
      planSubnets("198.51.100.0/24", [standard("50"), standard("20")])
    ).toMatchObject({
      plan: { freeBlocks: ["198.51.100.96/27", "198.51.100.128/25"] },
    })
  })

  test.each([
    ["ar", "٥٠"],
    ["ja", "５０"],
    ["de", "1.000"],
  ])("accepts localized whole numbers for %s", (language, hosts) => {
    expect(
      planSubnets("192.168.0.0/16", [standard(hosts)], language).status
    ).toBe("success")
  })

  test.each([
    "",
    "::1/128",
    "192.168.0.1",
    "192.168.0.1/33",
    "192.168.256.1/24",
  ])("rejects invalid parent %s", (input) => {
    expect(planSubnets(input, [standard("10")])).toEqual({
      status: "invalidParent",
    })
  })

  test.each(["", "1a", "1.5", "0", "4294967295"])(
    "reports the row with invalid host count %s",
    (hosts) => {
      expect(
        planSubnets("192.168.0.0/24", [standard("10"), standard(hosts)])
      ).toEqual({ status: "invalidHosts", index: 1 })
    }
  )

  test("reports when the rounded allocations do not fit", () => {
    expect(
      planSubnets("192.168.0.0/24", [standard("127"), standard("1")])
    ).toEqual({ status: "doesNotFit" })
  })
})
