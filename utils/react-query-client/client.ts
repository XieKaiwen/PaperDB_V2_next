"use server"
import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query"

function makeQueryClient() {
    return new QueryClient({
      defaultOptions: {
        queries: {
          // With SSR, we usually want to set some default staleTime
          // above 0 to avoid refetching immediately on the client
          staleTime: 60 * 1000,
        },
        dehydrate: {
          // include pending queries in dehydration
          shouldDehydrateQuery: (query) =>
            defaultShouldDehydrateQuery(query) ||
            query.state.status === 'pending',
        },
      },
    })
  }
  
  let browserQueryClient: QueryClient | undefined = undefined
  
  export function getQueryClient() {
    if (typeof window === 'undefined') { // Checking if we are on the server
      // Server: always make a new query client
      return makeQueryClient()
    } else {
      if (!browserQueryClient) browserQueryClient = makeQueryClient()
      return browserQueryClient
    }
  }