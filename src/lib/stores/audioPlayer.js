import { writable } from 'svelte/store';

/**
 * @typedef {import('$lib/types.js').AudioPlayerState} AudioPlayerState
 * @typedef {import('$lib/types.js').Episode} Episode
 */

/** @type {import('svelte/store').Writable<AudioPlayerState>} */
export const audioPlayerStore = writable({
	mode: 'live',
	isPlaying: false,
	currentEpisode: null,
	currentTime: 0,
	duration: 0
});

/**
 * @param {Episode} episode
 */
export function playEpisode(episode) {
	audioPlayerStore.update(store => ({
		...store,
		mode: 'episode',
		currentEpisode: episode,
		isPlaying: true,
		currentTime: 0,
		duration: 0
	}));
}

export function backToLive() {
	audioPlayerStore.update(store => ({
		...store,
		mode: 'live',
		currentEpisode: null,
		isPlaying: store.mode === 'episode' ? true : store.isPlaying,
		currentTime: 0,
		duration: 0
	}));
}

export function togglePlayPause() {
	audioPlayerStore.update(store => ({
		...store,
		isPlaying: !store.isPlaying
	}));
}

/**
 * @param {number} currentTime
 * @param {number} duration
 */
export function updateTime(currentTime, duration) {
	audioPlayerStore.update(store => ({
		...store,
		currentTime,
		duration
	}));
}

/**
 * @param {number} time
 */
export function seekTo(time) {
	audioPlayerStore.update(store => ({
		...store,
		currentTime: time
	}));
}
