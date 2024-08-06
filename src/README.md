# Rules

1. Anything that requires any of the following must be contained in an API route:
   - `import { MongoClient, ObjectId } from 'mongodb'`
   - `import jwt from 'jsonwebtoken'`
   - `import bcrypt from 'bcrypt'`
2. Until we have a better solution, any route that needs to have middlware run before it will have its pathname added to the switch case contained in the index.ts file inside of the middlware folder
3. Any part of the HTML that would otherwise require a javascript tag to run **MUST** be moved into a Vue component
4. **KEEP. IT. SIMPLE. STUPID.**
