## Drag and Drop Calculator

1. Nodes can be added by either drag and drop or by clicking respective buttons.
2. Multiple results supported.
3. Clicking on any node/connector will select the same, you may delete it clicking 'delete' or 'backspace' on your keyboard.
4. Connections can be made by dragging the purple parts on notes to other operators or nodes.
5. Upto 5 canvas can be saved locally and can be loaded back as well.
6. If user tries to save more than 5, the oldest saved canvas would be removed.
7. Duplicate names are not allowed while saving a canvas.
8. Reset button to clear canvas without needing to refresh.


## Technical Overview 

1. Made in React 18 using Vite + SWC (Webpack alternative - Transpiler)
2. Types and Enums for type safety and robustness.
3. Made using ReactFlow a canvas library used in production by the likes of Stripe, Intuit, Retool and more.
4. Custom components which are extensible and reusable.
5. Made responsive using pure CSS.

## Edge Cases Covered
1. No two input nodes should be able to connect without an operator.
2. Result should support maximum one connection.
3. All the nodes should have a 1:1 relation each with a parent and child.
4. Divide by zero in any step should not cause any issues and same should be conveyed to the user.
5. Due to limitations of localStorage, an uppercap should be kept on saving canvas.
6. Touch interactions and click interactions should be supported.
7. Number inputs can be changed via scroll by default in HTML, this behaviour should be disabled when dealing with drag interactions.
   


DEV -
   npm ci
   npm run dev
