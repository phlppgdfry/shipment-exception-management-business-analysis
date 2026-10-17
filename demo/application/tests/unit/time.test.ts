import { describe, it, expect } from 'vitest';
import { formatDayTime, formatCustomerDayTime, formatWindow, londonDateKey, fromLocalInput, toLocalInput } from '../../src/domain/time';
describe('planner and consignee zones',()=>{
 it('same instant has different planner/customer wall clocks in winter and summer',()=>{
  expect(formatDayTime('2026-02-12T12:40:00Z')).toBe('Thu 13:40');
  expect(formatCustomerDayTime('2026-02-12T12:40:00Z')).toBe('Thu 12:40');
  expect(formatDayTime('2026-07-02T12:40:00Z')).toBe('Thu 14:40');
  expect(formatCustomerDayTime('2026-07-02T12:40:00Z')).toBe('Thu 13:40');
 });
 it('destination day classification does not change with planner date',()=>{
  expect(formatDayTime('2026-02-12T23:30:00Z')).toBe('Fri 00:30');
  expect(londonDateKey('2026-02-12T23:30:00Z')).toBe(londonDateKey('2026-02-12T12:00:00Z'));
 });
 it('midnight windows show both local dates',()=>expect(formatWindow({start:'2026-02-12T22:30:00Z',end:'2026-02-12T23:30:00Z'})).toBe('Thu 23:30 – Fri 00:30'));
 it('planner input round-trips in both seasons',()=>{
  for(const iso of ['2026-02-12T12:40:00Z','2026-07-02T12:40:00Z']) expect(fromLocalInput(toLocalInput(iso))).toBe(iso);
 });
 it('spring gap and autumn overlap are rejected instead of shifting the delivery',()=>{
  expect(()=>fromLocalInput('2026-03-29T02:30')).toThrow(/clocks change/);
  expect(()=>fromLocalInput('2026-10-25T02:30')).toThrow(/clocks change/);
  expect(fromLocalInput('2026-10-25T03:30')).toBe('2026-10-25T02:30:00Z');
 });
 it('invalid input is rejected',()=>expect(()=>fromLocalInput('2026-02-30T12:00')).toThrow());
});
