import type { ReactElement, ReactNode } from "react"
import { MemoryRouter, Route, Routes } from "react-router"
import { render } from "@testing-library/react"
import { MockAppProvider } from "../mock/store"
import type { useProduct } from "../mock/store"

export type ProductApiLike = ReturnType<typeof useProduct>

export function Harness({
  children,
  route = "/home",
}: {
  children: ReactNode
  route?: string
}) {
  return (
    <MockAppProvider>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
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
) {
  if (demo) {
    window.history.replaceState({}, "", `/?demo=${demo}`)
  }
  return render(
    <MockAppProvider>
      <MemoryRouter initialEntries={[`${pathname}${search}`]}>
        <Routes>
          <Route path={pattern} element={element} />
        </Routes>
      </MemoryRouter>
    </MockAppProvider>,
  )
}