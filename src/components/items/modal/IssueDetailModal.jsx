import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  issueApproveApi,
  issueCloseApi,
  issueDeleteApi,
  issueRejectApi,
  issuePermissionCheckApi,
} from '../../../utils/issueApi';
import {
  issueDetailTopicId,
  issueDetailPageId,
  issueDetailPageVersionNo,
} from '../../../store/issueAtom';
import { useSetRecoilState } from 'recoil';
import styles from '../../../styles/items/modal/issue_modal.module.css';
import DropMenu from '../menu/IssueDropMenu';
import IssueDetailContent from './IssueDetatilContent';

export default function IssueDetailModal({
  issue,
  setIsModalOpen,
  setIsUnathorized,
}) {
  const [dropDownMenu, setDropDownMenu] = useState(false);

  const setTopicId = useSetRecoilState(issueDetailTopicId);
  const setPageId = useSetRecoilState(issueDetailPageId);
  const setPageVersionNo = useSetRecoilState(issueDetailPageVersionNo);
  const router = useRouter();

  const openDropDown = () => {
    setDropDownMenu(true);
  };

  const moveToDetail = async () => {
    await setTopicId(issue.topic_id);
    await setPageId(issue.page_id);
    await setPageVersionNo(issue.version_no);
    router.push(`/notes/${issue.note_id}`);
  };

  const updatePermissionCheck = async () => {
    const result = await issuePermissionCheckApi(issue.id);
    console.log(result);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const acceptIssue = async () => {
    const result = await issueApproveApi(issue.id);
    if (result && (result.status == 200 || result.status == 204)) {
      setIsModalOpen(false);
      router.reload();
    } else {
      setIsUnathorized(true);
    }
  };

  const rejectIssue = async () => {
    const result = await issueRejectApi(issue.id);
    if (result && result.status == 200) {
      setIsModalOpen(false);
    } else {
      setIsUnathorized(true);
    }
  };

  const closeIssue = async () => {
    const result = await issueCloseApi(issue.id);
    if (result && result.status == 200) {
      setIsModalOpen(false);
      router.reload();
    } else {
      setIsUnathorized(true);
    }
  };

  const deleteIssue = async () => {
    const result = await issueDeleteApi(issue.id);
    if (result && result.status == 200) {
      setIsModalOpen(false);
      router.reload();
    } else {
      setIsUnathorized(true);
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.modal}>
        <div className={styles.drop} onClick={openDropDown}>
          {dropDownMenu && (
            <DropMenu
              updatePermissionCheck={updatePermissionCheck}
              onClick={openDropDown}
              dropDownMenu={dropDownMenu}
              setDropDownMenu={setDropDownMenu}
              closeIssue={closeIssue}
              deleteIssue={deleteIssue}
            />
          )}
        </div>

        <IssueDetailContent
          issue={issue}
          closeModal={closeModal}
          moveToDetail={moveToDetail}
          acceptIssue={acceptIssue}
          rejectIssue={rejectIssue}
        />
      </div>
    </div>
  );
}
