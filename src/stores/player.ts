import { ref } from 'vue'
import { defineStore } from 'pinia'

import { keyPlayStrategy } from '@/util/keys'
import { PlayStrategyEnum, getNextPlayStrategyEnum } from '@/enums/playStrategyEnum'

export const usePlayerStore = defineStore('player', () => {
  const albumId = ref('')
  const playStrategy = ref(PlayStrategyEnum.DEFAULT)
  const musicIndex = ref(0)
  const imageIndex = ref(0)

  function updatePlayStrategy() {
    const tmp = getNextPlayStrategyEnum(playStrategy.value)
    playStrategy.value = tmp
    localStorage.setItem(keyPlayStrategy, tmp)
  }

  return {
    albumId,
    playStrategy,
    musicIndex,
    imageIndex,

    updatePlayStrategy
  }
})
