import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { iconMap, iconKeys } from '../../data/iconMap';

function IconPicker({ value, onChange }) {
  return (
    <div className="admin-icon-picker">
      {iconKeys.map((key) => (
        <button
          key={key}
          type="button"
          className={key === value ? 'is-selected' : ''}
          title={iconMap[key].label}
          onClick={() => onChange(key)}
        >
          <FontAwesomeIcon icon={iconMap[key].icon} />
        </button>
      ))}
    </div>
  );
}

export default IconPicker;
