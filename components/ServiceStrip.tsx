import { TruckIcon, ShieldPlainIcon, CalendarIcon, ChatIcon } from './icons';

const services = [
  { Icon: TruckIcon, title: 'Free shipping', note: 'On all orders over ₹999' },
  { Icon: ShieldPlainIcon, title: '1-year warranty', note: 'On every metal tool' },
  { Icon: CalendarIcon, title: '30-day returns', note: 'Hassle-free exchange' },
  { Icon: ChatIcon, title: 'Trade support', note: 'Real answers, not a bot' },
];

export default function ServiceStrip() {
  return (
    <div className="service-strip">
      <div className="service-row">
        {services.map(({ Icon, title, note }) => (
          <div className="service-item" key={title}>
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
