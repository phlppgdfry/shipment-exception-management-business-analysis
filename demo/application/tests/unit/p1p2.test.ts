import { expect, test } from 'vitest';
import { initialState } from '@/domain/seed';
import { evaluateOrder, lateness, confirmStatus } from '@/domain/engine';
import { customerView } from '@/domain/customer-view';
import { MockControlTowerApi } from '@/api/mock-api';
import { londonDateKey } from '@/domain/time';

for (const [end,eta] of [
 ['2026-01-31T23:30:00Z','2026-02-01T00:30:00Z'],
 ['2026-12-31T23:30:00Z','2027-01-01T00:30:00Z'],
 ['2028-02-29T23:30:00Z','2028-03-01T00:30:00Z'],
 ['2026-07-31T22:30:00Z','2026-07-31T23:30:00Z'],
]) test(`ER-03 next day crosses ${end}`,()=>{
 const state=initialState(),s=state.shipments['D2D-48213'];
 s.cargo={...s.cargo,unitType:'TRAILER',timeCritical:false};s.deliveryWindow={start:end,end};s.eta=eta;
 expect(londonDateKey(eta)>londonDateKey(end)).toBe(true);expect(lateness(s).nextDay).toBe(true);
 expect(evaluateOrder(state,s.orderRef,'ROAD_DELAY',null).decision.severity).toBe('CRITICAL');
});
test('held and stale statuses never claim an on-schedule delivery; verified on-time status can',()=>{
 const s=initialState();const ex=s.exceptions.find(e=>e.status==='HELD')!;
 expect(customerView(s,ex.orderRef)).toMatchObject({tone:'unknown',headline:'Status awaiting confirmation'});
 const publicText=JSON.stringify(customerView(s,ex.orderRef));expect(publicText).not.toContain(ex.exceptionId);expect(publicText).not.toContain('HELD');
 confirmStatus(s,ex.exceptionId,'ON_TIME',null,'USR-PLANNER');expect(customerView(s,ex.orderRef)?.headline).toBe('On schedule');
 s.now=new Date(Date.parse(s.now)+121*60000).toISOString();expect(customerView(s,ex.orderRef)?.tone).toBe('unknown');
});
test('idempotent receipt binds operation, target, body and actor without partial mutation',async()=>{
 const api=new MockControlTowerApi({latencyMs:0});const ex=api.snapshot().exceptions.find(e=>e.status==='OPEN'&&e.ownerGroup==='ROAD_PLANNING')!;
 const result=await api.addAction(ex.exceptionId,'Contacted customer','USR-PLANNER','receipt');
 const before=structuredClone(api.snapshot());expect(await api.addAction(ex.exceptionId,'Contacted customer','USR-PLANNER','receipt')).toEqual(result);
 for(const act of [()=>api.addAction(ex.exceptionId,'Different body','USR-PLANNER','receipt'),()=>api.addAction('OTHER','Contacted customer','USR-PLANNER','receipt'),()=>api.addAction(ex.exceptionId,'Contacted customer','USR-CS','receipt'),()=>api.acknowledge(ex.exceptionId,'USR-PLANNER','receipt')]) await expect(act()).rejects.toMatchObject({problem:{status:409,title:'Idempotency key conflict'}});
 expect(api.snapshot()).toEqual(before);
 const restored=new MockControlTowerApi({latencyMs:0,state:structuredClone(api.snapshot())});await restored.addAction(ex.exceptionId,'Contacted customer','USR-PLANNER','receipt');expect(restored.snapshot()).toEqual(before);
 const legacy=structuredClone(before);delete legacy.commandReceipts;
 await expect(new MockControlTowerApi({latencyMs:0,state:legacy}).addAction(ex.exceptionId,'Contacted customer','USR-PLANNER','receipt')).rejects.toMatchObject({problem:{status:409}});
});
