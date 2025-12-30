import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToastProvider from "../ToastProvider";
import ToastPlayground from "./ToastPlayground";

describe("ToastPlayground", () => {
  test("creates one of each variant through the UI and dismisses them one by one", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ToastPlayground />
      </ToastProvider>
    );

    const variants = ["notice", "warning", "success", "error"];
    const messages = [
      "This is a notice",
      "This is a warning",
      "This is a success",
      "This is an error",
    ];

    // Create one toast of each variant
    for (let i = 0; i < variants.length; i++) {
      const textarea = screen.getByRole("textbox", { name: /message/i });
      const radioButton = screen.getByLabelText(variants[i]);
      const popButton = screen.getByRole("button", { name: /pop toast/i });

      await user.clear(textarea);
      await user.type(textarea, messages[i]);
      await user.click(radioButton);
      await user.click(popButton);
    }

    // Verify all toasts are displayed
    const toasts = screen.getAllByRole("listitem");
    expect(toasts).toHaveLength(4);

    // Verify each message appears
    expect(screen.getByText("This is a notice")).toBeInTheDocument();
    expect(screen.getByText("This is a warning")).toBeInTheDocument();
    expect(screen.getByText("This is a success")).toBeInTheDocument();
    expect(screen.getByText("This is an error")).toBeInTheDocument();

    // Dismiss them one by one using the close buttons
    const closeButtons = screen.getAllByLabelText("Dismiss message");
    expect(closeButtons).toHaveLength(4);

    // Dismiss in reverse order
    for (let i = closeButtons.length - 1; i >= 0; i--) {
      await user.click(closeButtons[i]);
      const remainingToasts = screen.queryAllByRole("listitem");
      expect(remainingToasts).toHaveLength(i);
    }

    // Verify all toasts are dismissed
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  test("creates one of each variant through the UI and dismisses them all with Escape key", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ToastPlayground />
      </ToastProvider>
    );

    const variants = ["notice", "warning", "success", "error"];
    const messages = [
      "Notice message",
      "Warning message",
      "Success message",
      "Error message",
    ];

    // Create one toast of each variant
    for (let i = 0; i < variants.length; i++) {
      const textarea = screen.getByRole("textbox", { name: /message/i });
      const radioButton = screen.getByLabelText(variants[i]);
      const popButton = screen.getByRole("button", { name: /pop toast/i });

      await user.clear(textarea);
      await user.type(textarea, messages[i]);
      await user.click(radioButton);
      await user.click(popButton);
    }

    // Verify all 4 toasts are displayed
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText("Notice message")).toBeInTheDocument();
    expect(screen.getByText("Warning message")).toBeInTheDocument();
    expect(screen.getByText("Success message")).toBeInTheDocument();
    expect(screen.getByText("Error message")).toBeInTheDocument();

    // Press Escape key to dismiss all
    await user.keyboard("{Escape}");

    // Verify all toasts are dismissed
    await waitFor(() => {
      expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });

    expect(screen.queryByText("Notice message")).not.toBeInTheDocument();
    expect(screen.queryByText("Warning message")).not.toBeInTheDocument();
    expect(screen.queryByText("Success message")).not.toBeInTheDocument();
    expect(screen.queryByText("Error message")).not.toBeInTheDocument();
  });

  test("creates one of each variant using only keyboard navigation", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ToastPlayground />
      </ToastProvider>
    );

    const variants = ["notice", "warning", "success", "error"];
    const messages = [
      "Keyboard notice",
      "Keyboard warning",
      "Keyboard success",
      "Keyboard error",
    ];

    // Create one toast of each variant using only keyboard
    for (let i = 0; i < variants.length; i++) {
      // Focus the textarea
      const textarea = screen.getByRole("textbox", { name: /message/i });
      textarea.focus();
      
      // Type the message using keyboard
      await user.clear(textarea);
      await user.type(textarea, messages[i]);

      // Tab to navigate to the variant radio buttons section
      await user.tab();
      
      // Get the target radio button and focus it
      const targetRadio = screen.getByLabelText(variants[i]);
      targetRadio.focus();
      
      // Select the radio using Space key
      await user.keyboard(" ");

      // Tab to the Pop Toast button
      await user.tab();
      
      // Press Enter to activate the button
      await user.keyboard("{Enter}");

      // Wait for the toast to appear
      await waitFor(() => {
        expect(screen.getByText(messages[i])).toBeInTheDocument();
      }, { timeout: 1000 });
    }

    // Verify all 4 toasts are displayed
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText("Keyboard notice")).toBeInTheDocument();
    expect(screen.getByText("Keyboard warning")).toBeInTheDocument();
    expect(screen.getByText("Keyboard success")).toBeInTheDocument();
    expect(screen.getByText("Keyboard error")).toBeInTheDocument();
  });
});

