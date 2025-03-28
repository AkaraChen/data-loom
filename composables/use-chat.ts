import { useMutation } from '@tanstack/vue-query'
import { useSettingsStore } from '~/stores/settings'
import { useOpenAI } from '~/composables/use-openai'
import OpenAI from 'openai'

/**
 * Chat options interface
 */
export interface ChatOptions {
  /**
   * Callback function that is called when text is updated
   * @param text The updated text
   */
  onUpdate?: (text: string) => void
}

/**
 * Chat request interface
 */
export interface ChatRequest {
  /**
   * The content of the message
   */
  content: string
  /**
   * The system prompt (optional)
   */
  systemPrompt?: string
}

/**
 * Chat response interface
 */
export interface ChatResponse {
  /**
   * The response text
   */
  text: string
  /**
   * Whether the response is complete
   */
  isComplete: boolean
}

/**
 * Composable for chat functionality using OpenAI API
 * @param options Chat options
 * @returns Chat mutation and utility functions
 */
export function useChat(options: ChatOptions = {}) {
  const settingsStore = useSettingsStore()
  const { getClient } = useOpenAI()
  const streamedText = ref('')

  // Reset streamed text
  const resetStreamedText = () => {
    streamedText.value = ''
  }

  // Create chat mutation
  const chatMutation = useMutation({
    mutationFn: async ({
      content,
      systemPrompt = '',
    }: ChatRequest): Promise<ChatResponse> => {
      try {
        resetStreamedText()

        const openai = getClient()
        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = []

        // Add system message if provided
        if (systemPrompt) {
          messages.push({
            role: 'system',
            content: systemPrompt,
          })
        }

        // Add user message
        messages.push({
          role: 'user',
          content,
        })

        // Create the stream
        const stream = await openai.chat.completions.create({
          model: settingsStore.model || 'gpt-3.5-turbo',
          messages,
          stream: true,
        })

        // Process the stream
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            streamedText.value += content

            // Call onUpdate callback if provided
            if (options.onUpdate) {
              options.onUpdate(streamedText.value)
            }
          }
        }

        return {
          text: streamedText.value,
          isComplete: true,
        }
      } catch (error) {
        console.error('Chat error:', error)
        throw error
      }
    },
  })

  // Abort current stream
  const abortChat = () => {
    if (chatMutation.isPending.value) {
      chatMutation.reset()
    }
  }

  return {
    sendMessage: chatMutation.mutate,
    isStreaming: chatMutation.isPending,
    isError: chatMutation.isError,
    error: chatMutation.error,
    streamedText,
    abortChat,
    reset: resetStreamedText,
  }
}
