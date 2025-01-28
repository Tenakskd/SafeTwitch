export interface TwitchChatOptions {
  login: {
    username: string
    password: string
  }
  channels: string[]
}

export const MessageTypes = ['PRIVMSG', 'WHISPER']
export type MessageType = (typeof MessageTypes)[number]

export interface Metadata {
  username: string
  messageType: MessageType
  channel: string
  message: string
  tags: { [k: string]: any }
}

export interface StreamMessageBadge {
  version: string
  setId: string
}

export interface StreamMessage {
  message: string
  username: string
  color: string
  badges: StreamMessageBadge[]
}
