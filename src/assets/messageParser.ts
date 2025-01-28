import type { Badge, ParsedMessage } from './types'
import { getBadges, getBadgesFromMessage } from './badges'
import type { StreamMessage } from '@/types'

export function parseMessage(messageData: any, allBadges: Badge[]): ParsedMessage {
  const message = JSON.parse(messageData)

  if (message.type === undefined && message.cursor !== '') {
    const data: ParsedMessage = {
      type: 'PRIVMSG',
      data: {
        message: message.message,
        username: message.messager.name,
        badges: message.badges,
        offset: message.offset,
        color: message.messager.colorHex
      }
    }

    return data
  }

  switch (message.type) {
    case 'PRIVMSG': {
      const data: ParsedMessage = {
        type: 'PRIVMSG',
        data: {
          message: message.message,
          username: message.username,
          color: message.tags.color,
          badges: getBadgesFromMessage(message.tags, allBadges)
        }
      }

      return data
    }
    case 'USERNOTICE': {
      const username = message.tags.login
      const resub = message.tags['msg-id'] === 'resub'
      const months = parseInt(message.tags['msg-param-cumulative-months'])
      return {
        type: 'USERNOTICE',
        data: { username, resub, months }
      }
    }
    case 'CLEARMSG': {
      return {
        type: 'CLEARMSG',
        data: {
          username: message.tags['@login']
        }
      }
    }
    case 'CLEARCHAT': {
      let duration = message.tags['@ban-duration']
      if (!message.tags['@ban-duration']) {
        duration = 0
      }

      return {
        type: 'CLEARCHAT',
        data: {
          username: message.message.replace(/(\r\n|\n|\r)/gm, ''),
          duration
        }
      }
    }
    case 'NOTICE': {
      return {
        type: 'NOTICE',
        data: {
          message: message.message
        }
      }
    }
    // Add more cases for other message types here
    default: {
      return {
        type: 'UNKNOWN',
        data: { message }
      }
    }
  }
}

export function parseChatHistory(messages: StreamMessage[], badges: Badge[]) {
  const parsedMessages = []

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]

    const data: ParsedMessage = {
      type: 'PRIVMSG',
      data: {
        message: message.message,
        username: message.username,
        color: message.color,
        badges: getBadges(badges, message.badges)
      }
    }

    parsedMessages.push(data)
  }

  return parsedMessages
}
