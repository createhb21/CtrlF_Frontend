import Issue from '../items/sidebar/issue';
import Toggle from '../items/sidebar/toggle';
import AddNote from '../items/sidebar/add_note';
import styles from '../../styles/layout/sidebar.module.css';

export default function SideBar() {
  return (
    <div className={styles.container}>
      <Toggle />
      <AddNote />
      <Issue />
    </div>
  );
}