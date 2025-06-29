import { useQuery } from '@tanstack/vue-query'
import { useSettingsStore } from '~/stores/settings'
import { useOpenAI } from '~/composables/use-openai'

/**
 * Composable for fetching available OpenAI models
 * @returns Query result with available models
 */
export function useModels() {
  const settingsStore = useSettingsStore()
  const { getClient, canCreateClient, getApiKey, getApiEndpoint } = useOpenAI()
  const toast = useToast()

  // Query for fetching models
  const modelsQuery = useQuery({
    queryKey: ['models', getApiKey(), getApiEndpoint()],
    queryFn: async () => {
      try {
        const openai = getClient()
        const response = await openai.models.list()

        // Filter for chat completion models and sort by ID
        const chatModels = response.data.sort((a, b) =>
          a.id.localeCompare(b.id),
        )
        return chatModels
      } catch (error) {
        console.error('Error fetching models:', error)
        toast.error(
          error instanceof Error ? error.message : 'An unknown error occurred',
        )
        throw error
      }
    },
    // Only run the query if we can create a client
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
