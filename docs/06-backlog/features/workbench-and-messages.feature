# Acceptance criteria for US-03, US-04, US-05, US-08, US-13 that are not decision logic.
# Tested by the tester in the test environment and by key users in BAT (docs/09-acceptance/bat-plan.md).

Feature: Planner workbench
  So that planners stop using the disruption sheet,
  open exceptions are shown in one list, in the order they need attention.

  Scenario: AC-03.1 Most urgent first
    Given open exceptions "EX-1" critical due 10:30, "EX-2" major due 11:45 and "EX-3" critical due 10:15
    When the road planner opens the workbench
    Then the order is "EX-3", "EX-1", "EX-2"

  Scenario: AC-03.3 A delayed sailing only lists orders outside their window
    Given a sailing is delayed by 6 hours and carries 20 door-to-door orders
    And 3 of these orders are now expected after the end of their delivery window
    When the delay is processed
    Then the workbench shows 3 new exceptions
    And the other 17 orders show the new ETA in the portal without an exception

  Scenario: AC-03.4 Overdue critical exception is escalated
    Given a critical exception opened at 10:00
    And nobody acknowledged it
    When it is 10:31
    Then the exception is marked "escalated"
    And it appears in the shift lead's view

  Scenario: AC-04.3 A reason is mandatory to resolve
    Given an acknowledged exception
    When the planner resolves it without a reason code
    Then the exception stays open and the planner is asked for a reason

Feature: Customer messages

  Scenario: AC-05.1 Major exception is announced within 5 minutes
    Given a pilot customer's order is expected 140 minutes after the end of its window
    When the exception opens at 09:52
    Then the operational contact receives an e-mail and a portal message by 09:57

  Scenario: AC-05.2 Message content
    When a customer message is created
    Then it contains the order reference, the agreed window, the new ETA, the reason category and the next step
    And it does not contain the driver's name, phone number or location

  Scenario: AC-05.3 Bounced e-mail
    Given the operational contact's e-mail address bounces
    When the message is sent
    Then the exception shows "message failed"
    And a call task is created for customer service

Feature: Missing status

  Scenario: AC-08.5 Haulier confirms the truck is on time
    Given a held missing-status exception
    When the planner records "haulier confirms on time"
    Then the exception closes with reason "false alarm"
    And no customer message is sent

Feature: Pilot

  Scenario: AC-13.1 Shadow mode for customers outside the pilot
    Given a customer is not in the pilot
    When a major exception opens on their order
    Then the exception is logged
    And no customer message is sent
