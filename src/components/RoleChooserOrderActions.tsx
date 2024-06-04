import styles from './RoleChooserOrderActions.module.css';
import UserOrderBy from '../enums/user-order-by.enum';

export default function RoleChooserOrderActions({ setUserOrderBy }: ({ setUserOrderBy: (value) => void })) {
  return (
    <div>
      <button
        type="button"
        onClick={() => setUserOrderBy(UserOrderBy.NAME)}
        className={`${styles['role-chooser-order-by-name']} button-general`}
      >
        Order by name
      </button>
      <button
        type="button"
        onClick={() => setUserOrderBy(UserOrderBy.ID)}
        className={`${styles['role-chooser-order-by-id']} button-general`}
      >
        Order by id
      </button>
    </div>
  );
}
