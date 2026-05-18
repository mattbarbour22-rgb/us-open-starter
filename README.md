# U.S. Open Pick 3 Live

Reusable live golf pick-em site based on the working PGA Championship version.

## Main files

- `app/page.js` — pool entries, tournament settings, rankings, elimination logic, page UI
- `app/api/leaderboard/route.js` — RapidAPI leaderboard fetch and manual cache timing
- `app/globals.css` — U.S. Open/Shinnecock styling

## API refresh timing

In `app/api/leaderboard/route.js`, change this line:

```js
export const revalidate = 300;
```

Next.js uses seconds:

- `300` = 5 minutes
- `900` = 15 minutes
- `1800` = 30 minutes
- `3600` = 1 hour

## Vercel environment variables

Add these in Vercel Project Settings → Environment Variables:

```text
SLASH_GOLF_API_KEY=<your RapidAPI key>
SLASH_GOLF_API_HOST=live-golf-data.p.rapidapi.com
SLASH_GOLF_ORG_ID=1
SLASH_GOLF_TOURN_ID=<tournament id>
SLASH_GOLF_YEAR=2026
```

## Replacing picks

In `app/page.js`, replace only the `poolEntries` block.
Keep the same shape:

```js
{
  "player": "Player Name",
  "picks": ["Pick 1", "Pick 2", "Pick 3"]
}
```

## Notes

- Prize pool is set to `$3,500`.
- Branding is set for the 126th U.S. Open at Shinnecock Hills.
- Movement baseline is intentionally empty before a tournament.
- Current post-cut elimination logic is included, with eliminated entries moved below alive entries.
