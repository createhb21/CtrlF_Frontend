import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import {
  isApprovedModal,
  modalUtilsName,
  modalUtilsSyntax,
} from '../store/atom';

export const useNotApprovedClicked = (convention) => {
  const [, setNotApprovedModalActive] = useRecoilState(isApprovedModal);

  const setNameState = useSetRecoilState(modalUtilsName);
  const setModalSyntax = useSetRecoilState(modalUtilsSyntax);

  useEffect(() => {
    if (convention == 'topic') {
      setNameState('토픽');
      setModalSyntax('은');
    } else if (convention == 'page') {
      setNameState('페이지');
      setModalSyntax('는');
    }
  }, []);

  setNotApprovedModalActive(true);
};
