# Acceptance criteria for US-06 (release 2): status messages for EDI/API customers.
# Specified in refinement; NOT executable yet — release 2 is not built. See docs/06-backlog/release-2-edi-status.md.
# The rule decision is the same as in release 1 (ER-01 … ER-13); these criteria cover the channel.

@release-2
Feature: EDI and API customers receive exception updates in their own system
  So that operators see a window at risk where they work,
  the same rule decision is delivered as an IFTSTA message or a JSON webhook.

  Background:
    Given customer "Kestrel Forwarding" receives updates by EDI (IFTSTA)
    And the customer's channel is configured as "EDI only"

  Scenario: AC-06.1 Major exception becomes an EDI status message
    Given an order of Kestrel is expected 150 minutes after the end of its window
    When the exception opens
    Then one IFTSTA message is sent within 5 minutes
    And it contains the order reference, the agreed window, the new ETA and the reason category

  Scenario: AC-06.2 Minor exception is not sent unless the customer opted in
    Given an order of Kestrel is expected 60 minutes after the end of its window
    And Kestrel has not opted in to every update
    When the exception opens
    Then no EDI message is sent

  Scenario: AC-06.3 Times are UTC with an offset
    Given a new ETA of Thursday 13:10 UK time
    When the EDI message is built
    Then the date/time is expressed in UTC with its offset, not as local time without a zone

  Scenario: AC-06.4 Throttling is the same as in release 1
    Given Kestrel received a "major" EDI message for an order 30 minutes ago
    When the same order is re-evaluated as major
    Then no second EDI message is sent

  Scenario: AC-06.5 One channel per customer
    Given Kestrel's channel is "EDI only"
    When a major exception opens
    Then no e-mail is sent for that exception

  Scenario: AC-06.6 Recovery is sent through the same channel
    Given Kestrel received a delay message by EDI
    When the order is back inside a newly agreed window
    Then a "back on schedule" EDI message is sent

  Scenario: AC-06.7 Endpoint unavailable: retry
    Given Kestrel's EDI endpoint does not answer
    When a message must be sent
    Then it is retried with increasing intervals for up to 2 hours
    And the delivery log shows each attempt

  Scenario: AC-06.8 Endpoint still unavailable after 2 hours: fallback
    Given every retry for 2 hours failed
    Then an e-mail is sent to the operational contact
    And customer service receives a call task with the undelivered message

  Scenario: AC-06.9 A resent message is recognisable as the same message
    Given an EDI message was sent but the acknowledgement was lost
    When the message is sent again
    Then it carries the same message ID, so the customer's system can ignore the duplicate

  Scenario: AC-06.10 No driver data in any channel
    When any EDI or JSON message is built
    Then it contains no driver name, phone number or location

  Scenario: AC-06.11 Customer service sees what went where
    Given a message was sent by EDI
    When customer service opens the exception
    Then they see the channel, the time sent and whether it was delivered
