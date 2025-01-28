<script lang="ts">
import { getFollows } from '@/settingsManager';
import { ref } from 'vue'

export default {
  props: {
    username: {
      type: String,
      default() {
        return ''
      }
    }
  },
  setup() {
    return {
      isFollowing: ref(false)
    }
  },
  methods: {
    toggleFollow() {
      const username = this.$props.username

      if (this.isFollowing) {
        this.unfollowStreamer(username)
        this.isFollowing = false
      } else {
        this.followStreamer(username)
        this.isFollowing = true
      }
    },
    /**
     * Follows a Streamer.
     * @param username 
     * @returns true if streamer was followed, false if streamer was already followed.
     */
    followStreamer(username: string): boolean {
      let follows = getFollows()
      if (follows.includes(username)) return false

      follows.push(username)
      localStorage.setItem('following', JSON.stringify(follows))
      return true
    },

    /**
     * Unfollows a streamer.
     * @param username 
     * @returns true if unfollowed, false if not followed.
     */
    unfollowStreamer(username: string): boolean {
      let follows = getFollows()

      const index = follows.indexOf(username)
      if (index === -1) return false
      follows.splice(index, 1)
      localStorage.setItem('following', JSON.stringify(follows))

      return true
    }
  },
  mounted() {
    let followerData = localStorage.getItem('following')
    if (!followerData) return

    let following: string[] = JSON.parse(followerData)
    const isFollower = following.includes(this.$props.username)

    if (isFollower) {
      this.isFollowing = true
    }
  }
}
</script>

<template>
  <button ref="followButton" @click="toggleFollow"
    class="text-contrast text-sm font-bold p-2 py-1 rounded-md bg-purple">
    <v-icon name="bi-heart-fill" scale="0.85"></v-icon>
    <span v-if="isFollowing"> {{ $t('streamer.unfollow') }} </span>
    <span v-else> {{ $t('streamer.follow') }} </span>
  </button>
</template>
