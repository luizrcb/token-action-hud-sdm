# Token Action HUD SDM

![](https://img.shields.io/badge/Foundry-v13-informational) [![Report Bugs](https://img.shields.io/badge/Report%20Bugs%20on%20GitHub-2dba4e?logo=GitHub&amp;logoColor=white)](https://github.com/luizrcb/token-action-hud-sdm/issues)

Token Action HUD is a repositionable HUD of actions for a selected token.

## Features

- Make rolls directly from the HUD instead of opening your character sheet.
- Use items from the HUD or right-click an item to open its sheet.
- Move the HUD and choose to expand the menus up or down.
- Unlock the HUD to customise layout and groups per user, and actions per actor.
- Add your own macros, journal entries and roll table compendiums.

### Token Action HUD SDM Interactions

- **Left-Click (readied items)** → Item interaction, behaves as in the character sheet, supporting the same optional shortcuts:
  - **+Ctrl** → Toggle blind GM roll
  - **+Shift** → Skip or force custom roll dialog (depending on your system settings for the shift key)
- **Left-Click (active effects)** → Toggle effect between active and inactive states
- **Alt + Left-Click** → Toggle item readied (equipped) status
- **Alt + Right-Click** → Share item to chat
- **Right-Click** → Open item or active effect sheet

## Installation

### Method 1

1. On Foundry VTT's **Configuration and Setup** screen, go to **Add-on Modules**
2. Click **Install Module**
3. Search for **Token Action HUD SDM**
4. Click **Install** next to the module listing

### Method 2

1. On Foundry VTT's **Configuration and Setup** screen, go to **Add-on Modules**
2. Click **Install Module**
3. In the Manifest URL field, paste: `https://github.com/luizrcb/token-action-hud-sdm/releases/latest/download/module.json`
4. Click **Install** next to the pasted Manifest URL

## Required Modules

**IMPORTANT** - Token Action HUD SDM requires the [Token Action HUD Core](https://foundryvtt.com/packages/token-action-hud-core) module to be installed.

### Recommended Modules

Token Action HUD uses the [Color Picker](https://foundryvtt.com/packages/color-picker) library module for its color picker settings.

## Support

For a guide on using Token Action HUD, go to: [How to Use Token Action HUD](https://github.com/Larkinabout/fvtt-token-action-hud-core/wiki/How-to-Use-Token-Action-HUD)

For questions, feature requests or bug reports, please open an issue [here](https://github.com/luizrcb/token-action-hud-sdm/issues).

Pull requests are welcome. Please include a reason for the request or create an issue before starting one.

## Licenses

- **Source Code:** All source code files (javascript, css) are licensed under the [MIT License](https://en.wikipedia.org/wiki/MIT_License).
- **Foundry VTT:** The project is created following the Foundry VTT [Limited License Agreement for module development](https://foundryvtt.com/article/license/).
