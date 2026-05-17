import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaImage, FaListOl, FaListUl, FaQuoteLeft, FaRedo, FaUndo } from "react-icons/fa";
import { MdFormatAlignCenter, MdFormatAlignLeft, MdFormatAlignRight, MdFormatBold, MdFormatItalic, MdTitle } from "react-icons/md";

const unorderedListTypes = [
    { label: "Disc Bullets", value: "disc" },
    { label: "Circle Bullets", value: "circle" },
    { label: "Square Bullets", value: "square" },
];

const orderedListTypes = [
    { label: "Numbered List", value: "decimal" },
    { label: "Lower Alpha List", value: "lower-alpha" },
    { label: "Upper Alpha List", value: "upper-alpha" },
    { label: "Lower Roman List", value: "lower-roman" },
    { label: "Upper Roman List", value: "upper-roman" },
];

function runEditorCommand(command, value = null) {
    if (typeof document === "undefined") return;
    return document.execCommand(command, false, value);
}

function getLanguageDirection(language) {
    return language === "ar" ? "rtl" : "ltr";
}

function isSelectionInsideElement(selection, element) {
    if (!selection || !element || selection.rangeCount === 0) return false;
    return element.contains(selection.getRangeAt(0).commonAncestorContainer);
}

function placeCaretAtEnd(element) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
}

function insertHtmlAtCurrentSelection(html, editorElement) {
    const selection = window.getSelection();
    if (!isSelectionInsideElement(selection, editorElement)) {
        editorElement.focus();
        placeCaretAtEnd(editorElement);
    }
    const activeSelection = window.getSelection();
    const range = activeSelection.getRangeAt(0);
    range.deleteContents();

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    const fragment = document.createDocumentFragment();
    let lastInsertedNode = null;
    while (wrapper.firstChild) {
        lastInsertedNode = fragment.appendChild(wrapper.firstChild);
    }
    range.insertNode(fragment);

    if (lastInsertedNode) {
        const nextRange = document.createRange();
        nextRange.selectNodeContents(lastInsertedNode);
        nextRange.collapse(false);
        activeSelection.removeAllRanges();
        activeSelection.addRange(nextRange);
    }
}

function escapeHtml(value) {
    const escapeBox = document.createElement("div");
    escapeBox.textContent = value;
    return escapeBox.innerHTML;
}

function getSelectionBlockElement(editorElement) {
    const selection = window.getSelection();
    if (!isSelectionInsideElement(selection, editorElement)) return null;
    const anchorNode = selection.anchorNode;
    const activeElement = anchorNode?.nodeType === Node.ELEMENT_NODE ? anchorNode : anchorNode?.parentElement;
    return activeElement?.closest?.("li, h2, blockquote, ul, ol, div, p") || null;
}

function unwrapCurrentListItem(listElement, currentListItem) {
    if (!listElement || !currentListItem) return;
    const listTagName = listElement.tagName.toLowerCase();
    const listStyleType = listElement.style.listStyleType;
    const listItems = Array.from(listElement.children);
    const currentIndex = listItems.indexOf(currentListItem);
    if (currentIndex === -1) return;

    const beforeItems = listItems.slice(0, currentIndex);
    const afterItems = listItems.slice(currentIndex + 1);
    const replacementFragment = document.createDocumentFragment();

    if (beforeItems.length) {
        const beforeList = document.createElement(listTagName);
        if (listStyleType) beforeList.style.listStyleType = listStyleType;
        beforeItems.forEach((item) => beforeList.appendChild(item));
        replacementFragment.appendChild(beforeList);
    }

    const paragraph = document.createElement("p");
    paragraph.innerHTML = currentListItem.innerHTML || "<br>";
    replacementFragment.appendChild(paragraph);

    if (afterItems.length) {
        const afterList = document.createElement(listTagName);
        if (listStyleType) afterList.style.listStyleType = listStyleType;
        afterItems.forEach((item) => afterList.appendChild(item));
        replacementFragment.appendChild(afterList);
    }

    listElement.replaceWith(replacementFragment);
    placeCaretAtEnd(paragraph);
}

