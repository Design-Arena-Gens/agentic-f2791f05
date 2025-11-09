import dynamic from 'next/dynamic';
import { CanvasAssignments } from '@/components/CanvasAssignments';
import { Goals } from '@/components/Goals';
import { Reminders } from '@/components/Reminders';
import { Schedule } from '@/components/Schedule';
import { Settings } from '@/components/Settings';

const Page = () => {
  return (
    <div className="grid">
      <section className="card span-2">
        <h2>Today\'s Schedule</h2>
        <Schedule />
      </section>

      <section className="card">
        <h2>Goals</h2>
        <Goals />
      </section>

      <section className="card">
        <h2>Reminders</h2>
        <Reminders />
      </section>

      <section className="card span-2">
        <div className="row">
          <h2 className="grow">Canvas Assignments</h2>
          <Settings />
        </div>
        <CanvasAssignments />
      </section>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Page), { ssr: false });
