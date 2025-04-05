import { useSettingsStore } from '~/stores/settings'
import OpenAI from 'openai'
import { computed } from 'vue'
import { useToast } from '~/composables/use-toast'
import { useRuntimeConfig } from '#imports'

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
  const config = useRuntimeConfig()

  /**
   * 检查是否处于托管模式
   */
  const isManagedMode = () => config.public.managedMode === true

  /**
   * Get the API key based on managed mode
   */
  const getApiKey = () => {
    return isManagedMode() ? config.public.apiKey : settingsStore.apiKey
  }

  /**
   * Get the API endpoint based on managed mode
   */
  const getApiEndpoint = () => {
    return isManagedMode()
      ? config.public.apiEndpoint
      : settingsStore.apiEndpoint
  }

  /**
   * Get the model based on managed mode
   */
  const getModel = () => {
    return isManagedMode() && config.public.model
      ? config.public.model
      : settingsStore.model
  }

  /**
   * Check if OpenAI client can be created (API key is set or in managed mode)
   * @returns True if client can be created, false otherwise
   */
  const canCreateClient = computed(() => !!getApiKey() || isManagedMode())

  /**
   * Memoized OpenAI client instance
   * Will only be recreated when apiKey or apiEndpoint changes
   */
  const client = computed(() => {
    const apiKey = getApiKey()
    const toast = useToast()

    if (!apiKey || typeof apiKey !== 'string') {
      toast.error('API key is not set. Please configure it in the settings.')
      throw new Error(
        'API key is not set. Please configure it in the settings.',
      )
    }

    const clientOptions: OpenAIClientOptions = {
      apiKey,
      dangerouslyAllowBrowser: true,
    }

    // Use custom API endpoint if provided
    const endpoint = getApiEndpoint()
    if (endpoint && typeof endpoint === 'string') {
      clientOptions.baseURL = endpoint
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
    getModel,
    getApiKey,
    getApiEndpoint,
    isManagedMode,
  }
}
