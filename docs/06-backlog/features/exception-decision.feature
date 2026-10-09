# Acceptance criteria for US-01, US-02, US-05, US-07, US-08, US-09, US-10, US-11.
# This Examples table is executable: tests/exception-rules.test.mjs runs every row
# against site/assets/exception-rules.mjs. Rule IDs: docs/05-requirements/exception-rules.md.
# "late" = expected delivery minus the END of the agreed delivery window, in minutes (<= 0: still inside).
# Illustrative parameters agreed with the Product Owner: major from 120 min, critical from 360 min,
# throttle window 120 min, response time critical 30 min / major 120 min.

@decision
Feature: Classify a change on a door-to-door order and decide who acts and who is told
  So that planners act on what matters and customers hear about it before they call,
  every status or ETA change on a door-to-door order is evaluated with one set of rules.

  Background:
    Given a door-to-door order with an agreed delivery window at the consignee
    And the customer receives notifications through the portal and by e-mail

  Scenario Outline: <id> <title>
    Given the change is caused by <cause>
    And expected delivery is <late> minutes after the end of the window and moves to another day is <next_day>
    And the cargo is time-critical is <time_critical> and the customer is a key account is <key>
    And the customer wants every update is <all_updates> and a missing status was confirmed is <confirmed>
    And the last notification had severity <last_sev>, <since> minutes ago
    When the change is evaluated
    Then the exception type is <type> with severity <severity>
    And the owner is <owner> with response time <sla> minutes
    And the customer notification is <notification>

    Examples:
      | id      | title                                              | cause             | late | next_day | time_critical | key | all_updates | confirmed | last_sev | since | type              | severity | owner         | sla | notification    |
      | AC-01.1 | Later than planned but inside the window           | SAILING_DELAY     | -30  | no       | no            | no  | no          | no        | -        | -     | NONE              | NONE     | -             | -   | NONE            |
      | AC-01.2 | Exactly at the end of the window is still on time  | SAILING_DELAY     | 0    | no       | no            | no  | no          | no        | -        | -     | NONE              | NONE     | -             | -   | NONE            |
      | AC-01.3 | One minute late: minor, monitored, not notified    | SAILING_DELAY     | 1    | no       | no            | no  | no          | no        | -        | -     | SAILING_DELAY     | MINOR    | ROAD_PLANNING | -   | NONE            |
      | AC-01.4 | Minor, customer asked for every update             | SAILING_DELAY     | 1    | no       | no            | no  | yes         | no        | -        | -     | SAILING_DELAY     | MINOR    | ROAD_PLANNING | -   | NOTIFY          |
      | AC-01.5 | 119 minutes late is still minor                    | ROAD_DELAY        | 119  | no       | no            | no  | no          | no        | -        | -     | ROAD_DELAY        | MINOR    | ROAD_PLANNING | -   | NONE            |
      | AC-01.6 | 120 minutes late is major                          | ROAD_DELAY        | 120  | no       | no            | no  | no          | no        | -        | -     | ROAD_DELAY        | MAJOR    | ROAD_PLANNING | 120 | NOTIFY          |
      | AC-01.7 | 359 minutes late is still major                    | SAILING_DELAY     | 359  | no       | no            | no  | no          | no        | -        | -     | SAILING_DELAY     | MAJOR    | ROAD_PLANNING | 120 | NOTIFY          |
      | AC-01.8 | 360 minutes late is critical                       | SAILING_DELAY     | 360  | no       | no            | no  | no          | no        | -        | -     | SAILING_DELAY     | CRITICAL | ROAD_PLANNING | 30  | NOTIFY          |
      | AC-01.9 | Delivery moves to the next day: slot lost          | SAILING_DELAY     | 180  | yes      | no            | no  | no          | no        | -        | -     | SAILING_DELAY     | CRITICAL | ROAD_PLANNING | 30  | NOTIFY          |
      | AC-01.10 | Reefer one hour late goes up one level            | ROAD_DELAY        | 60   | no       | yes           | no  | no          | no        | -        | -     | ROAD_DELAY        | MAJOR    | ROAD_PLANNING | 120 | NOTIFY          |
      | AC-01.11 | Reefer three hours late becomes critical          | SAILING_DELAY     | 200  | no       | yes           | no  | no          | no        | -        | -     | SAILING_DELAY     | CRITICAL | ROAD_PLANNING | 30  | NOTIFY          |
      | AC-01.12 | Cancelled sailing is critical even if ETA is fine | SAILING_CANCELLED | -60  | no       | no            | no  | no          | no        | -        | -     | SAILING_CANCELLED | CRITICAL | ROAD_PLANNING | 30  | NOTIFY          |
      | AC-02.1 | Terminal delay is owned by terminal operations     | TERMINAL_DELAY    | 400  | no       | no            | no  | no          | no        | -        | -     | TERMINAL_DELAY    | CRITICAL | TERMINAL_OPS  | 30  | NOTIFY          |
      | AC-09.1 | Customs hold: customs desk, customer must act      | CUSTOMS_HOLD      | 0    | no       | no            | no  | no          | no        | -        | -     | CUSTOMS_HOLD      | MAJOR    | CUSTOMS_DESK  | 120 | ACTION_REQUIRED |
      | AC-09.2 | Customs hold on a reefer is critical               | CUSTOMS_HOLD      | 0    | no       | yes           | no  | no          | no        | -        | -     | CUSTOMS_HOLD      | CRITICAL | CUSTOMS_DESK  | 30  | ACTION_REQUIRED |
      | AC-09.3 | Customs request is never throttled                 | CUSTOMS_HOLD      | 0    | no       | no            | no  | no          | no        | MAJOR    | 30    | CUSTOMS_HOLD      | MAJOR    | CUSTOMS_DESK  | 120 | ACTION_REQUIRED |
      | AC-08.1 | Missing status: planner acts, customer not yet     | STATUS_MISSING    | 0    | no       | no            | no  | no          | no        | -        | -     | STATUS_MISSING    | MAJOR    | ROAD_PLANNING | 120 | HOLD            |
      | AC-08.2 | Missing status on a reefer is critical, still held | STATUS_MISSING    | 0    | no       | yes           | no  | no          | no        | -        | -     | STATUS_MISSING    | CRITICAL | ROAD_PLANNING | 30  | HOLD            |
      | AC-08.3 | Planner confirms a real delay: normal road delay   | STATUS_MISSING    | 150  | no       | no            | no  | no          | yes       | -        | -     | ROAD_DELAY        | MAJOR    | ROAD_PLANNING | 120 | NOTIFY          |
      | AC-08.4 | Planner confirms the truck is on time: no alarm    | STATUS_MISSING    | -20  | no       | no            | no  | no          | yes       | -        | -     | NONE              | NONE     | -             | -   | NONE            |
      | AC-11.1 | Critical for a key account adds a call task        | SAILING_DELAY     | 400  | no       | no            | yes | no          | no        | -        | -     | SAILING_DELAY     | CRITICAL | ROAD_PLANNING | 30  | NOTIFY_AND_CALL |
      | AC-11.2 | Major for a key account: message, no call          | SAILING_DELAY     | 200  | no       | no            | yes | no          | no        | -        | -     | SAILING_DELAY     | MAJOR    | ROAD_PLANNING | 120 | NOTIFY          |
      | AC-11.3 | Cancelled sailing for a key account                | SAILING_CANCELLED | 0    | no       | no            | yes | no          | no        | -        | -     | SAILING_CANCELLED | CRITICAL | ROAD_PLANNING | 30  | NOTIFY_AND_CALL |
      | AC-07.1 | Same severity within 2 h: no second message        | SAILING_DELAY     | 200  | no       | no            | no  | no          | no        | MAJOR    | 30    | SAILING_DELAY     | MAJOR    | ROAD_PLANNING | 120 | SUPPRESSED      |
      | AC-07.2 | It got worse within 2 h: notify again              | SAILING_DELAY     | 400  | no       | no            | no  | no          | no        | MAJOR    | 30    | SAILING_DELAY     | CRITICAL | ROAD_PLANNING | 30  | NOTIFY          |
      | AC-07.3 | Exactly 2 h after the last message: notify again   | SAILING_DELAY     | 200  | no       | no            | no  | no          | no        | MAJOR    | 120   | SAILING_DELAY     | MAJOR    | ROAD_PLANNING | 120 | NOTIFY          |
      | AC-07.4 | Better than last time within 2 h: no message       | SAILING_DELAY     | 150  | no       | no            | no  | no          | no        | CRITICAL | 45    | SAILING_DELAY     | MAJOR    | ROAD_PLANNING | 120 | SUPPRESSED      |
      | AC-07.5 | Key account, still critical within 2 h: no 2nd call | SAILING_DELAY    | 420  | no       | no            | yes | no          | no        | CRITICAL | 45    | SAILING_DELAY     | CRITICAL | ROAD_PLANNING | 30  | SUPPRESSED      |
      | AC-10.1 | Back inside the window after a message             | SAILING_DELAY     | -15  | no       | no            | no  | no          | no        | MAJOR    | 90    | RECOVERED         | NONE     | -             | -   | NOTIFY_RECOVERY |
      | AC-10.2 | Back inside the window, customer never told        | ROAD_DELAY        | -5   | no       | no            | no  | no          | no        | -        | -     | NONE              | NONE     | -             | -   | NONE            |
