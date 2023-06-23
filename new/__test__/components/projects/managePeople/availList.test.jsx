import React from "react";
import { render } from "../../../test_utils";
import { DateTime, Interval } from "luxon";
import { Availability } from "../../../../src/objects/Availability";
import AvailList from "../../../../src/components/projects/managePeople/availList";

test("If it renders properly", () => {
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

  // We can't just toString() it because the char – gets normalised to -.
  expect(
    compo.getByText(
      avail1.interval.start.toLocaleString(DateTime.DATETIME_MED) +
        " – " +
        avail1.interval.end.toLocaleString(DateTime.DATETIME_MED)
    )
  ).toBeTruthy();
  expect(
    compo.getByText(
      avail2.interval.start.toLocaleString(DateTime.DATETIME_MED) +
        " – " +
        avail2.interval.end.toLocaleString(DateTime.DATETIME_MED)
    )
  ).toBeTruthy();
});
