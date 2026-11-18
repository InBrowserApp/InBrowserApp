type Key = readonly [code: string, label: string, width?: number]

function numberedKeys(prefix: string, numbers: readonly number[]): Key[] {
  return numbers.map((number) => [
    prefix + number,
    prefix === "F" ? "F" + number : String(number),
  ])
}

function letters(row: string): Key[] {
  return Array.from(row, (letter) => ["Key" + letter, letter])
}

const functions: readonly (readonly Key[])[] = [
  [["Escape", "Esc"]],
  numberedKeys("F", [1, 2, 3, 4]),
  numberedKeys("F", [5, 6, 7, 8]),
  numberedKeys("F", [9, 10, 11, 12]),
]

const main: readonly (readonly Key[])[] = [
  [
    ["Backquote", "`"],
    ...numberedKeys("Digit", [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]),
    ["Minus", "-"],
    ["Equal", "="],
    ["Backspace", "Backspace", 2],
  ],
  [
    ["Tab", "Tab", 1.5],
    ...letters("QWERTYUIOP"),
    ["BracketLeft", "["],
    ["BracketRight", "]"],
    ["Backslash", "\\", 1.5],
  ],
  [
    ["CapsLock", "Caps Lock", 1.75],
    ...letters("ASDFGHJKL"),
    ["Semicolon", ";"],
    ["Quote", "'"],
    ["Enter", "Enter", 2.25],
  ],
  [
    ["ShiftLeft", "Shift", 2.25],
    ...letters("ZXCVBNM"),
    ["Comma", ","],
    ["Period", "."],
    ["Slash", "/"],
    ["ShiftRight", "Shift", 2.75],
  ],
  [
    ["ControlLeft", "Ctrl", 1.25],
    ["MetaLeft", "Meta", 1.25],
    ["AltLeft", "Alt", 1.25],
    ["Space", "Space", 6.25],
    ["AltRight", "Alt", 1.25],
    ["MetaRight", "Meta", 1.25],
    ["ContextMenu", "Menu", 1.25],
    ["ControlRight", "Ctrl", 1.25],
  ],
]

const navigation: readonly (readonly Key[])[] = [
  [
    ["PrintScreen", "PrtSc"],
    ["ScrollLock", "ScrLk"],
    ["Pause", "Pause"],
  ],
  [
    ["Insert", "Ins"],
    ["Home", "Home"],
    ["PageUp", "PgUp"],
  ],
  [
    ["Delete", "Del"],
    ["End", "End"],
    ["PageDown", "PgDn"],
  ],
  [],
  [["ArrowUp", "↑"]],
  [
    ["ArrowLeft", "←"],
    ["ArrowDown", "↓"],
    ["ArrowRight", "→"],
  ],
]

const numberPad: readonly Key[] = [
  ["NumLock", "Num"],
  ["NumpadDivide", "/"],
  ["NumpadMultiply", "*"],
  ["NumpadSubtract", "-"],
  ...numberedKeys("Numpad", [7, 8, 9]),
  ["NumpadAdd", "+"],
  ...numberedKeys("Numpad", [4, 5, 6, 1, 2, 3]),
  ["NumpadEnter", "Enter"],
  ["Numpad0", "0", 2],
  ["NumpadDecimal", "."],
]

const keyLabels = new Map(
  [...functions.flat(), ...main.flat(), ...navigation.flat(), ...numberPad].map(
    ([code, label]) => [code, label]
  )
)

type KeyboardProps = {
  held: ReadonlyMap<string, string>
  tested: ReadonlySet<string>
}

function Keyboard({ held, tested }: KeyboardProps) {
  function renderKey([code, label, width = 1]: Key, tall = false) {
    const isHeld = held.has(code)
    const wasTested = tested.has(code)

    return (
      <kbd
        key={code}
        title={code}
        data-code={code}
        data-state={isHeld ? "held" : wasTested ? "tested" : "untested"}
        style={{
          flexGrow: width,
          gridColumn: width === 2 ? "span 2" : undefined,
          gridRow: tall ? "span 2" : undefined,
        }}
        className="relative flex min-w-0 basis-0 items-center justify-center rounded-md border border-border bg-background font-mono text-[11px] font-medium select-none data-[state=held]:translate-y-px data-[state=held]:border-primary data-[state=held]:bg-primary data-[state=held]:text-primary-foreground data-[state=tested]:border-primary/40 data-[state=tested]:bg-primary/10"
      >
        {label}
        {wasTested && !isHeld ? (
          <span className="absolute end-1 top-1 size-1 rounded-full bg-primary" />
        ) : null}
      </kbd>
    )
  }

  return (
    <div
      aria-hidden="true"
      className="grid min-w-[860px] grid-cols-[15fr_3fr_4fr] gap-2.5"
    >
      <div className="grid auto-rows-10 gap-1">
        <div className="flex gap-3">
          {functions.map((group) => (
            <div
              key={group[0][0]}
              className="flex basis-0 gap-1"
              style={{ flexGrow: group.length }}
            >
              {group.map((key) => renderKey(key))}
            </div>
          ))}
        </div>
        {main.map((row) => (
          <div key={row[0][0]} className="flex gap-1">
            {row.map((key) => renderKey(key))}
          </div>
        ))}
      </div>

      <div className="grid auto-rows-10 gap-1">
        {navigation.map((row, index) => (
          <div key={index} className="grid grid-cols-3 gap-1">
            {row.length === 1 ? <span /> : null}
            {row.map((key) => renderKey(key))}
          </div>
        ))}
      </div>

      <div className="mt-11 grid auto-rows-10 grid-cols-4 gap-1">
        {numberPad.map((key) =>
          renderKey(key, key[0] === "NumpadAdd" || key[0] === "NumpadEnter")
        )}
      </div>
    </div>
  )
}

export { Keyboard, keyLabels }
