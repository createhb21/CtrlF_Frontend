import React, { useEffect, useRef } from 'react';
import { fetchPageList, fetchPageDetail } from '../../../utils/pageDetailFetch';
import styles from '../../../styles/items/notes/noteDetail/sideIndex/index_index.module.css';
import useContextMenu from '../../../hooks/useContextMenu';

import ContextMenu from './ContextMenu';
import { useRecoilState, useSetRecoilState } from 'recoil';
import useNotApprovedClicked from '../../../hooks/useNotApporved';

import {
  topicName,
  topicIndex,
  pageContent,
  pageDataList,
  currentPageId,
  ModifyPageContent,
  firstVisiblePageTitle,
} from '../../../store/atom';

import {
  issueDetailPageVersionNo,
  pageDetailIssueId,
  issueDetailPageId,
  issueDetailTopicId,
} from '../../../store/issueAtom';

function Topic({ topicData }) {
  const setTopicTitle = useSetRecoilState(topicName);
  const setNowTopicIndex = useSetRecoilState(topicIndex); // 페이지 추가를 위해 임시로 작성합니다
  const setPageData = useSetRecoilState(pageDataList);
  const setPageTitle = useSetRecoilState(firstVisiblePageTitle);
  const setPageContent = useSetRecoilState(pageContent);
  const setNowPageId = useSetRecoilState(currentPageId);
  const setIssueId = useSetRecoilState(pageDetailIssueId);
  const setModifyPage = useSetRecoilState(ModifyPageContent);

  const topicNavigatorTapped = (id, title, is_approved) => {
    // if (pageId !== '') {
    //     setPageVersion(null); // 미구현 항목
    // } // 따로 건들지 않겠습니다.
    if (is_approved === false) useNotApprovedClicked('topic');

    getPages(id);
    setTopicTitle(title);
    setNowTopicIndex(id);
  };

  const getPages = async (id) => {
    await fetchPageList(id).then((pages) => {
      const { title, is_approved, version_no, id } = pages[0];

      if (is_approved === false) {
        useNotApprovedClicked('page');
      }
      setPageData(pages);
      setPageTitle(title);
      pageNavigatorTapped(id, version_no);
    });
  };

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

  const topicRef = useRef(null);
  const { xPos, yPos, menu } = useContextMenu(topicRef);

  const [pageId, setPageId] = useRecoilState(issueDetailPageId); // 자세히보기 기능을 위해 임시로 작성
  const [pageVesion, setPageVersion] = useRecoilState(issueDetailPageVersionNo); // 자세히보기 기능에서 페이지의 버전 넘버를 위해 작성
  const [topicId, setTopicId] = useRecoilState(issueDetailTopicId); // 자세히보기 기능을 위해 임시로 작성

  function pageIdClick() {
    const intervalId = setInterval(() => {
      let pageDocument = document.getElementById(`page${pageId}`);
      if (pageDocument != null) {
        pageDocument.click();
        setPageId(null);
        clearInterval(intervalId);
      }
    }, 100);
  }

  useEffect(() => {
    if (topicId != null) {
      document.getElementById(`topic${topicId}`).click();
      setTopicId(null);
      pageIdClick();
    }
  }, []);

  return (
    <ul className={styles.index_topic_ul}>
      {topicData &&
        topicData.map((item, index) => {
          return (
            <li
              key={index}
              ref={topicRef}
              id={`topic${item.id}`}
              className={`${styles.index_topic_li} ${getStyles(
                item.is_approved
              )}`}
              onClick={() => {
                topicNavigatorTapped(item.id, item.title, item.is_approved);
              }}
            >
              <p>{item?.title}</p>
              {menu && (
                <ContextMenu x={xPos} y={yPos} menu={menu} topicId={item.id} />
              )}
            </li>
          );
        })}
    </ul>
  );
}

export default Topic;

function getStyles(status) {
  switch (status) {
    case true:
      return '';
    case false:
      return styles.dark;
  }
}
