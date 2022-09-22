import React, { useEffect, useMemo, useRef, useCallback } from "react";
import ReactQuill from "react-quill";
import axios from "axios";
import clsx from "clsx";
//style
import "./style/Editor.css";

// Accessing the Quill backing instance using React ref functions
const Quill = ReactQuill.Quill;

const Editor = ({
  setQuillRef,
  setReactQuillRef,
  onEditorChange,
  display = "block",
  readOnly = false,
}) => {
  const quillRef = useRef(null);
  const reactQuillRef = useRef(null);

  var Block = Quill.import("blots/block");
  Block.tagName = "DIV";
  Block.className = "MultipleDiv";
  Quill.register(Block, true);

  const attachQuillRefs = useCallback(() => {
    // Ensure React-Quill reference is available:
    if (typeof reactQuillRef.current.getEditor !== "function") return;
    // Skip if Quill reference is defined:
    if (quillRef.current != null) return;
    // const quillRef = reactQuillRef.getEditor();
    quillRef.current = reactQuillRef.current.getEditor();
    if (quillRef.current != null)
      quillRef.current = reactQuillRef.current.getEditor();

    setQuillRef(quillRef);
    setReactQuillRef(reactQuillRef);
  }, [setQuillRef, setReactQuillRef]);

  /* -------- 이미지 처리 핸들러 --------*/
  const imageHandler = () => {
    //함수에 이미지업로드 input 연결
    const input = document.getElementById("imageUpload");
    console.log("input", input);
    input.click();

    const changeListener = async () => {
      const files = Object.values(input.files);

      const formData = new FormData();
      formData.append("email", sessionStorage.getItem("loginEmail"));
      Object.values(files).forEach((file) => {
        formData.append("file", file);
        formData.append("image", encodeURIComponent(file.name));
      });

      // for (let value of formData.values()) {
      //   console.log(value);
      // }

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      };

      axios
        .put(
          `${process.env.REACT_APP_API_ROOT}/etc/editorurl`,
          formData,
          config
        )
        .then((res) => {
          // console.log(res.data);
          const editor = reactQuillRef.current.getEditor(); // 에디터 객체 가져오기
          const range = editor.getSelection(); //커서 위치
          const imgs = Object.values(res.data);

          for (var img of imgs) {
            // console.log(img);
            editor.insertEmbed(
              range.index,
              "image",
              `${process.env.REACT_APP_UPLOAD_URL}${img}`
            );
          }

          input.removeEventListener("change", changeListener);
        })
        .catch((error) => console.log(error.response));
    };

    input.addEventListener("change", changeListener);
  };

  /* -------- 툴바 세팅 --------*/
  const modules = useMemo(() => {
    return display !== "none"
      ? {
          toolbar: {
            container: [
              ["image"],
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
            ],
            handlers: {
              // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
              image: imageHandler,
            },
          },
        }
      : {
          toolbar: {
            container: [
              ["image"],
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
            ],
          },
        };
  }, [display]);

  // const modules = useMemo(() => {
  //   return display === "none"
  //     ? {
  //         toolbar: {
  //           container: [
  //             ["image"],
  //             [{ header: [1, 2, 3, false] }],
  //             ["bold", "italic", "underline", "strike", "blockquote"],
  //           ],
  //         },
  //       }
  //     : {
  //         toolbar: {
  //           container: [
  //             ["image"],
  //             [{ header: [1, 2, 3, false] }],
  //             ["bold", "italic", "underline", "strike", "blockquote"],
  //           ],
  //           handlers: {
  //             // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
  //             image: imageHandler,
  //           },
  //         },
  //       };
  // }, []);

  // Editor.modules = {};
  // Editor.modules.toolbar =
  //   display === "none"
  //     ? {
  //         container: [
  //           //["bold", "italic", "underline", "strike"], // toggled buttons
  //           // ["blockquote", "code-block"], // blocks
  //           // [{ header: 1 }, { header: 2 }], // custom button values
  //           [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  //           // [{ header: [1, 2, 3, 4, 5, 6, false] }], // header dropdown
  //           [{ list: "ordered" }, { list: "bullet" }], // lists
  //           // [{ script: "sub" }, { script: "super" }], // superscript/subscript
  //           // [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  //           // [{ direction: "rtl" }], // text direction
  //           [{ color: [] }, { background: [] }], // dropdown with defaults
  //           // [{ font: [] }], // font family
  //           [{ align: [] }], // text align
  //           // ["clean"], // remove formatting
  //           [{ link: "link" }, { image: "image" }],
  //         ],
  //       }
  //     : {
  //         container: [
  //           //["bold", "italic", "underline", "strike"], // toggled buttons
  //           // ["blockquote", "code-block"], // blocks
  //           // [{ header: 1 }, { header: 2 }], // custom button values
  //           [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  //           // [{ header: [1, 2, 3, 4, 5, 6, false] }], // header dropdown
  //           [{ list: "ordered" }, { list: "bullet" }], // lists
  //           // [{ script: "sub" }, { script: "super" }], // superscript/subscript
  //           // [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  //           // [{ direction: "rtl" }], // text direction
  //           [{ color: [] }, { background: [] }], // dropdown with defaults
  //           // [{ font: [] }], // font family
  //           [{ align: [] }], // text align
  //           // ["clean"], // remove formatting
  //           [{ link: "link" }, { image: "image" }],
  //         ],
  //         handlers: {
  //           // 이미지 직접 처리
  //           image: imageHandler,
  //         },
  //       };
  /*
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  Editor.formats = [
    "header",
    "font",
    "background",
    "color",
    "code",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "script",
    "align",
    "direction",
    "link",
    "image",
    "code-block",
    "formula",
    "audio",
  ];

  useEffect(() => {
    attachQuillRefs();
  }, [reactQuillRef, attachQuillRefs]);

  /* -------- return --------*/
  return (
    <div className="BG-white">
      <ReactQuill
        ref={reactQuillRef}
        theme={"snow"}
        modules={modules}
        formats={Editor.formats}
        placeholder="내용을 입력하세요."
        className={clsx("quill-container editor-height", {
          isView: display === "none",
        })}
        onChange={onEditorChange}
        readOnly={readOnly}
      />
      <input
        className="none"
        id="imageUpload"
        type="file"
        name="image"
        multiple="multiple"
        accept="image/*"
      />
    </div>
  );
};

export default Editor;
