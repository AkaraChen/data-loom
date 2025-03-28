import { useSettingsStore } from '~/stores/settings'
import OpenAI from 'openai'

/**
 * OpenAI client options interface
 */
interface OpenAIClientOptions {
  apiKey: string
  dangerouslyAllowBrowser: boolean
  baseURL?: string
}

/**
 * Composable for creating and managing OpenAI client
 * @returns Functions for getting OpenAI client
 */
export function useOpenAI() {
  const settingsStore = useSettingsStore()

  /**
   * Check if OpenAI client can be created (API key is set)
   * @returns True if client can be created, false otherwise
   */
  const canCreateClient = computed(() => !!settingsStore.apiKey)

  /**
   * Memoized OpenAI client instance
   * Will only be recreated when apiKey or apiEndpoint changes
   */
  const client = computed(() => {
    const apiKey = settingsStore.apiKey

    if (!apiKey) {
      throw new Error(
        'API key is not set. Please configure it in the settings.',
      )
    }

    const clientOptions: OpenAIClientOptions = {
      apiKey,
      dangerouslyAllowBrowser: true,
    }

    // Use custom API endpoint if provided
    if (settingsStore.apiEndpoint) {
      clientOptions.baseURL = settingsStore.apiEndpoint
    }

    return new OpenAI(clientOptions)
  })

  /**
   * Get OpenAI client with current settings
   * @returns OpenAI client instance
   * @throws Error if API key is not set
   */
  const getClient = () => {
    return client.value
  }

  return {
    getClient,
    canCreateClient,
  }
}
