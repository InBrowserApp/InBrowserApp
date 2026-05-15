import { describe, expect, it } from "vitest"

import { DEFAULT_QR_CONTENT_STATE } from "./content"
import { buildQrPayload } from "./payload"

describe("buildQrPayload", () => {
  it("returns text payloads as entered", () => {
    expect(
      buildQrPayload("text", {
        ...DEFAULT_QR_CONTENT_STATE,
        text: "https://example.com/a?x=1",
      })
    ).toEqual({
      missing: null,
      payload: "https://example.com/a?x=1",
    })
  })

  it("requires text content", () => {
    expect(
      buildQrPayload("text", {
        ...DEFAULT_QR_CONTENT_STATE,
        text: "   ",
      })
    ).toEqual({ missing: "text", payload: "" })
  })

  it("builds escaped Wi-Fi payloads", () => {
    expect(
      buildQrPayload("wifi", {
        ...DEFAULT_QR_CONTENT_STATE,
        wifi: {
          hidden: true,
          password: "p;w\\d",
          security: "WPA",
          ssid: "Office:Guest",
        },
      }).payload
    ).toBe("WIFI:T:WPA;S:Office\\:Guest;P:p\\;w\\\\d;H:true;;")
  })

  it("handles Wi-Fi payloads without a password", () => {
    expect(
      buildQrPayload("wifi", {
        ...DEFAULT_QR_CONTENT_STATE,
        wifi: {
          hidden: false,
          password: "",
          security: "nopass",
          ssid: "Lobby",
        },
      })
    ).toEqual({
      missing: null,
      payload: "WIFI:T:nopass;S:Lobby;;",
    })

    expect(buildQrPayload("wifi", DEFAULT_QR_CONTENT_STATE).missing).toBe(
      "wifiSsid"
    )
  })

  it("builds vCard contact payloads", () => {
    expect(
      buildQrPayload("contact", {
        ...DEFAULT_QR_CONTENT_STATE,
        contact: {
          ...DEFAULT_QR_CONTENT_STATE.contact,
          email: "ada@example.com",
          firstName: "Ada",
          lastName: "Lovelace",
          phone: "+44 20",
        },
      }).payload
    ).toContain("FN:Ada Lovelace")
  })

  it("handles sparse and organization-first contact payloads", () => {
    const organizationResult = buildQrPayload("contact", {
      ...DEFAULT_QR_CONTENT_STATE,
      contact: {
        ...DEFAULT_QR_CONTENT_STATE.contact,
        organization: "Example Co",
        title: "Ops",
        website: "https://example.com",
      },
    })

    expect(organizationResult.payload).toContain("FN:Example Co")
    expect(organizationResult.payload).toContain("ORG:Example Co")
    expect(organizationResult.payload).toContain("TITLE:Ops")
    expect(organizationResult.payload).toContain("URL:https\\://example.com")

    const addressOnlyResult = buildQrPayload("contact", {
      ...DEFAULT_QR_CONTENT_STATE,
      contact: {
        ...DEFAULT_QR_CONTENT_STATE.contact,
        address: "1 Main St",
      },
    })

    expect(addressOnlyResult.payload).not.toContain("FN:")
    expect(addressOnlyResult.payload).toContain("ADR:;;1 Main St;;;;")
    expect(buildQrPayload("contact", DEFAULT_QR_CONTENT_STATE).missing).toBe(
      "contact"
    )
  })

  it("builds SMS, phone, and email payloads", () => {
    expect(
      buildQrPayload("sms", {
        ...DEFAULT_QR_CONTENT_STATE,
        sms: { message: "Hello there", phone: "+15551234567" },
      }).payload
    ).toBe("sms:+15551234567?body=Hello%20there")

    expect(
      buildQrPayload("phone", {
        ...DEFAULT_QR_CONTENT_STATE,
        phone: "+15551234567",
      }).payload
    ).toBe("tel:+15551234567")

    expect(
      buildQrPayload("email", {
        ...DEFAULT_QR_CONTENT_STATE,
        email: {
          body: "Body text",
          subject: "Subject",
          to: "team@example.com",
        },
      }).payload
    ).toBe("mailto:team@example.com?subject=Subject&body=Body+text")
  })

  it("handles empty SMS, phone, and email details", () => {
    expect(
      buildQrPayload("sms", {
        ...DEFAULT_QR_CONTENT_STATE,
        sms: { message: "", phone: "+15551234567" },
      }).payload
    ).toBe("sms:+15551234567")

    expect(buildQrPayload("sms", DEFAULT_QR_CONTENT_STATE).missing).toBe(
      "smsPhone"
    )
    expect(buildQrPayload("phone", DEFAULT_QR_CONTENT_STATE).missing).toBe(
      "phone"
    )

    expect(
      buildQrPayload("email", {
        ...DEFAULT_QR_CONTENT_STATE,
        email: {
          body: "",
          subject: "",
          to: "team@example.com",
        },
      }).payload
    ).toBe("mailto:team@example.com")
    expect(buildQrPayload("email", DEFAULT_QR_CONTENT_STATE).missing).toBe(
      "emailTo"
    )
  })

  it("validates location coordinates", () => {
    expect(
      buildQrPayload("location", {
        ...DEFAULT_QR_CONTENT_STATE,
        location: {
          altitude: "30",
          latitude: "37.7749",
          longitude: "-122.4194",
        },
      }).payload
    ).toBe("geo:37.7749,-122.4194,30")

    expect(
      buildQrPayload("location", {
        ...DEFAULT_QR_CONTENT_STATE,
        location: { altitude: "", latitude: "120", longitude: "10" },
      }).missing
    ).toBe("locationCoordinates")
  })

  it("omits altitude from location payloads when empty", () => {
    expect(
      buildQrPayload("location", {
        ...DEFAULT_QR_CONTENT_STATE,
        location: {
          altitude: "",
          latitude: "0",
          longitude: "0",
        },
      }).payload
    ).toBe("geo:0,0")
  })

  it("builds calendar payloads with UTC timestamps", () => {
    const result = buildQrPayload("calendar", {
      ...DEFAULT_QR_CONTENT_STATE,
      calendar: {
        description: "Bring badge",
        end: "2026-05-14T11:30",
        location: "Room 4",
        start: "2026-05-14T10:00",
        title: "Planning",
      },
    })

    expect(result.missing).toBeNull()
    expect(result.payload).toContain("SUMMARY:Planning")
    expect(result.payload).toContain("DTSTART:")
    expect(result.payload).toContain("DTEND:")
  })

  it("handles sparse and invalid calendar dates", () => {
    const startOnlyResult = buildQrPayload("calendar", {
      ...DEFAULT_QR_CONTENT_STATE,
      calendar: {
        ...DEFAULT_QR_CONTENT_STATE.calendar,
        start: "2026-05-14T10:00",
      },
    })

    expect(startOnlyResult.payload).not.toContain("SUMMARY:")
    expect(startOnlyResult.payload).toContain("DTSTART:")
    expect(startOnlyResult.payload).not.toContain("DTEND:")

    const invalidDateResult = buildQrPayload("calendar", {
      ...DEFAULT_QR_CONTENT_STATE,
      calendar: {
        ...DEFAULT_QR_CONTENT_STATE.calendar,
        start: "not a date",
        title: "No timestamp",
      },
    })

    expect(invalidDateResult.payload).toContain("SUMMARY:No timestamp")
    expect(invalidDateResult.payload).not.toContain("DTSTART:")
    expect(buildQrPayload("calendar", DEFAULT_QR_CONTENT_STATE).missing).toBe(
      "calendarDetails"
    )
  })
})
