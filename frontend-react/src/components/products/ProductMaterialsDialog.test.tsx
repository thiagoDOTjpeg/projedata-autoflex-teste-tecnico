import productsReducer from "@/store/features/productsSlice";
import rawMaterialsReducer from "@/store/features/rawMaterialsSlice";
import * as hooks from "@/store/hooks";
import type { RootState } from "@/store/store";
import type { Product, RawMaterial } from "@/types/product";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { ProductMaterialsDialog } from "./ProductMaterialsDialog";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/store/hooks", () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

const mockProduct: Product = {
  id: "prod-1",
  name: "Gamer Chair",
  price: 500,
  materials: [
    {
      rawMaterial: { id: "mat-1", name: "Leather", stockQuantity: 100 },
      requiredQuantity: 2,
    },
  ],
};

const mockRawMaterials: RawMaterial[] = [
  { id: "mat-1", name: "Leather", stockQuantity: 100 },
  { id: "mat-2", name: "Foam", stockQuantity: 50 },
];

describe("ProductMaterialsDialog", () => {
  let mockDispatch: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    mockDispatch = vi.fn().mockReturnValue({
      unwrap: () => Promise.resolve(),
    });

    (hooks.useAppDispatch as Mock).mockReturnValue(mockDispatch);

    (hooks.useAppSelector as Mock).mockImplementation(
      (selector: (state: Partial<RootState>) => unknown) =>
        selector({
          rawMaterials: {
            rawMaterials: mockRawMaterials,
            loading: false,
            error: null,
          },
          products: { products: [mockProduct], loading: false, error: null },
        }),
    );
  });

  const renderComponent = (props = {}) => {
    const store = configureStore({
      reducer: {
        products: productsReducer,
        rawMaterials: rawMaterialsReducer,
      },
    });

    return render(
      <Provider store={store}>
        <ProductMaterialsDialog
          product={mockProduct}
          open={true}
          onOpenChange={vi.fn()}
          {...props}
        />
      </Provider>,
    );
  };

  it("should render product name and current materials correctly", () => {
    renderComponent();
    expect(
      screen.getByText(/Manufacturing Materials: Gamer Chair/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Leather")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should switch to edit mode when clicking the Edit button", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: /Edit/i }));

    expect(screen.getByText(/Add Raw Material/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Confirm/i }),
    ).toBeInTheDocument();
  });

  it("should allow adding a new material in edit mode", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: /Edit/i }));

    const select = screen.getByLabelText(/Select Material/i);
    await user.selectOptions(select, "mat-2");

    const quantityInput = screen.getByPlaceholderText("0");
    await user.type(quantityInput, "5");

    await user.click(screen.getByRole("button", { name: /Add/i }));

    expect(screen.getByText("Foam")).toBeInTheDocument();

    const inputs = screen.getAllByRole("spinbutton");
    const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
    expect(lastInput.value).toBe("5");
  });

  it("should prevent removing the last material and show a toast error", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: /Edit/i }));

    const tableBody = screen.getAllByRole("rowgroup")[1];
    const deleteButton = within(tableBody).getByRole("button");

    await user.click(deleteButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "A product must have at least one raw material.",
      );
    });

    expect(screen.getByText("Leather")).toBeInTheDocument();
  });

  it("should dispatch update action when clicking Confirm", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: /Edit/i }));
    await user.click(screen.getByRole("button", { name: /Confirm/i }));

    expect(mockDispatch).toHaveBeenCalled();
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Materials updated successfully!",
      );
    });
  });
});