function isCaretAtStartOfElement(element) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) return false;
    const range = selection.getRangeAt(0);
    const beforeCaretRange = range.cloneRange();
    beforeCaretRange.selectNodeContents(element);
    beforeCaretRange.setEnd(range.startContainer, range.startOffset);
    return beforeCaretRange.toString().length === 0;
}

export default function ArticleRichEditor({
    value,
    onChange,
    placeholder,
    language,
    errorMsg,
}) {
    const editorRef = useRef(null);
    const imageInputRef = useRef(null);
    const initialValueRef = useRef(value || "");
    const savedSelectionRangeRef = useRef(null);
    const [activeTools, setActiveTools] = useState({});
    const [openedListGallery, setOpenedListGallery] = useState("");
    const { t } = useTranslation();
    const direction = getLanguageDirection(language);

    const syncEditorValue = () => {
        onChange(editorRef.current?.innerHTML || "");
    }

    const saveEditorSelection = () => {
        const selection = window.getSelection();
        if (isSelectionInsideElement(selection, editorRef.current)) {
            savedSelectionRangeRef.current = selection.getRangeAt(0).cloneRange();
            updateActiveTools();
        }
    }

    const restoreEditorSelection = () => {
        const selection = window.getSelection();
        editorRef.current?.focus();
        if (savedSelectionRangeRef.current) {
            selection.removeAllRanges();
            selection.addRange(savedSelectionRangeRef.current);
            return;
        }
        if (editorRef.current) placeCaretAtEnd(editorRef.current);
    }

    const keepEditorSelection = (e) => {
        saveEditorSelection();
        e.preventDefault();
    }

    const handleCommand = (command, value = null) => {
        restoreEditorSelection();
        if (command === "formatBlock" && value === "h2" && activeTools.heading) {
            runEditorCommand("formatBlock", "p");
            updateActiveTools();
            syncEditorValue();
            return;
        }
        if (command === "formatBlock" && value === "blockquote" && activeTools.quote) {
            runEditorCommand("formatBlock", "p");
            updateActiveTools();
            syncEditorValue();
            return;
        }
        if (["justifyLeft", "justifyCenter", "justifyRight"].includes(command) && activeTools[command]) {
            runEditorCommand("justifyLeft");
            setActiveTools((current) => ({
                ...current,
                justifyLeft: false,
                justifyCenter: false,
                justifyRight: false,
            }));
            syncEditorValue();
            return;
        }
        const oldContent = editorRef.current?.innerHTML || "";
        const commandResult = runEditorCommand(command, value);
        const newContent = editorRef.current?.innerHTML || "";
        if ((!commandResult || oldContent === newContent) && command === "insertUnorderedList") {
            runEditorCommand("insertHTML", "<ul><li><br></li></ul>");
        }
        if ((!commandResult || oldContent === newContent) && command === "insertOrderedList") {
            runEditorCommand("insertHTML", "<ol><li><br></li></ol>");
        }
        updateActiveTools();
        syncEditorValue();
    }

    const handleListCommand = (listTagName, listStyleType, shouldToggleActiveList = true) => {
        const editorElement = editorRef.current;
        if (!editorElement) return;
        restoreEditorSelection();
        const currentBlockElement = getSelectionBlockElement(editorElement);
        const currentListElement = currentBlockElement?.closest?.("ul, ol");
        const currentListItem = currentBlockElement?.closest?.("li");
        if (currentListElement?.tagName?.toLowerCase() === listTagName) {
            if (shouldToggleActiveList) {
                unwrapCurrentListItem(currentListElement, currentListItem);
            } else {
                currentListElement.style.listStyleType = listStyleType;
                placeCaretAtEnd(currentListItem || currentListElement);
            }
            saveEditorSelection();
            updateActiveTools();
            syncEditorValue();
            return;
        }

        const selection = window.getSelection();
        const selectedText = isSelectionInsideElement(selection, editorElement) ? selection.toString().trim() : "";
        const listItems = selectedText
            ? selectedText.split(/\r?\n/).filter(Boolean).map((line) => `<li>${escapeHtml(line)}</li>`).join("")
            : "<li><br></li>";

        insertHtmlAtCurrentSelection(`<${listTagName} style="list-style-type:${listStyleType};">${listItems}</${listTagName}>`, editorElement);
        saveEditorSelection();
        updateActiveTools();
        syncEditorValue();
    }

    const handleEditorKeyDown = (e) => {
        if (e.key !== "Backspace") return;
        const editorElement = editorRef.current;
        const currentBlockElement = getSelectionBlockElement(editorElement);
        const currentListItem = currentBlockElement?.closest?.("li");
        const currentListElement = currentBlockElement?.closest?.("ul, ol");
        if (!currentListItem || !currentListElement || !isCaretAtStartOfElement(currentListItem)) return;

        e.preventDefault();
        unwrapCurrentListItem(currentListElement, currentListItem);
        saveEditorSelection();
        updateActiveTools();
        syncEditorValue();
    }

    const handleListGalleryMouseDown = (e) => {
        saveEditorSelection();
        e.preventDefault();
    }

    const toggleListGallery = (galleryName) => {
        setOpenedListGallery((current) => current === galleryName ? "" : galleryName);
    }

    const handleSelectListStyle = (listTagName, listStyleType) => {
        handleListCommand(listTagName, listStyleType, false);
        setOpenedListGallery("");
    }

    const updateActiveTools = () => {
        if (typeof document === "undefined") return;
        const selection = window.getSelection();
        const anchorNode = selection?.anchorNode;
        const activeElement = anchorNode?.nodeType === Node.ELEMENT_NODE ? anchorNode : anchorNode?.parentElement;
        const blockElement = activeElement?.closest?.("h2, blockquote, ul, ol");
        setActiveTools({
            bold: document.queryCommandState("bold"),
            italic: document.queryCommandState("italic"),
            justifyLeft: document.queryCommandState("justifyLeft"),
            justifyCenter: document.queryCommandState("justifyCenter"),
            justifyRight: document.queryCommandState("justifyRight"),
            heading: blockElement?.tagName === "H2",
            quote: blockElement?.tagName === "BLOCKQUOTE",
            unorderedList: blockElement?.tagName === "UL",
            orderedList: blockElement?.tagName === "OL",
        });
    }

    const insertImage = (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = () => {
            editorRef.current?.focus();
            runEditorCommand("insertHTML", `<img src="${reader.result}" alt="" style="max-width:100%;height:auto;display:block;margin:16px auto;" />`);
            syncEditorValue();
            if (imageInputRef.current) imageInputRef.current.value = "";
        };
        reader.readAsDataURL(file);
    }

    return (
        <div className="article-rich-editor">
            <div className="article-rich-editor__toolbar" aria-label={t("Article Editor Toolbar")}>
                <button type="button" className="btn btn-light" title={t("Undo")} onMouseDown={keepEditorSelection} onClick={() => handleCommand("undo")}>
                    <FaUndo />
                </button>
                <button type="button" className="btn btn-light" title={t("Redo")} onMouseDown={keepEditorSelection} onClick={() => handleCommand("redo")}>
                    <FaRedo />
                </button>
                <span className="article-rich-editor__separator" />
                <button type="button" className={`btn btn-light ${activeTools.heading ? "active" : ""}`} title={t("Heading")} onMouseDown={keepEditorSelection} onClick={() => handleCommand("formatBlock", "h2")}>
                    <MdTitle />
                </button>
                <button type="button" className={`btn btn-light ${activeTools.bold ? "active" : ""}`} title={t("Bold Text")} onMouseDown={keepEditorSelection} onClick={() => handleCommand("bold")}>
                    <MdFormatBold />
                </button>
                <button type="button" className={`btn btn-light ${activeTools.italic ? "active" : ""}`} title={t("Italic Text")} onMouseDown={keepEditorSelection} onClick={() => handleCommand("italic")}>
                    <MdFormatItalic />
                </button>
                <span className="article-rich-editor__separator" />
                <div className={`article-rich-editor__list-tool ${activeTools.unorderedList ? "active" : ""}`}>
                    <button
                        type="button"
                        className="article-rich-editor__list-main-button"
                        title={t("Bullet List")}
                        onMouseDown={keepEditorSelection}
                        onClick={() => handleListCommand("ul", "disc", true)}
                    >
                        <FaListUl className="article-rich-editor__list-icon" aria-hidden />
                    </button>
                    <button
                        type="button"
                        className="article-rich-editor__list-gallery-button"
                        title={t("Bullet List")}
                        onMouseDown={handleListGalleryMouseDown}
                        onClick={() => toggleListGallery("unordered")}
                    >
                        <FaChevronDown aria-hidden />
                    </button>
                    {openedListGallery === "unordered" && <div className="article-rich-editor__list-gallery">
                        {unorderedListTypes.map((type) => (
                            <button
                                type="button"
                                key={type.value}
                                className="article-rich-editor__list-gallery-item"
                                onMouseDown={handleListGalleryMouseDown}
                                onClick={() => handleSelectListStyle("ul", type.value)}
                            >
                                <span className="article-rich-editor__list-gallery-preview" style={{ listStyleType: type.value }}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                                <span>{t(type.label)}</span>
                            </button>
                        ))}
                    </div>}
                </div>
                <div className={`article-rich-editor__list-tool ${activeTools.orderedList ? "active" : ""}`}>
                    <button
                        type="button"
                        className="article-rich-editor__list-main-button"
                        title={t("Numbered List")}
                        onMouseDown={keepEditorSelection}
                        onClick={() => handleListCommand("ol", "decimal", true)}
                    >
                        <FaListOl className="article-rich-editor__list-icon" aria-hidden />
                    </button>
                    <button
                        type="button"
                        className="article-rich-editor__list-gallery-button"
                        title={t("Numbered List")}
                        onMouseDown={handleListGalleryMouseDown}
                        onClick={() => toggleListGallery("ordered")}
                    >
                        <FaChevronDown aria-hidden />
                    </button>
                    {openedListGallery === "ordered" && <div className="article-rich-editor__list-gallery article-rich-editor__list-gallery--ordered">
                        {orderedListTypes.map((type) => (
                            <button
                                type="button"
                                key={type.value}
                                className="article-rich-editor__list-gallery-item"
                                onMouseDown={handleListGalleryMouseDown}
                                onClick={() => handleSelectListStyle("ol", type.value)}
                            >
                                <span className="article-rich-editor__list-gallery-preview" style={{ listStyleType: type.value }}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                                <span>{t(type.label)}</span>
                            </button>
                        ))}
                    </div>}
                </div>
                <button type="button" className={`btn btn-light ${activeTools.quote ? "active" : ""}`} title={t("Quote")} onMouseDown={keepEditorSelection} onClick={() => handleCommand("formatBlock", "blockquote")}>
                    <FaQuoteLeft />
                </button>
                <span className="article-rich-editor__separator" />
                <button type="button" className={`btn btn-light ${activeTools.justifyLeft ? "active" : ""}`} title={t("Align Left")} onMouseDown={keepEditorSelection} onClick={() => handleCommand("justifyLeft")}>
                    <MdFormatAlignLeft />
                </button>
                <button type="button" className={`btn btn-light ${activeTools.justifyCenter ? "active" : ""}`} title={t("Align Center")} onMouseDown={keepEditorSelection} onClick={() => handleCommand("justifyCenter")}>
                    <MdFormatAlignCenter />
                </button>
                <button type="button" className={`btn btn-light ${activeTools.justifyRight ? "active" : ""}`} title={t("Align Right")} onMouseDown={keepEditorSelection} onClick={() => handleCommand("justifyRight")}>
                    <MdFormatAlignRight />
                </button>
                <span className="article-rich-editor__separator" />
                <button type="button" className="btn btn-light" title={t("Insert Image")} onMouseDown={keepEditorSelection} onClick={() => imageInputRef.current?.click()}>
                    <FaImage />
                </button>
                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={(e) => insertImage(e.target.files[0])}
                />
            </div>
            <div
                ref={editorRef}
                className={`article-rich-editor__surface ${errorMsg ? "border-danger" : ""}`}
                contentEditable
                dir={direction}
                data-placeholder={placeholder}
                dangerouslySetInnerHTML={{ __html: initialValueRef.current }}
                onInput={() => {
                    saveEditorSelection();
                    syncEditorValue();
                }}
                onKeyUp={saveEditorSelection}
                onKeyDown={handleEditorKeyDown}
                onMouseUp={saveEditorSelection}
                onFocus={saveEditorSelection}
                suppressContentEditableWarning
            />
        </div>
    );
}
