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
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    //throw new UnsupportedOperationException("TODO: Implement this method.");
    ArrayList<TimeRange> answer = new ArrayList<TimeRange>();

    int lastOkStartTime = -1;
    int intvervalLength = 0;

    for (int hour = 0; hour <= 23; hour ++) {
        for (int minute = 0; minute <= 59; minute ++) {
            int start = hour * 60 + minute;
            TimeRange potential = TimeRange.fromStartDuration(start, (int)request.getDuration());
            boolean isOk = true;

            if (!TimeRange.WHOLE_DAY.contains(potential)) break;

            for (Event event : events) {
                if (event.getWhen().overlaps(potential)) {
                    for (String req_attendee : request.getAttendees()) {
                        if (event.getAttendees().contains(req_attendee))
                            isOk = false;
                    }
                }
            }

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
}
