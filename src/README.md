# Rules

1. All code that has the import call `import { app } from '@firebase/server'` MUST be an API route
2. Blocks that requires any JS/TS that would otherwise be in a `<script></script>` tag needs to be in a vue component
3. Custom types will all be written in CamelCase: `interface ExampleType {}`
4. Firestore document types will be denoted as the collection they are in followed by 'Doc': `interface UserDoc {}`
5. **KEEP. IT. SIMPLE. STUPID.**
