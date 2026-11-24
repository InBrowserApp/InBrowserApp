## How to test mouse buttons and double-clicks

Move the pointer into the test area. Press and release the left, right, and middle buttons, then try the Back and Forward side buttons if your mouse has them. Each button lights up while held and records one press when it goes down. Double-click the primary button to check whether the browser recognizes two presses as a double-click.

## How to test the scroll wheel

Scroll up and down in the test area. Use a tilt wheel or a two-finger trackpad gesture to test horizontal scrolling. The latest scroll shows both axes and the unit reported by your browser. It may report pixels, lines, or pages depending on your device and settings.

## How to check dragging and pointer movement

Move in a circle or draw a slow line to inspect the recent pointer trail. Hold a mouse button, move, then release to test a drag. The distance shows how far the pointer moved from the starting point during that drag, in CSS pixels. Use **Reset** to clear the trail and counters for a fresh comparison.

## Why doesn't a button register?

Mouse software, accessibility settings, the operating system, or your browser may remap or reserve some buttons. A double-click depends on your system’s click timing. The test reflects events that reach this page, so also compare results with another mouse or another browser if a control behaves unexpectedly. You can check other inputs with the [Keyboard Tester](../keyboard-tester/) and [Gamepad Tester](../gamepad-tester/).
