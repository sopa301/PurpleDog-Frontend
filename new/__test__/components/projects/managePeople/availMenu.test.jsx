import React from "react";
import { render } from "../../../test_utils";
import { DateTime } from "luxon";
import AvailMenu from "../../../../src/components/projects/managePeople/availMenu";

test("If it renders properly", () => {
  const startTime = DateTime.local(1000, 1, 1, 12);
  const endTime = DateTime.local(2020, 2, 2, 12);
  const settings = {
    title: "AVAILS",
    initialValues: { start: startTime, end: endTime },
    onSubmit: ()=> {},
  };
  const compo = render(
    <AvailMenu isOpen={true} {...settings}/>
  );
  expect(compo.queryAllByText("AVAILS")).toHaveLength(2);
  expect(compo.queryByText("Interval")).toBeTruthy();

  expect(
    compo.queryAllByDisplayValue(
      startTime.setLocale("en-gb").toLocaleString() +
        " " +
        startTime.toLocaleString(DateTime.TIME_SIMPLE)
    )
  ).toBeTruthy();
  expect(
    compo.queryAllByDisplayValue(
      endTime.setLocale("en-gb").toLocaleString() +
        " " +
        endTime.toLocaleString(DateTime.TIME_SIMPLE)
    )
  ).toBeTruthy();
});
