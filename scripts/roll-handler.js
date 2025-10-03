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
      case 'ability':
      case 'save':
      case 'attack':
      case 'reaction':
      case 'heroichealing':
      case 'rollNPCDamage':
      case 'rollNPCMorale':
      case 'transferCash':
        this.#handleRoll(event, actor, actionTypeId, actionId)
        break
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

        if (!item.system.readied && item.type !== 'trait') {
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
      const effect = actor.effects.filter(el => el.id === actionId)

      if (event.button === 2 && effect.length) {
        await effect[0].sheet.render(true)
      } else {
        await this.token.actor.effects.filter(el => el.id === actionId)[0].update({ disabled: !effect[0].disabled })
      }
      // }
      Hooks.callAll('forceUpdateTokenActionHud')
    }
  }
})
