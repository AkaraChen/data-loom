import { useQuery } from '@tanstack/vue-query'
import { useSettingsStore } from '~/stores/settings'
import OpenAI from 'openai'

/**
 * Composable for fetching available OpenAI models
 * @returns Query result with available models
 */
export function useModels() {
  const settingsStore = useSettingsStore()

  // Initialize OpenAI client
  const getOpenAIClient = () => {
    const apiKey = settingsStore.apiKey

    if (!apiKey) {
      throw new Error(
        'API key is not set. Please configure it in the settings.',
      )
    }

    const clientOptions: OpenAI.ClientOptions = {
      apiKey,
      dangerouslyAllowBrowser: true,
    }

    // Use custom API endpoint if provided
    if (settingsStore.apiEndpoint) {
      clientOptions.baseURL = settingsStore.apiEndpoint
    }

    return new OpenAI(clientOptions)
  }

  // Query for fetching models
  const modelsQuery = useQuery({
    queryKey: ['models', settingsStore.apiKey, settingsStore.apiEndpoint],
    queryFn: async () => {
      try {
        const openai = getOpenAIClient()
        const response = await openai.models.list()
        
        // Filter for chat completion models and sort by ID
        const chatModels = response.data
          .filter(model => 
            model.id.includes('gpt') || 
            model.id.includes('turbo') ||
            model.id.includes('text-davinci')
          )
          .sort((a, b) => a.id.localeCompare(b.id))
        
        return chatModels
      } catch (error) {
        console.error('Error fetching models:', error)
        throw error
      }
    },
    // Only run the query if we have an API key
    enabled: computed(() => !!settingsStore.apiKey),
    // Cache the result for 1 hour
    staleTime: 60 * 60 * 1000,
  })

  return {
    models: modelsQuery.data,
    isLoading: modelsQuery.isLoading,
    isError: modelsQuery.isError,
    error: modelsQuery.error,
    refetch: modelsQuery.refetch,
  }
}
