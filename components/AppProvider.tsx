import { LoadingProvider } from "@/context/loadingContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <LoadingProvider>{children}</LoadingProvider>;
}
