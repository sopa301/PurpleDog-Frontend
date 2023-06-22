import React from "react";
import { render } from "../../../test_utils";
import PersonMenu from "../../../../src/components/projects/managePeople/personMenu";

test("If it renders properly", () => {
  const settings = {
    title: "MENUU",
    initialValues: { username: "kappa", role: "viewer" },
    onSubmit: ()=> {},
  };
  const compo = render(
    <PersonMenu isOpen={true} {...settings}/>
  );
  expect(compo.queryAllByText("MENUU")).toHaveLength(2);
  expect(compo.queryByText("Username")).toBeTruthy();
  expect(compo.queryByText("Role")).toBeTruthy();
  expect(compo.queryByText("Editor")).toBeTruthy();
  expect(compo.queryByText("Viewer")).toBeTruthy();
  
  expect(compo.queryByDisplayValue("kappa")).toBeTruthy();
});
