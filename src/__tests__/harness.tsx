import type { ReactElement, ReactNode } from "react"
import { MemoryRouter, Route, Routes } from "react-router"
import { render } from "@testing-library/react"
import { MockAppProvider } from "../mock/store"
import type { useProduct } from "../mock/store"
import { MockSessionProvider } from "./mock-session-provider"
import { installApiMock } from "./api-mock"

export type ProductApiLike = ReturnType<typeof useProduct>

export function Harness({
  children,
  route = "/home",
}: {
  children: ReactNode
  route?: string
}) {
  installApiMock()
  return (
    <MockAppProvider>
      <MockSessionProvider demo="admin">
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </MockSessionProvider>
    </MockAppProvider>
  )
}

/** Monta una pantalla real en su ruta canónica. */
export function renderScreen(
  pattern: string,
  pathname: string,
  element: ReactElement,
  search = "",
  demo?: string,
  opts?: Parameters<typeof installApiMock>[0],
) {
  const urlSearch = search || (window.location.search ?? "")
  const resolvedDemo = demo ?? (new URLSearchParams(urlSearch.replace(/^\?/, "")).get("demo") ?? undefined)
  installApiMock(opts)
  return render(
    <MockAppProvider demo={resolvedDemo}>
      <MockSessionProvider demo={resolvedDemo}>
        <MemoryRouter initialEntries={[`${pathname}${urlSearch}`]}>
          <Routes>
            <Route path={pattern} element={element} />
          </Routes>
        </MemoryRouter>
      </MockSessionProvider>
    </MockAppProvider>,
  )
}