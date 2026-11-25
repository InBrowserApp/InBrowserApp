const sample = `From sam@example.test Wed Jun 17 14:42:00 2026
Date: Wed, 17 Jun 2026 14:42:00 +0000
From: Sam Rivera <sam@example.test>
To: Avery Chen <avery@example.test>
Subject: Field notes from the coast
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="field-notes"

--field-notes
Content-Type: text/html; charset=utf-8

<p>Hi Avery,</p>
<p>We finished the coastal trail survey this morning. The boardwalk is open
again, and the new signs make it much easier to find the tide pools.</p>
<p>I’ve attached the three stops we want to revisit next time. Can you add a
note about access from the north entrance?</p>
<p>Thanks,<br>Sam</p>
--field-notes
Content-Type: text/plain; name="survey-stops.txt"
Content-Disposition: attachment; filename="survey-stops.txt"

1. North entrance
2. Boardwalk overlook
3. Tide pools
--field-notes--

From avery@example.test Tue Jun 16 09:10:00 2026
Date: Tue, 16 Jun 2026 09:10:00 +0000
From: Avery Chen <avery@example.test>
To: Sam Rivera <sam@example.test>
Subject: Tomorrow’s trail survey
Content-Type: text/plain; charset=utf-8

I’ll meet you at the north entrance at 9. I’m bringing the camera and the
printed route map.

From noa@example.test Mon Jun 15 11:25:00 2026
Date: Mon, 15 Jun 2026 11:25:00 +0000
From: Noa Patel <noa@example.test>
To: Avery Chen <avery@example.test>
Subject: Updated route map
Content-Type: text/plain; charset=utf-8

The route map now shows the reopened boardwalk and the two accessible stops.
Please use this week’s version for the survey.

From mia@example.test Fri Jun 12 15:07:00 2026
Date: Fri, 12 Jun 2026 15:07:00 +0000
From: Mia Jones <mia@example.test>
To: Avery Chen <avery@example.test>
Subject: Volunteer schedule
Content-Type: text/plain; charset=utf-8

The weekend schedule is ready. Luis will take the first shift on Saturday.
`

export function sampleMailbox() {
  return new File([sample], "coastal-trail-sample.mbox", {
    type: "application/mbox",
  })
}
