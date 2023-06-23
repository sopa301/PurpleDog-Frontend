import React from "react";
import { render, fireEvent, cleanup, act } from "@testing-library/react";
import CButton from "../../../src/components/custom/cButton";

test("If it renders properly", () => {
  const compo = render(<CButton content="TEST" onClick={async () => {}} />);
  expect(compo.queryByText("TEST")).toBeTruthy();
});

test("If it makes the loading animation during async function execution", async () => {
  const compo = render(
    <CButton
      content="TEST"
      onClick={async () => {
        await new Promise((r) => setTimeout(r, 10));
      }}
    />
  ); 
  expect(compo.queryByText("Loading...")).toBeFalsy();
  act(() => {
    fireEvent.click(compo.queryByText("TEST"));
  });
  expect(compo.queryByText("Loading...")).toBeTruthy();
  await act(async () => await new Promise((r) => setTimeout(r, 11)));
  expect(compo.queryByText("Loading...")).toBeFalsy();
});
