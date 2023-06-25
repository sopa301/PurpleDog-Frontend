import React from "react";
import { fireEvent, render } from "../../../test_utils";
import { DateTime, Interval } from "luxon";
import { Availability } from "../../../../src/objects/Availability";
import AvailList from "../../../../src/components/projects/managePeople/availList";
import { Person } from "../../../../src/objects/Person";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

function convertToEnDateTimeHTML(dateTime) {
  // TODO: figure out how to convert a datetime into this format: "25/06/2023 02:24 AM" using the toFormat instance method
  return dateTime
    .setLocale("en-gb")
    .toFormat("dd/MM/yyyy hh:mm a")
    .toUpperCase();
}
function convertToEnDateTime(dateTime) {
  return (
    dateTime.setLocale("en-gb").toLocaleString() +
    " " +
    dateTime.toLocaleString(DateTime.TIME_SIMPLE)
  );
}
function convertToEnInterval(interval) {
  // We can't just toString() it because the char – gets normalised to -.
  return (
    interval.start.toLocaleString(DateTime.DATETIME_MED) +
    " – " +
    interval.end.toLocaleString(DateTime.DATETIME_MED)
  );
}

test("If it renders properly with an array", () => {
  const avail1 = new Availability(
    1,
    Interval.fromDateTimes(
      DateTime.local(2020, 2, 2, 12),
      DateTime.local(2020, 3, 3, 12)
    )
  );
  const avail2 = new Availability(
    2,
    Interval.fromDateTimes(
      DateTime.local(2021, 2, 2, 12),
      DateTime.local(2021, 3, 3, 12)
    )
  );
  const array = [avail1, avail2];
  const compo = render(<AvailList array={array} />);
  expect(compo.queryByText("Availabilities")).toBeTruthy();
  expect(compo.queryByText("Add Availability")).toBeTruthy();

  expect(compo.getByText(convertToEnInterval(avail1.interval))).toBeTruthy();
  expect(compo.getByText(convertToEnInterval(avail2.interval))).toBeTruthy();
});
test("If it renders properly with an empty array", () => {
  const array = [];
  const compo = render(<AvailList array={array} />);
  expect(compo.queryByText("Availabilities")).toBeTruthy();
  expect(compo.queryByText("Add Availability")).toBeTruthy();
});
test("If it adds an availability when successful", async () => {
  const avail1 = new Availability(
    null,
    Interval.fromDateTimes(
      DateTime.local(2020, 2, 2, 12, 0),
      DateTime.local(2020, 3, 3, 12, 0),
    )
  );
  const nowString = convertToEnDateTimeHTML(DateTime.now());
  let avails = [];
  const user = userEvent.setup();
  vi.mock("axios", async () => {
    const actual = await vi.importActual("axios");
    return {
      ...actual,
    };
  });
  const axiosMock = new MockAdapter(axios);
  let requestBody;
  axiosMock
    .onPut(import.meta.env.VITE_API_URL + "/avail")
    .reply(function (config) {
      requestBody = JSON.parse(config.data);
      return [200, { availabilityId: 1 }]; // Return a mock response
    });
  localStorage.setItem("personId", 1);
  const person = new Person(1, "Pennyworth", [], "editor");
  const compo = render(
    <AvailList
      array={avails}
      setArray={(arr) => {
        avails = arr;
        person.avails = arr;
      }}
      person={person}
      projectId={1}
    />
  );
  await user.click(compo.queryAllByText("Add Availability")[0]);
  // I have no idea how to make userEvent do it so fireEvent will have to do
  fireEvent.change(compo.queryAllByDisplayValue(nowString)[0], {target: {value: convertToEnDateTime(avail1.interval.start)}})
  fireEvent.change(compo.queryAllByDisplayValue(nowString)[0], {target: {value: convertToEnDateTime(avail1.interval.end)}})
  await user.click(compo.queryAllByText("Add Availability")[2]);
  expect(requestBody).toEqual({
    projectId: 1,
    personId: 1,
    availabilityJSON: avail1.toJSONable(),
  });
  compo.rerender(
    <BrowserRouter>
      <AvailList
        array={avails}
        setArray={(arr) => {
          avails = arr;
          person.avails = arr;
        }}
        person={person}
        projectId={1}
      />
    </BrowserRouter>
  );
  expect(compo.queryByText(convertToEnInterval(avail1.interval))).toBeTruthy();
});
test("If it doesn't add an availability when unsuccessful", () => {
  const array = [];
  const compo = render(<AvailList array={array} />);
});
test("If it edits an availability when successful", () => {
  const array = [];
  const compo = render(<AvailList array={array} />);
});
test("If it doesn't edit an availability when unsuccessful", () => {
  const array = [];
  const compo = render(<AvailList array={array} />);
});
test("If it deletes an availability when successful", () => {
  const array = [];
  const compo = render(<AvailList array={array} />);
});
test("If it doesn't delete an availability when unsuccessful", () => {
  const array = [];
  const compo = render(<AvailList array={array} />);
});
