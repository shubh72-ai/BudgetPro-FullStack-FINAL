import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders BudgetPro home page", () => {
  render(<App />);
  expect(screen.getAllByText(/Budget/i).length).toBeGreaterThan(0);
});
