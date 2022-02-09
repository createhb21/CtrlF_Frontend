import React, { useRef } from 'react';
import { useSetRecoilState } from 'recoil';

import ContextMenu from './ContextMenu';
import useContextMenu from '../../../hooks/useContextMenu';
import { fetchPageDetail } from '../../../utils/pageDetailFetch';
import useNotApprovedClicked from '../../../hooks/useNotApporved';

import styles from '../../../styles/items/notes/noteDetail/sideIndex/index_index.module.css';

import {
  currentPageId,
  firstVisiblePageTitle,
  ModifyPageContent,
  pageContent,
} from '../../../store/atom';

import { pageDetailIssueId } from '../../../store/issueAtom';

function Page({ pageData }) {
  const setNowPageId = useSetRecoilState(currentPageId);
  const setPageTitle = useSetRecoilState(firstVisiblePageTitle);
  const setIssueId = useSetRecoilState(pageDetailIssueId);
  const setModifyPage = useSetRecoilState(ModifyPageContent);
  const setPageContent = useSetRecoilState(pageContent);

  const pageNavigatorTapped = async (pageId, version_no) => {
    await fetchPageDetail(pageId, version_no).then((page) => {
      const { id, title, content, is_approved, issue_id } = page;

      if (is_approved === false) useNotApprovedClicked('page');

      setNowPageId(id);
      setPageTitle(title);
      setIssueId(issue_id);
      setModifyPage(false);
      setPageContent(content);
    });
  };

  const pageRef = useRef(null);
  const { xPos, yPos, menu } = useContextMenu(pageRef);

  return (
    <ul className={styles.index_page_ul}>
      {pageData &&
        pageData[0].map((item, index) => {
          return (
            <li
              key={index}
              ref={pageRef}
              id={`page${item.id}`}
              onClick={() => {
                pageNavigatorTapped(item.id, item.version_no);
              }}
              className={`${styles.index_page_li} ${getStyles(
                item.is_approved
              )}`}
            >
              {item?.title ?? null}
              {menu && (
                <ContextMenu x={xPos} y={yPos} menu={menu} pageId={item.id} />
              )}
            </li>
          );
        })}
    </ul>
  );
}

export default Page;

function getStyles(status) {
  switch (status) {
    case true:
      return '';
    case false:
      return styles.dark;
  }
}
