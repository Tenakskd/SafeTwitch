<script lang="ts">
import { ref, inject } from 'vue'

import BadgeVue from './ChatBadge.vue'
import { getBadges } from '@/assets/badges'
import { parseMessage, parseChatHistory } from '@/assets/messageParser'
import { getEndpoint } from '@/mixins'

import type { Badge, ParsedMessage } from '@/assets/types'
import type { VodComment } from '@/types'

export default {
  props: {
    isVod: {
      type: Boolean,
      default() {
        return false
      }
    },
    channelName: {
      type: String
    }
  },
  async setup(props) {
    let messages = ref<ParsedMessage[]>([])
    let vodMessageCache = ref<ParsedMessage[]>([])
    let badges: Badge[] = []
    let wsLink = inject('wsLink') as string

    await getEndpoint(`api/badges?channelName=${props.channelName}`)
    .then((data) => {
      console.log(data)
      badges = data
    })

    return {
      ws: props.isVod ? null : new WebSocket(wsLink),
      messages,
      badges,
      vodMessageCache,
      fetchingMoreComments: false
    }
  },
  async mounted() {

    if (!this.$props.isVod) {
      const chatStatusMessage = this.$refs.initConnectingStatus as Element
      this.ws!.onmessage = (message) => {
        if (message.data == 'OK') {
          chatStatusMessage.textContent = this.$t("chat.connected", {username: this.channelName})
        } else {
          this.messages.push(parseMessage(message.data, this.badges))
          this.clearMessages()
          this.scrollToBottom()
        }
      }

      this.ws!.onopen = () => {
        this.ws!.send('JOIN ' + this.$props.channelName?.toLowerCase())
      }
    }

    await getEndpoint(`api/chat/${this.$props.channelName}/history`)
    .then((data) => {
      this.messages = parseChatHistory(data, this.badges)
    })

  },
  beforeUnmount() {
    this.ws?.close()
    this.ws = null
  },
  methods: {
    getChat() {
      return this.messages
    },
    scrollToBottom() {
      const el = this.$refs.chatList as Element
      el.scrollTop = el.scrollHeight
    },
    clearMessages() {
      if (this.messages.length > 50) {
        this.messages.splice(0, this.messages.length-50);
      }
    },
    getBadgesFromMessage(message: ParsedMessage) {
      let badgesString = message.data.tags.badges;
      if (!badgesString) return;
      let badges = badgesString.split(',');
      let formatedBadges = badges.map((badgeWithVersion: string) => {
        const [setId, version] = badgeWithVersion.split('/');
        return { setId, version };
      });

      return getBadges(this.badges, formatedBadges);
    },
    async updateVodComments(time: number) {
      time = Math.round(time)
      if (!this.isVod) {
        return
      }

      this.clearMessages()

      if(this.vodMessageCache.length > 5) {
        for (let i = 0; i < this.vodMessageCache.length; i++) {
        const offset = this.vodMessageCache[i].data.offset
        if (offset <= time) {
          this.messages.push(this.vodMessageCache[i])
          this.vodMessageCache.splice(i, 1)
        }
      }
      }

      this.scrollToBottom()

      // do not go further is the newest message offset is greater than the current time
      if (this.vodMessageCache[0] != undefined && time < this.vodMessageCache[this.vodMessageCache.length - 1].data.offset) {
        return
      } 

      if (this.fetchingMoreComments) {
        return
      }

      // prevents multiple fetches at the same sime causing duplicates
      this.fetchingMoreComments = true
      await getEndpoint(`api/vods/comments/${this.$route.params.vodID}/${time}` )
        .then((data: VodComment[]) => {

          for (let message of data) {
            let parsedMessage = parseMessage(JSON.stringify(message), this.badges)
            parsedMessage.data.badges = getBadges(this.badges, parsedMessage.data.badges)
            this.vodMessageCache.push(parsedMessage) 
          }

          this.fetchingMoreComments = false
        })

        this.scrollToBottom()
    }
  },
  components: {
    BadgeVue
  },
  unmounted() {
    this.messages = []
    this.badges = []
  }
}
</script>
<template>
  <div class="p-3 bg-crust rounded-lg w-[99vw] md:max-w-[15.625rem] lg:max-w-[20rem] flex flex-col" @PlayerTimeUpdate="updateVodComments">
    
    <!-- SYSTEM MESSAGES -->
    <ul
      class="overflow-y-scroll overflow-x-hidden space-y-1 whitespace-pre-wrap h-[46.875rem]"
      ref="chatList"
    >
      <li v-if="!isVod">
        <p ref="initConnectingStatus" class="text-gray-500 text-sm italic">
          {{ $t("chat.connecting", { username: channelName }) }}
        </p>
      </li>
      <li v-for="message in getChat()" :key="messages.indexOf(message)">

        <div v-if="message.type === 'PRIVMSG'" class="text-contrast inline-flex">
          
          <!-- CHAT MESSAGE-->
          <p class="text-sm items-center">
            <ul class="inline-flex space-x-1 pr-1">
              <li v-for="badge in message.data.badges" :key="badge.id">
                <badge-vue :badge-info="badge"></badge-vue>
              </li>
            </ul>
            
            <strong
              :style="message.data.color? `color: ${message.data.color};` : ``"
              class="text-purple font-bold">
              {{ message.data.username }}</strong>: {{ message.data.message }}
          </p>
        </div>

        <div v-else-if="message.type === 'CLEARMSG'" class="text-contrast inline-flex">
          <p class="text-sm text-gray-500 italic"> {{ $t("chat.removed", { username: message.data.username }) }} </p>
        </div>

        <div v-else-if="message.type === 'USERNOTICE'" class="text-contrast inline-flex bg-pink bg-opacity-50 p-1 rounded-md">
          <p> {{ $t("chat.resub", { username: message.data.username, duration : message.data.months }) }} </p>
        </div>

        <div v-else-if="message.type === 'CLEARCHAT'" class="text-contrast inline-flex p-1 rounded-md">
          <p v-if="!message.data.duration" class="text-sm text-gray-500 italic"> {{ $t("chat.banned", { username: message.data.username }) }} </p>
          <p v-else class="text-sm text-gray-500 italic"> {{ $t("chat.timeout", { username: message.data.username, duration: message.data.duration }) }} </p>
        </div>

        <div v-else-if="message.type === 'NOTICE'" class="text-contrast inline-flex bg-pink bg-opacity-50 p-1 rounded-md">
          <p> {{ message.data.message }} </p>
        </div>

        <div v-else class="text-contrast">
          {{ message }}
        </div>
      </li>
    </ul>
  </div>
</template>
