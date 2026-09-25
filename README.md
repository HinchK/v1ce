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

### Phone on the same Wi‑Fi (LAN)

Start Metro from a **Windows PowerShell or Command Prompt in the project folder** (not only inside WSL/Docker unless you have WSL networking set up for LAN):

```sh
npm run dev:device
```

Expo should show a LAN URL like `http://10.0.0.xxx:8081` and a dev-client link (`exp+v1ce-native://...`). Do not use `--localhost`: that advertises `127.0.0.1`, which the phone cannot reach.

**If the phone says it could not reach `10.0.0.xxx`:**

1. On the phone’s browser, open `http://<that-same-ip>:8081`. If it does not load, the problem is network/firewall—not the app code.
2. PC and phone on the **same Wi‑Fi** (not guest Wi‑Fi). Turn off VPN on both.
3. In Windows, set the Wi‑Fi network to **Private**, then allow Metro (PowerShell **as Administrator**):

```powershell
New-NetFirewallRule -DisplayName "Expo Metro 8081" -Direction Inbound -Protocol TCP -LocalPort 8081 -Action Allow -Profile Private
New-NetFirewallRule -DisplayName "Node.js Expo" -Direction Inbound -Program "$env:ProgramFiles\nodejs\node.exe" -Action Allow
```

4. Confirm the IP with `ipconfig` (Wi‑Fi adapter IPv4). If Expo shows the wrong address, stop Metro and run (replace with your IPv4):

```powershell
$env:REACT_NATIVE_PACKAGER_HOSTNAME="10.0.0.168"
npm run dev:device
```

### When LAN still fails (recommended on many PCs)

Use the tunnel so the phone does not need to reach your LAN IP:

```sh
npm run dev:tunnel
```

Scan the **new** QR code or open the `exp+v1ce-native://...` link that mentions `*.exp.direct`. `@expo/ngrok` is included in this repo so the tunnel does not require a global install.

---

Made with love,
**Dez**

