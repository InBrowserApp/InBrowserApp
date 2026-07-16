import { describe, expect, test } from "vitest"

import enMessages from "./messages/en.json"
import { CATEGORIES, CATEGORY_IDS } from "./core/units"

describe("unit converter messages", () => {
  test("the English catalog names every registered unit exactly once", () => {
    const registeredUnitIds = CATEGORY_IDS.flatMap((categoryId) =>
      CATEGORIES[categoryId].units.map(({ id }) => id)
    )

    expect(Object.keys(enMessages.units)).toEqual(registeredUnitIds)
  })
})
