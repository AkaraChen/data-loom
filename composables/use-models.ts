import { useQuery } from '@tanstack/vue-query'
import { useSettingsStore } from '~/stores/settings'
import { useOpenAI } from '~/composables/use-openai'

/**
 * Composable for fetching available OpenAI models
 * @returns Query result with available models
 */
export function useModels() {
  const settingsStore = useSettingsStore()
  const { getClient, canCreateClient } = useOpenAI()

  // Query for fetching models
  const modelsQuery = useQuery({
    queryKey: ['models', settingsStore.apiKey, settingsStore.apiEndpoint],
    queryFn: async () => {
      try {
        const openai = getClient()
        const response = await openai.models.list()
        
        // Filter for chat completion models and sort by ID
        const chatModels = response.data
          .filter(model => 
            model.id.includes('gpt')
          )
          .sort((a, b) => a.id.localeCompare(b.id))
        return chatModels
      } catch (error) {
        console.error('Error fetching models:', error)
        throw error
      }
    },
    // Only run the query if we have an API key
    enabled: canCreateClient,
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
