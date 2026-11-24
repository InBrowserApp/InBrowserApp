## How to test your keyboard

Choose **Start test**, then press and release the keys on your physical keyboard one at a time. A key lights up while you hold it and keeps a small dot after you release it. Test both sides of Ctrl, Shift, and Alt, and check the number pad separately if your keyboard has one. Choose **Reset** to clear the marks and run another test.

## Test key combinations, rollover, and ghosting

Try a combination you use in a game or app. For example, hold `W`, `A`, `Shift`, and `Space` together. **Current combination** should show all four keys, and **Peak held** stays at the highest count the browser saw in this session, including modifiers.

Rollover is the ability to register multiple keys at once. If a key works alone but disappears in a specific combination, the keyboard may be blocking that input. If a key appears that you never pressed, that can be ghosting. Try the combination that gives you trouble, since different groups of keys can behave differently. [Microsoft’s keyboard ghosting demo](https://www.microsoft.com/applied-sciences/projects/anti-ghosting-demo)

## Why isn’t a key detected?

Choose **Start test** again if you clicked elsewhere or used Tab or Esc to leave the test area. Some keys, such as Fn and certain media keys, are handled by the keyboard itself or the operating system. The browser may also handle a shortcut before it reaches this page. If an ordinary letter key consistently fails on its own, try it in another app to see whether the problem occurs there too.

## Why does a different key light up?

The diagram uses physical positions from a full-size ANSI keyboard. On a French AZERTY layout, pressing `A` can light up `Q` on the diagram. **Last key** still shows the value your layout produces, `a`, beside the physical code `KeyQ`. On a compact keyboard, focus on the keys your keyboard actually has. [MDN’s guide to physical key codes](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)

[Mouse Tester](../mouse-tester/)
