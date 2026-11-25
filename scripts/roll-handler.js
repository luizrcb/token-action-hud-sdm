import { Utils } from './utils.js'
export let RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
  /**
   * Extends Token Action HUD Core's RollHandler class and handles action events triggered when an action is clicked
   */
  RollHandler = class RollHandler extends coreModule.api.RollHandler {
    /**
     * Handle action click
     * Called by Token Action HUD Core when an action is left or right-clicked
     * @override
     * @param {object} event        The event
     * @param {string} encodedValue The encoded value
     */
    async handleActionClick (event, encodedValue) {
      const [actionTypeId, actionId] = encodedValue.split('|')

      // const renderable = ["item"];

      // if (renderable.includes(actionTypeId) && this.isRenderItem()) {
      //   return this.doRenderItem(this.actor, actionId);
      // }

      const knownCharacters = ['character']

      // If single actor is selected
      if (this.actor) {
        await this.#handleAction(
          event,
          this.actor,
          this.token,
          actionTypeId,
          actionId
        )
        return
      }

      const controlledTokens = canvas.tokens.controlled.filter((token) =>
        knownCharacters.includes(token.actor?.type)
      )

      // If multiple actors are selected
      for (const token of controlledTokens) {
        const actor = token.actor
        await this.#handleAction(event, actor, token, actionTypeId, actionId)
      }
    }

    /**
     * Handle action hover
     * Called by Token Action HUD Core when an action is hovered on or off
     * @override
     * @param {object} event        The event
     * @param {string} encodedValue The encoded value
     */
    async handleActionHover (event, encodedValue) {}

    /**
     * Handle group click
     * Called by Token Action HUD Core when a group is right-clicked while the HUD is locked
     * @override
     * @param {object} event The event
     * @param {object} group The group
     */
    async handleGroupClick (event, group) {}

    /**
     * Handle action
     * @private
     * @param {object} event        The event
     * @param {object} actor        The actor
     * @param {object} token        The token
     * @param {string} actionTypeId The action type id
     * @param {string} actionId     The actionId
     */
    async #handleAction (event, actor, token, actionTypeId, actionId) {
      switch (actionTypeId) {
      case 'item':
        this.#handleItemAction(event, actor, actionId)
        break
      // case "utility":
      //   this.#handleUtilityAction(token, actionId);
      //   break;
      case 'consumeSupplies':
        this.#handleConsumeSupplies(event, actor)
        break

      case 'effects':
        await this.#toggleStatus(event, actor, actionId)
        break

      case 'itemRoll':
        await this.#handleFeatureRoll(event, actor, actionId)
        break

      case 'useItem':
        await this.#sdmApi?.items.use(actor.items.get(actionId))
        break

      case 'light':
        await this.#handleLight(actor, actionId)
        break

      case 'form':
        await this.#handleForm(actor, actionId)
        break

      case 'counter':
        await this.#handleCounter(event, actor, actionId)
        break

      case 'rest':
        await (game.system?.api ?? game.sdm?.api)?.rest?.(actor)
        break

      case 'itemAction': {
        const [itemId, id] = actionId.split(':')
        const item = actor.items.get(itemId)
        const action = item ? (game.system?.api ?? game.sdm?.api)?.items?.actions?.(item)?.find((a) => a.id === id) : null
        await action?.run()
        break
      }

      default:
        this.#handleRoll(event, actor, actionTypeId, actionId)
        break
      }
    }

    /**
     * Handle item action
     * @private
     * @param {object} event    The event
     * @param {object} actor    The actor
     * @param {string} actionId The action id
     */
    async #handleItemAction (event, actor, actionId) {
      const isCtrl = !!event.ctrlKey
      const isShift = !!event.shiftKey
      const isAlt = !!event.altKey
      const item = actor.items.get(actionId)

      const brokenItem = item.system.status === 'broken'
      const runOutItem = item.system.resources === 'run_out'

      if (event.button === 2) {
        if (isAlt) {
          return await item.sendToChat({ actor, collapsed: false })
        }
        await item.sheet.render({ force: true })
      } else {
        if (brokenItem || runOutItem) return

        if (isAlt) {
          return await item.toggleReadied()
        }

        if (!item.system.readied && (item.type !== 'trait' && item.type !== 'burden')) {
          return
        }

        const actionType =
          item.system.type === 'weapon' ? 'damage' : item.system.type
        await actor.performHudAction(
          actionType,
          actionId,
          {
            label: item.name,
            tooltip: game.i18n.format('SDM.RollType', {
              type: coreModule.api.Utils.i18n(
                `SDM.${Utils.toPascalCase(actionType)}`
              )
            })
          },
          isShift,
          isCtrl
        )
      }
    }

    // /**
    //  * Handle utility action
    //  * @private
    //  * @param {object} token    The token
    //  * @param {string} actionId The action id
    //  */
    // async #handleUtilityAction(token, actionId) {
    //   switch (actionId) {
    //     case "endTurn":
    //       if (game.combat?.current?.tokenId === token.id) {
    //         await game.combat?.nextTurn();
    //       }
    //       break;
    //   }
    // }

    /** The system's API (WTF 1.11.0+). */
    get #sdmApi () {
      const api = game.system?.api ?? game.sdm?.api
      return api?.items && api?.lights && api?.counters ? api : null
    }

    /** A roll an item feature adds ("damage:<id>" or "power_album:<id>"). */
    async #handleFeatureRoll (event, actor, actionId) {
      const [kind, itemId] = actionId.split(':')
      const item = actor.items.get(itemId)
      if (!item) return
      if (event.button === 2) return item.sheet.render({ force: true })
      if (item.system.status === 'broken' || item.system.resources === 'run_out') return
      if (event.altKey) return item.toggleReadied()
      if (!item.system.readied) return
      const label = coreModule.api.Utils.i18n(kind === 'damage' ? 'SDM.Damage' : 'SDM.PowerAlbum')
      await actor.performHudAction(
        kind,
        itemId,
        { label: item.name, tooltip: game.i18n.format('SDM.RollType', { type: label }) },
        !!event.shiftKey,
        !!event.ctrlKey
      )
    }

    /** Light or put out an item's light; "effect": put out a power's light. */
    async #handleLight (actor, actionId) {
      const api = this.#sdmApi
      if (!api) return
      if (actionId === 'effect') return api.lights.putOut(actor)
      const item = actor.items.get(actionId)
      if (item) await api.lights.toggle(item)
    }

    /** Form: "end" ends the current form, else the uuid of the form effect to take. */
    async #handleForm (actor, actionId) {
      const forms = this.#sdmApi?.forms
      if (!forms) return
      if (actionId === 'end') return forms.end(actor)
      const effect = fromUuidSync(actionId)
      if (effect) await forms.take(effect)
    }

    /** Counter "<actor|itemId>:<key>": click +1, right-click −1. */
    async #handleCounter (event, actor, actionId) {
      const api = this.#sdmApi
      if (!api) return
      const [docKey, key] = actionId.split(':')
      const doc = docKey === 'actor' ? actor : actor.items.get(docKey)
      if (doc) await api.counters.step(doc, key, event.button === 2 ? -1 : 1)
    }

    async #handleRoll (event, actor, actionTypeId, actionId) {
      const isCtrl = !!event.ctrlKey
      const isShift = !!event.shiftKey

      await actor.performHudAction(actionTypeId, actionId, {
        button: event.button
      }, isShift, isCtrl)
    }

    async #handleConsumeSupplies (event, actor) {
      return await actor.consumeSupplies()
    }

    async #toggleStatus (event, actor, actionId) {
      const effect = actor.getAllEffects().find(el => el.id === actionId)

      if (!effect) return

      if (event.button === 2) {
        await effect.sheet.render(true)
      } else {
        await effect.update({ disabled: !effect.disabled })
      }
      // }
      Hooks.callAll('forceUpdateTokenActionHud')
    }
  }
})
