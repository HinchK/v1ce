# V1CE Source → Native Port Manifest

This is the authoritative map of the V1CE source supplied for the port.

## Supplied source artifacts

| Source | Contents | Native treatment |
|---|---|---|
| `V1CE_Code.txt` | Native Expo/React Native project source and configuration | Ported into `app/`, `components/`, `context/`, `constants/`, `hooks/`, `lib/` |
| `Pasted code.js` | Coin colors, 12 number styles, 9 shapes, bounds, borders, CoinFront | Ported into `constants/coin.ts` + `components/CoinFront.tsx` |
| `Pasted code(1).js` | Radix/Base44 web sidebar | Archived; web-only infrastructure |
| `Pasted code(2).js` | i18next web localization infrastructure | Archived; native UI does not require the web i18next runtime |
| `Pasted code(3).js` | Base44 Customize screen and coin customization controls | Ported into native Customize screen |
| `Pasted code(4).js` | Base44 MCP OAuth consent UI | Archived; not part of native V1CE app UX |
| `Pasted code(5).js` | Lounge/grid game | Ported to native game UI |
| `Pasted code(6).js` | Sobriety Run canvas game | Ported to native game UI |

## Coin source of truth

`constants/coin.ts` contains the canonical definitions from `Pasted code.js`:

- 6 named coin colors
- custom hex color resolution
- 12 number/type styles
- 9 coin shapes
- exact polygon geometry
- color contrast resolution

`components/CoinFront.tsx` consumes those definitions and renders the native iOS/Android coin with `react-native-svg`.

## Native feature map

- Onboarding → `app/onboarding.tsx`
- Home/journey → `app/(tabs)/index.tsx`
- Coin customization → `app/(tabs)/customize.tsx`
- Stats → `app/(tabs)/analytics.tsx`
- Lounge/social → `app/(tabs)/lounge.tsx`
- Friends → `app/(tabs)/friends.tsx`
- Profile → `app/(tabs)/profile.tsx`
- Premium → `app/(tabs)/premium.tsx`
- Skull Snake → `components/games/SnakeGame.tsx`
- Sobriety Run → `components/games/SobrietyRunGame.tsx`
- Supabase → `lib/supabase.ts`
- Auth → `context/AuthContext.tsx`

## Explicitly not ported

Web-only infrastructure is retained verbatim in this archive rather than forced into the native app:

- Radix web sidebar
- Base44 MCP OAuth consent page
- browser-only CSS/clip-path implementation
- browser-only i18next runtime

Their source remains available under `base44-source/`.
