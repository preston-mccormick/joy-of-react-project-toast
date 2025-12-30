import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToastProvider, { ToastContext } from "./ToastProvider";

// Test component that uses the ToastContext
function TestComponent() {
  const { popToast, toasts, dismissToast } = React.useContext(ToastContext);

  return (
    <div>
      <button onClick={() => popToast("Notice message", "notice")}>
        Add Notice
      </button>
      <button onClick={() => popToast("Warning message", "warning")}>
        Add Warning
      </button>
      <button onClick={() => popToast("Success message", "success")}>
        Add Success
      </button>
      <button onClick={() => popToast("Error message", "error")}>
        Add Error
      </button>
      <div data-testid="toast-count">{toasts.length}</div>
      {toasts.map((toast) => (
        <div key={toast.id} data-testid={`toast-${toast.id}`}>
          <span>
            {toast.variant}: {toast.message}
          </span>
          <button onClick={() => dismissToast(toast.id)}>
            Dismiss {toast.variant}
          </button>
        </div>
      ))}
    </div>
  );
}

describe("ToastProvider", () => {
  test("creates one of each variant and dismisses them one by one", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // Create one of each variant
    await user.click(screen.getByText("Add Notice"));
    await user.click(screen.getByText("Add Warning"));
    await user.click(screen.getByText("Add Success"));
    await user.click(screen.getByText("Add Error"));

    // Verify all 4 toasts are created
    expect(screen.getByTestId("toast-count")).toHaveTextContent("4");

    // Verify each variant exists
    const toasts = screen.getAllByTestId(/^toast-[a-f0-9-]+$/);
    expect(toasts).toHaveLength(4);
    expect(screen.getByText("notice: Notice message")).toBeInTheDocument();
    expect(screen.getByText("warning: Warning message")).toBeInTheDocument();
    expect(screen.getByText("success: Success message")).toBeInTheDocument();
    expect(screen.getByText("error: Error message")).toBeInTheDocument();

    // Dismiss them one by one
    await user.click(screen.getByText("Dismiss notice"));
    expect(screen.getByTestId("toast-count")).toHaveTextContent("3");
    expect(
      screen.queryByText("notice: Notice message")
    ).not.toBeInTheDocument();

    await user.click(screen.getByText("Dismiss warning"));
    expect(screen.getByTestId("toast-count")).toHaveTextContent("2");
    expect(
      screen.queryByText("warning: Warning message")
    ).not.toBeInTheDocument();

    await user.click(screen.getByText("Dismiss success"));
    expect(screen.getByTestId("toast-count")).toHaveTextContent("1");
    expect(
      screen.queryByText("success: Success message")
    ).not.toBeInTheDocument();

    await user.click(screen.getByText("Dismiss error"));
    expect(screen.getByTestId("toast-count")).toHaveTextContent("0");
    expect(screen.queryByText("error: Error message")).not.toBeInTheDocument();
  });

  test("creates one of each variant and dismisses them all with Escape key", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // Create one of each variant
    await user.click(screen.getByText("Add Notice"));
    await user.click(screen.getByText("Add Warning"));
    await user.click(screen.getByText("Add Success"));
    await user.click(screen.getByText("Add Error"));

    // Verify all 4 toasts are created
    expect(screen.getByTestId("toast-count")).toHaveTextContent("4");
    expect(screen.getByText("notice: Notice message")).toBeInTheDocument();
    expect(screen.getByText("warning: Warning message")).toBeInTheDocument();
    expect(screen.getByText("success: Success message")).toBeInTheDocument();
    expect(screen.getByText("error: Error message")).toBeInTheDocument();

    // Press Escape key to dismiss all
    await user.keyboard("{Escape}");

    // Wait for toasts to be dismissed
    await waitFor(() => {
      expect(screen.getByTestId("toast-count")).toHaveTextContent("0");
    });

    // Verify all toasts are gone
    expect(screen.queryByText("notice: Notice message")).not.toBeInTheDocument();
    expect(
      screen.queryByText("warning: Warning message")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("success: Success message")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("error: Error message")).not.toBeInTheDocument();
  });
});

