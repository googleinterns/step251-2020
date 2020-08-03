// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;
import java.util.ArrayList;
import java.util.Collection;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(final Collection<Event> events, final MeetingRequest request) {
    ArrayList<TimeRange> answer = new ArrayList<>();

    int lastOkStartTime = -1;
    int maxOptionalAttendees = -1;

    for (int hour = 0; hour <= 23; hour++) {
      for (int minute = 0; minute <= 59; minute++) {
        int start = hour * 60 + minute;
        TimeRange potential = TimeRange.fromStartDuration(start, (int)request.getDuration());

        if (!TimeRange.WHOLE_DAY.contains(potential)) {
          break;
        }

        boolean isOk = true;
        for (String reqAttendee : request.getAttendees()) {
          isOk &= canAttend(events, potential, reqAttendee);
        }

        int optionalsCanAttend = 0;
        for (String optAttendee : request.getOptionalAttendees()) {
          if (canAttend(events, potential, optAttendee)) {
            optionalsCanAttend++;
          }
        }

        /* Max # of optionals until now, then reset answer */
        if (isOk && optionalsCanAttend > maxOptionalAttendees) {
          maxOptionalAttendees = optionalsCanAttend;
          answer.clear();
          lastOkStartTime = -1;
        }

        /* if less optionals can attend than best answer, ignore this time */
        if (isOk && maxOptionalAttendees > optionalsCanAttend) {
          isOk = false;
        }

        if (isOk) {
          if (lastOkStartTime == -1) {
            lastOkStartTime = potential.start();
          }
        } else if (lastOkStartTime != -1) {
          answer.add(TimeRange.fromStartEnd(lastOkStartTime, 
                          start - 1 + (int)request.getDuration(), false));
          lastOkStartTime = -1;
        }
      }
    }

    if(lastOkStartTime != -1) {
      answer.add(TimeRange.fromStartEnd(lastOkStartTime, TimeRange.END_OF_DAY, true));
    }
    return answer;
  }

  private boolean canAttend(final Collection<Event> allEvents, final TimeRange potential, final String attendee) {
    for (Event event : allEvents) {
      if (event.getWhen().overlaps(potential) && event.getAttendees().contains(attendee)) {
        return false;
      }
    }
    return true;
  }
}
