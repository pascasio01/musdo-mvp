/**
 * MUSDO Audio Service — platform-agnostic playback contract.
 *
 * Today the canonical audio engine lives inside <PlayerProvider> (an HTML
 * <audio> element + React state). This file defines the *interface* every
 * platform must satisfy. The Web adapter is a thin bridge over PlayerProvider
 * that lets non-React surfaces (and future native code) talk to the engine
 * without coupling to React internals.
 *
 * On React Native we add `AudioService.native.ts` backed by
 * `expo-av` / `react-native-track-player` exposing the exact same shape.
 *
 * NOTE: React components SHOULD continue to use `usePlayer()` directly.
 * `AudioService` is for non-React core modules (analytics, integrations,
 * background sync, future SDK consumers) and as the stable contract for
 * the eventual native port.
 */

import type { Song } from '../music'

export type PlayerEvent =
  | { type: 'play';        song: Song; positionSec: number }
  | { type: 'pause';       positionSec: number }
  | { type: 'ended';       song: Song }
  | { type: 'seek';        positionSec: number }
  | { type: 'volume';      value: number }
  | { type: 'songChange'; song: Song | null }
  | { type: 'error';       error: Error }

export interface AudioServiceState {
  song: Song | null
  isPlaying: boolean
  positionSec: number
  durationSec: number
  volume: number
  isMuted: boolean
}

export interface AudioService {
  play(song?: Song): Promise<void> | void
  pause(): void
  togglePlay(): void
  seek(positionSec: number): void
  setVolume(value: number): void
  mute(): void
  /** Replace the queue (skipForward/skipBack on web today) */
  skip(direction: 'forward' | 'back'): void
  getState(): AudioServiceState
  subscribe(cb: (e: PlayerEvent) => void): () => void
}

/**
 * Bridge handle published by the React provider.  PlayerProvider can call
 * `setAudioBridge({...})` once on mount to expose its imperative API to
 * non-React modules. Until that hook is wired the service throws instead
 * of silently failing — surfacing missed wiring early.
 */
type Bridge = AudioService | null
let bridge: Bridge = null
const subs = new Set<(e: PlayerEvent) => void>()

export function setAudioBridge(impl: Bridge): void {
  bridge = impl
}

export function emitPlayerEvent(e: PlayerEvent): void {
  for (const cb of subs) {
    try { cb(e) } catch (err) { console.warn('[MUSDO/Audio] subscriber threw:', err) }
  }
}

function requireBridge(): AudioService {
  if (!bridge) {
    throw new Error('[MUSDO/Audio] AudioService not initialised — PlayerProvider must call setAudioBridge() on mount.')
  }
  return bridge
}

/** Singleton facade used by non-React code paths. */
export const Audio: AudioService = {
  play(song)            { return requireBridge().play(song) },
  pause()               { requireBridge().pause() },
  togglePlay()          { requireBridge().togglePlay() },
  seek(s)               { requireBridge().seek(s) },
  setVolume(v)          { requireBridge().setVolume(v) },
  mute()                { requireBridge().mute() },
  skip(d)               { requireBridge().skip(d) },
  getState()            { return requireBridge().getState() },
  subscribe(cb) {
    subs.add(cb)
    return () => subs.delete(cb) as unknown as void
  },
}
