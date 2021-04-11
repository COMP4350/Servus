# Coding Standards

The Servus codebase uses [prettier](https://prettier.io/) to automatically format our code files. Our continuous integration test for formatting will fail if it detects that committed files do not follow the standards set in our prettier config `(Servus/.prettierrc.json)` file:

```
{
    "trailingComma": "es5",
    "tabWidth": 4,
    "semi": true,
    "singleQuote": true,
    "jsxBracketSameLine": true,
    "arrowParens": "avoid",
    "endOfLine": "lf"
}
```

## Conventions

### JavaScript

-   `camelCase` is used for variable and function naming.
-   `let` is preferred over `var` for declaring variables.
-   single quotes (`'text'`) are used for strings, except when using template literals, where we use ` instead.

### Google Maps API

-   The Google Maps API has some variables that are in snake_case, which must occasionally be used in the code base as such.

### Database

-   Database entities are named in `snake_case`. Thus, the corresponding backend variables that refer to database elements are in snake_case.
    -   We thought this could be a good way to distinguish between local variables and accesses to variables that must match the name of the database schema.

---
