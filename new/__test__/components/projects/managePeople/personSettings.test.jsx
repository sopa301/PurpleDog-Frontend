import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { Accordion } from "@chakra-ui/react";
import { Person } from "../../../../src/objects/Person";
import PersonSettings from "../../../../src/components/projects/managePeople/personSettings";
import { Project } from "../../../../src/objects/Project";

test("If it renders properly for owner", () => {
  const person = new Person(1, "Klingon", [], "owner");
  const compo = render(
    <Accordion>
      <PersonSettings
        person={person}
        proj={new Project(1, "Yoyo", [person], [])}
      />
    </Accordion>
  );
  expect(compo.queryByText("Klingon")).toBeTruthy();
  expect(compo.queryByText("Remove from project")).toBeFalsy();
  expect(compo.queryByText("Editor")).toBeFalsy();
  expect(compo.queryByText("Viewer")).toBeFalsy();
});

test("If it renders properly for non-owner", () => {
  const person = new Person(1, "Klingon", [], "viewer");
  const compo = render(
    <Accordion>
      <PersonSettings
        person={person}
        proj={new Project(1, "Yoyo", [person], [])}
      />
    </Accordion>
  );
  expect(compo.queryByText("Klingon")).toBeTruthy();
  expect(compo.queryByText("Remove from project")).toBeTruthy();
  expect(compo.queryByText("Editor")).toBeTruthy();
  expect(compo.queryByText("Viewer")).toBeTruthy();
});