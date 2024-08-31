import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const RichTextEditor = () => {
  const [editorData, setEditorData] = useState('');

  return (
    <div className='editorText'>
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        onChange={(event, editor) => {
          const data = editor.getData();
          setEditorData(data);
        }}
      />
      {/* <div className="output">
        <h3>Output</h3>
        <div dangerouslySetInnerHTML={{ __html: editorData }} />
      </div> */}
    </div>
  );
};

export default RichTextEditor;
