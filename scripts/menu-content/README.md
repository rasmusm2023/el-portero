# Menu content (mass import)

Fill in `dinner.csv` and `drinks.csv`. Each file becomes one Firestore document at
`editableMenus/{kind}`. After the script runs, sign in at `/admin/menus`, review each
tab, and click **Publish** to make it live.

## CSV columns

Header row (required, exact spelling, lowercase):

```
section,name,description,price,dietary_tags,allergens
```

| Column | Required | Notes |
|---|---|---|
| `section` | yes | Section title (e.g. `To begin`). Rows sharing a section stay grouped — keep them contiguous. Section order follows first appearance in the file. |
| `name` | yes | Dish/drink name. |
| `description` | no | Short tasting note. Multi-line allowed inside double-quotes (RFC 4180). Leave blank for none. |
| `price` | no | Numeric only — `24` or `24.50`. **Do not include `€`** — every menu page already shows "All prices in euros (€). VAT included." Leave blank for "market price" dishes. **Drinks** can also use size variants — see below. |
| `dietary_tags` | no | Semicolon-separated ids. Allowed: `alcoholFree`, `vegan`, `vegetarian`, `glutenFree`, `lactoseFree`. (`alcoholFree` is for drinks only.) |
| `allergens` | no | Semicolon-separated **numbers 1–14** (EU Annex II). Used on the dinner menu only — values in `drinks.csv` are ignored. |

### Size variants (drinks only)

When a drink is sold in more than one size (Small / Large, 33cl / 50cl, Glass /
Bottle, etc.), put a pipe-separated list of `Label=Price` pairs in the `price`
column. Each pair shows up on its own line on the public menu, label muted, price
in the regular price treatment.

```
section,name,description,price,dietary_tags,allergens
Beer,Estrella Galicia,House draught.,Small=4|Large=6,glutenFree,
Wines by the glass,Albariño Rías Baixas 2023,"Saline, citrus.",Glass=7|Bottle=32,vegan;glutenFree,
Soft drinks,Coca-Cola,,Small=3|Large=4,,
```

- The labels are free text — pick whatever reads naturally ("Small", "Large",
  "33cl", "50cl", "Glass", "Bottle", "Half", "Full", etc.).
- Prices follow the same numeric rules as the single-price form (`4` or `4.50`,
  no `€`).
- You can list more than two sizes if needed — just keep adding `|Label=Price`.
- Mixing a single price and size variants on the same row is not supported; if
  any `=` or `|` appears in the column, the whole value is parsed as size
  variants.
- Size variants are rejected on the dinner menu (and the import errors out so
  you catch typos in the dry run).

### Optional page title

The first line may be a comment that sets the page heading:

```
# title: Spring dinner 2026
section,name,description,price,dietary_tags,allergens
...
```

Without this line, the page falls back to the default localized title ("Dinner" / "Drinks").

## Allergen number reference (EU Annex II)

| # | Allergen | Examples |
|---|---|---|
| 1 | Gluten | Wheat, rye, barley, oats, spelt |
| 2 | Crustaceans | Prawns, crab, lobster |
| 3 | Eggs | Mayonnaise, fresh pasta, glazes |
| 4 | Fish | Anchovy, fish stock, Worcestershire |
| 5 | Peanuts | Peanuts and peanut oils |
| 6 | Soy | Soy sauce, tofu, edamame, lecithin |
| 7 | Milk | Dairy, butter, cream, cheese, lactose |
| 8 | Tree nuts | Almonds, hazelnuts, walnuts, cashews, pistachios |
| 9 | Celery | Celery, celeriac, stocks, broths |
| 10 | Mustard | Mustard, dressings, marinades |
| 11 | Sesame | Sesame seeds, tahini, sesame oil |
| 12 | Sulphites | Wine, dried fruits (>10 mg/kg or 10 mg/L) |
| 13 | Lupin | Lupin flour, lupin seeds |
| 14 | Molluscs | Mussels, clams, octopus, squid, oysters |

## Running the import

```bash
# Validate without writing (always run this first):
node scripts/import-editable-menus.mjs --dry-run

# Import both menus (kept unpublished — review in admin UI):
node scripts/import-editable-menus.mjs

# Import only one menu:
node scripts/import-editable-menus.mjs dinner

# Import AND publish immediately (skips the review step):
node scripts/import-editable-menus.mjs --publish
```

Requires `FIREBASE_SERVICE_ACCOUNT_JSON` in `.env.local` — the same secret the rest of
the app uses for server-side Firestore. The script writes directly via the Firestore REST
API; no extra dependencies needed.

## Common mistakes

- **Price contains `€`** — fail. Use bare numbers.
- **Allergen `15`** — fail. Numbers must be 1–14.
- **Section spelled differently across rows** — those rows split into separate sections.
  Keep section names byte-identical (or copy-paste).
- **Multi-line descriptions without quotes** — the row will be split. Wrap descriptions
  that contain commas or newlines in `"double quotes"`. To include a literal `"` inside
  a quoted field, double it: `""`.
