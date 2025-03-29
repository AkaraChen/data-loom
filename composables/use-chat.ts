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
  const toast = useToast()
  const streamedText = ref('')
  
  // Create a ref to store the current AbortController
  const abortController = ref<AbortController | null>(null)
  
  // Flag to track if the abort was intentional
  const isIntentionalAbort = ref(false)

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
        
        // Create a new AbortController for this request
        abortController.value = new AbortController()
        isIntentionalAbort.value = false
        
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

        // Create the stream with the AbortController signal
        const stream = await openai.chat.completions.create({
          model: settingsStore.model || 'gpt-3.5-turbo',
          messages,
          stream: true,
        }, {
          signal: abortController.value.signal,
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

        // Clear the AbortController after successful completion
        abortController.value = null

        return {
          text: streamedText.value,
          isComplete: true,
        }
      } catch (error) {
        // Don't show error toast if it was an intentional abort
        if (!isIntentionalAbort.value) {
          console.error('Chat error:', error)
          toast.error(
            error instanceof Error ? error.message : 'An unknown error occurred',
          )
        }
        
        // Clear the AbortController after error
        abortController.value = null
        
        throw error
      }
    },
    // Use Vue Query's retry option to prevent automatic retries on aborted requests
    retry: (failureCount, error) => {
      // Don't retry if it was an intentional abort
      if (isIntentionalAbort.value) {
        return false
      }
      // Otherwise use default retry logic (typically 3 retries)
      return failureCount < 3
    },
  })

  // Abort current stream
  const abortChat = () => {
    if (chatMutation.isPending.value && abortController.value) {
      // Set the intentional abort flag
      isIntentionalAbort.value = true
      
      // Abort the request
      abortController.value.abort()
      
      // Use Vue Query's reset to clean up the mutation state
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
