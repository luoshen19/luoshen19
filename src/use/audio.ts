import { ref, watch, toValue, type Ref } from 'vue'
import { useEventListener, watchIgnorable } from '@vueuse/core'

export function useMediaControls(target: Ref<HTMLAudioElement | undefined>, source: Ref<string>) {
  let first = true

  const playing = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const ended = ref(false)

  /**
   * 相当于初始化
   * 在audio标签渲染后，将source挂到audio上
   * 触发到这个监听器
   */
  watch(target, (target) => {
    const el = toValue(target)
    if (!el) {
      console.log('target is null')
      return
    }
    el.src = toValue(source)
    el.load()
  })

  watch(source, (source) => {
    const el = toValue(target)
    if (!el) {
      console.log('target is null')
      return
    }
    el.src = toValue(source)
    // 切歌的时候让进度条快速回到起点
    currentTime.value = 0
    el.load()
    if (first) {
      first = false
      return
    }
    el.play()
  })

  const { ignoreUpdates: ignorePlayingUpdates } = watchIgnorable(playing, (isPlaying) => {
    const el = toValue(target)
    if (!el) {
      console.log('target is null')
      return
    }
    isPlaying ? el.play() : el.pause()
  })

  const { ignoreUpdates: ignoreCurrentTimeUpdates } = watchIgnorable(currentTime, (newTime) => {
    const el = toValue(target)
    if (!el) {
      console.log('target is null')
      return
    }
    el.currentTime = newTime
  })

  useEventListener(target, 'pause', () => ignorePlayingUpdates(() => (playing.value = false)))
  useEventListener(target, 'play', () => ignorePlayingUpdates(() => (playing.value = true)))
  useEventListener(target, 'loadedmetadata', () => (duration.value = toValue(target)!.duration))
  useEventListener(target, 'timeupdate', () =>
    ignoreCurrentTimeUpdates(() => (currentTime.value = toValue(target)!.currentTime))
  )
  useEventListener(target, 'ended', () => (ended.value = true))
  useEventListener(target, 'playing', () => {
    ended.value = false
    ignorePlayingUpdates(() => (playing.value = true))
  })

  return { playing, currentTime, duration, ended }
}
