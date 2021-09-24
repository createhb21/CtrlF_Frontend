import { useState } from 'react';
import remarkGfm from 'remark-gfm';
import { useRecoilValue } from 'recoil';
import ReactMarkdown from 'react-markdown';
import { addNewPage } from '../../../../store/atom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import styles from '../../../../styles/items/notes/noteDetail/markdownEditor.module.css';

export default function MarkdownEditor(props) {
  const content = props.contents;
  const [input, setInput] = useState(null);
  const [preview, setPreiview] = useState(false);
  const addNewContent = useRecoilValue(addNewPage);

  const useTab = (e) => {
    if (e.key == 'Tab') {
      e.preventDefault();
    }
  };

  const onChangeStatus = (status) => {
    status == 'write' ? setPreiview(false) : setPreiview(true);
    if (status == 'preview') {
      setPreiview(true);
    }
  };

  return (
    <div className={styles.editor_wrap}>
      <span className={styles.editor_button}>
        <button onClick={() => onChangeStatus('write')}>Write</button>
        <button onClick={() => onChangeStatus('preview')}>Preview</button>
      </span>
      <span as="h3" className={styles.detail_content}>
        {!preview ? (
          <>
            {!addNewContent && (
              <input
                type="text"
                placeholder="수정 사유"
                className={styles.users_input}
                required
              />
            )}
            <textarea
              name="text"
              value={input}
              placeholder="page content"
              onKeyDown={useTab}
              onChange={(e) => setInput(e.target.value)}
              className={styles.users_textarea}
              required
              autoFocus
            >
              {addNewContent ? null : content}
            </textarea>
          </>
        ) : (
          <ReactMarkdown
            className={styles.preview}
            remarkPlugins={[remarkGfm]}
            // eslint-disable-next-line react/no-children-prop
            // children={
            //   !addNewContent ? (input == null ? content : input) : input
            // }
            components={{
              code: CodeBlock,
            }}
          >
            {!addNewContent ? (input == null ? content : input) : input}
          </ReactMarkdown>
        )}
      </span>
    </div>
  );
}

const CodeBlock = ({ language, value }) => {
  return (
    <SyntaxHighlighter language={language ?? null} style={docco}>
      {value ?? ''}
    </SyntaxHighlighter>
  );
};