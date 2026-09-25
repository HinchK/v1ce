# V1CE

V1CE is a personal day-counting and milestone app built for iOS and Android.

## Designed to Feel Like Yours

V1CE puts **customization, connection, and celebration** at the center of the experience. Personalize the way you track your days and milestones with a visual experience that feels like your own.

## V1CE

* Personal day and milestone tracking
* Customizable visual experience
* Personalized widgets
* Personal connections
* Built for everyday use

More to come.

## Built For iOS & Android

V1CE is built with:

* React Native
* Expo
* TypeScript
* Supabase
* Swift / WidgetKit
* Kotlin / Android Glance

## Status

V1CE is currently in active development.

## Physical-device development runtime

The installed app must be a development build created from the current Expo SDK 54 native configuration. An older SDK 57 development client cannot run the current SDK 54 JavaScript bundle.

Start Metro for a phone on the same network with:

```sh
npm run dev:device
```

This deliberately uses the development client and a LAN address. Do not use `--localhost`: that advertises `127.0.0.1`, which points back to the phone itself. If LAN discovery is unavailable, use:

```sh
npm run dev:tunnel
```

---

Made with love,
**Dez**

