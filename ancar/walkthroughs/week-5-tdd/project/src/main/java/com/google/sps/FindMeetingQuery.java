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

import java.util.Collection;
import java.util.ArrayList;
import java.util.List;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
      Collection<TimeRange> meetingQueriesMandatoryPeople = getSlotsMandatoryAttendees(events, request);
      Collection<TimeRange> meetingQueriesOptionalPeople = getSlotsWithOptionalAttendees(events, request);

      if (meetingQueriesOptionalPeople.isEmpty()) {
          return meetingQueriesMandatoryPeople;
      } else {
          return meetingQueriesOptionalPeople;
      }
  }

  public Collection<TimeRange> getSlotsMandatoryAttendees(Collection<Event> events, MeetingRequest request) {
    List<TimeRange> meetingQueries = new ArrayList<>();
    int startTime = -1;
    int intervalForMeet = 0;
    boolean approvedTimeRange;

    for (int hour = 0; hour <= 23; hour++) {
        for (int minute = 0; minute <= 59; minute ++) {
            approvedTimeRange = true;
            TimeRange possibleTimeRange = TimeRange.fromStartDuration(hour * 60 + minute, (int)request.getDuration());

            if (TimeRange.WHOLE_DAY.contains(possibleTimeRange)) {
                for (Event event : events) {
                    if (event.getWhen().overlaps(possibleTimeRange)) {
                        for (String attendee : event.getAttendees()) {
                            if (request.getAttendees().contains(attendee)) {
                                approvedTimeRange = false;
                            }
                        }
                    }
                }

                if (approvedTimeRange) {
                    if (startTime == -1) {
                        startTime = possibleTimeRange.start();
                        intervalForMeet = 0;
                    } else {
                        intervalForMeet++;
                    }
                } else if (startTime != -1) {
                    meetingQueries.add(TimeRange.fromStartDuration(startTime, (int) (request.getDuration() + intervalForMeet)));
                    startTime = -1;
                }
            }
        }
    }

    if (startTime != -1) {
        meetingQueries.add(TimeRange.fromStartDuration(startTime, (int) (request.getDuration() + intervalForMeet)));
    }

    return meetingQueries;
  }

  public Collection<TimeRange> getSlotsWithOptionalAttendees(Collection<Event> events, MeetingRequest request) {
    List<TimeRange> meetingQueries = new ArrayList<>();
    int startTime = -1;
    int intervalForMeet = 0;
    boolean approvedTimeRange;

    for (int hour = 0; hour <= 23; hour++) {
        for (int minute = 0; minute <= 59; minute ++) {
            approvedTimeRange = true;
            TimeRange possibleTimeRange = TimeRange.fromStartDuration(hour * 60 + minute, (int)request.getDuration());

            if (TimeRange.WHOLE_DAY.contains(possibleTimeRange)) {
                for (Event event : events) {
                    if (event.getWhen().overlaps(possibleTimeRange)) {
                        for (String attendee : event.getAttendees()) {
                            if (request.getAttendees().contains(attendee) || 
                                request.getOptionalAttendees().contains(attendee)) {
                                approvedTimeRange = false;
                            }
                        }
                    }
                }

                if (approvedTimeRange) {
                    if (startTime == -1) {
                        startTime = possibleTimeRange.start();
                        intervalForMeet = 0;
                    } else {
                        intervalForMeet++;
                    }
                } else if (startTime != -1) {
                    meetingQueries.add(TimeRange.fromStartDuration(startTime, (int) (request.getDuration() + intervalForMeet)));
                    startTime = -1;
                }
            }
        }
    }

    if (startTime != -1) {
        meetingQueries.add(TimeRange.fromStartDuration(startTime, (int) (request.getDuration() + intervalForMeet)));
    }

    return meetingQueries;
  }
}
