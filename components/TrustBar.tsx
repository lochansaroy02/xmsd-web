import { ShieldIcon, TruckIcon, UsersIcon, ReturnIcon } from './icons';

const items = [
  { Icon: ShieldIcon, title: 'Built to last', note: 'Stainless & salon-grade resin' },
  { Icon: TruckIcon, title: 'Fast dispatch', note: 'Orders ship within 24 hours' },
  { Icon: UsersIcon, title: 'Trade support', note: 'Bulk pricing for salons' },
  { Icon: ReturnIcon, title: 'Easy returns', note: '30-day exchange window' },
];

export default function TrustBar() {
  return (
    <div className="trust">
      <div className="trust-row">
        {items.map(({ Icon, title, note }) => (
          <div className="trust-item" key={title}>
            <Icon />
            <div>
              <b>{title}</b>
              <span>{note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
