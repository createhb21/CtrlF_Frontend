import { useRecoilState } from 'recoil';
import styles from '../../../../../styles/items/notes/noteDetail/sideIndex/addBtn.module.css';
import { preparingModal } from '../../../../../store/atom';
import ModalPreparing from '../../../modal/modal_preparing';

export default function AddBtn() {
  const [showHiddenModal, setShowHiddenModal] = useRecoilState(preparingModal);

  const activeAddTopicModal = () => {
    setShowHiddenModal(true);
  };

  const activeAddPageModal = () => {
    setShowHiddenModal(true);
  };
  return (
    <>
      <div className={styles.addBtn}>
        <button onClick={activeAddTopicModal}>+ 토픽 추가</button>
        <button onClick={activeAddPageModal}>+ 페이지 추가</button>
      </div>
      {showHiddenModal && (
        <div className={styles.notes_modal}>
          <ModalPreparing />
        </div>
      )}
    </>
  );
}
