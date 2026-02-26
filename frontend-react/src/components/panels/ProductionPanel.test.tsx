import productionReducer from "@/store/features/productionSlice";
import * as hooks from "@/store/hooks";
import type { ProductionSuggestion } from "@/types/product";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { ProductionPanel } from "./ProductionPanel";

vi.mock("@/store/hooks", () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock("@/store/features/productionSlice", () => ({
  fetchProductionSuggestions: vi.fn(),
}));

describe("ProductionPanel", () => {
  let mockDispatch: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch = vi.fn();
    (hooks.useAppDispatch as Mock).mockReturnValue(mockDispatch);
  });

  const renderComponent = () => {
    const store = configureStore({
      reducer: {
        production: productionReducer,
      },
    });

    return render(
      <Provider store={store}>
        <ProductionPanel />
      </Provider>,
    );
  };

  it("should dispatch fetchProductionSuggestions on mount", () => {
    (hooks.useAppSelector as Mock).mockReturnValue({
      suggestions: [],
      loading: false,
      error: null,
    });

    renderComponent();
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("should render the skeleton when loading and suggestions are empty", () => {
    (hooks.useAppSelector as Mock).mockReturnValue({
      suggestions: [],
      loading: true,
      error: null,
    });

    const { container } = renderComponent();
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("should render error message when an error occurs", () => {
    const errorMessage = "API Connection Failed";
    (hooks.useAppSelector as Mock).mockReturnValue({
      suggestions: [],
      loading: false,
      error: errorMessage,
    });

    renderComponent();
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it("should render a message when no suggestions are available", () => {
    (hooks.useAppSelector as Mock).mockReturnValue({
      suggestions: [],
      loading: false,
      error: null,
    });

    renderComponent();
    expect(
      screen.getByText(/No production suggestions available/i),
    ).toBeInTheDocument();
  });

  it("should render the suggestions table when data is successfully fetched", () => {
    const mockSuggestions: ProductionSuggestion[] = [
      {
        productId: "p1",
        productName: "Industrial Desk",
        quantityToProduce: 15,
        totalValue: 7500,
      },
    ];

    (hooks.useAppSelector as Mock).mockReturnValue({
      suggestions: mockSuggestions,
      loading: false,
      error: null,
    });

    renderComponent();

    expect(screen.getByText("Industrial Desk")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("7500")).toBeInTheDocument();
  });
});
