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
import java.util.List;
import java.util.Collection;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    ArrayList<TimeRange> answer = new ArrayList<>(List.asList(TimeRange.WHOLE_DAY));

    int lastOkStartTime = -1;
    int intvervalLength = 0;
    int maxOptionalAttendees = 0;

    for (int hour = 0; hour <= 23; hour ++) {
        for (int minute = 0; minute <= 59; minute ++) {
            int start = hour * 60 + minute;
            TimeRange potential = TimeRange.fromStartDuration(start, (int)request.getDuration());
            boolean isOk = true;
            int optionalsCanAttend = 0;

            if (!TimeRange.WHOLE_DAY.contains(potential)) break;

            for (String req_attendee : request.getAttendees())
                isOk &= canAttend(events, potential, req_attendee);

            for (String opt_attendee : request.getOptionalAttendees())
                if (canAttend(events, potential, opt_attendee))
                    optionalsCanAttend ++;

            /* Max # of optionals until now, then reset answer */
            if (isOk && optionalsCanAttend > maxOptionalAttendees) {
                maxOptionalAttendees = optionalsCanAttend;
                answer.clear();
                lastOkStartTime = -1;
                intvervalLength = 0;
            }

            /* if less optionals can attend than best answer, ignore this time */
            if (isOk && maxOptionalAttendees > optionalsCanAttend)
                isOk = false;

            if (isOk) {
                if (lastOkStartTime == -1) {
                    lastOkStartTime = potential.start();
                    intvervalLength = 0;
                }
                intvervalLength ++;
            } else if (lastOkStartTime != -1) {
                answer.add(TimeRange.fromStartDuration(lastOkStartTime, intvervalLength-1 + (int)request.getDuration()));
                lastOkStartTime = -1;
            }
        }
    }

    if(lastOkStartTime != -1)
        answer.add(TimeRange.fromStartDuration(lastOkStartTime, intvervalLength-1 + (int)request.getDuration()));
    return answer;
  }

    private boolean canAttend (Collection<Event> allEvents, TimeRange potential, String attendee) {                
        boolean canAttend = true;
        for (Event event : allEvents) {
            if (event.getWhen().overlaps(potential) && event.getAttendees().contains(attendee))
                canAttend = false;
        }
        return canAttend;
    }
}
